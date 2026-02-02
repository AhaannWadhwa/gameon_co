import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view") || "posts";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get current user with interests and connections
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        interests: true,
        role: true,
        sentConnections: {
          where: { status: "ACCEPTED" },
          select: { receiverId: true },
        },
        receivedConnections: {
          where: { status: "ACCEPTED" },
          select: { senderId: true },
        },
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build list of followed user IDs (both sent and received connections)
    const followedUserIds = [
      ...currentUser.sentConnections.map((c) => c.receiverId),
      ...currentUser.receivedConnections.map((c) => c.senderId),
    ];

    // Build WHERE clause for personalization
    const whereClause: any = {
      visibility: "PUBLIC",
      OR: [],
    };

    // Filter 1: Posts from followed users
    if (followedUserIds.length > 0) {
      whereClause.OR.push({
        authorId: { in: followedUserIds },
      });
    }

    // Filter 2: Posts with matching sports interests
    if (currentUser.interests && currentUser.interests.length > 0) {
      whereClause.OR.push({
        sportsTags: { hasSome: currentUser.interests },
      });
    }

    // Filter 3: Category-based filtering
    // Athletes see content from coaches and academies
    // Coaches see content from athletes
    // Academies see content from athletes and coaches
    const roleBasedFilters: Record<string, any> = {
      ATHLETE: {
        author: {
          role: { in: ["COACH", "ACADEMY", "ATHLETE"] },
        },
      },
      COACH: {
        author: {
          role: { in: ["ATHLETE", "ACADEMY", "COACH"] },
        },
      },
      ACADEMY: {
        author: {
          role: { in: ["ATHLETE", "COACH", "ACADEMY"] },
        },
      },
    };

    if (roleBasedFilters[currentUser.role]) {
      whereClause.OR.push(roleBasedFilters[currentUser.role]);
    }

    // If no filters matched, show all public posts
    if (whereClause.OR.length === 0) {
      delete whereClause.OR;
    }

    // Fetch posts
    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
      },
    });

    // Get total count for pagination
    const total = await prisma.post.count({
      where: whereClause,
    });

    // Format response
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      author: {
        id: post.author.id,
        name: post.author.name,
        role: post.author.role,
        avatar: post.author.image || post.author.name[0].toUpperCase(),
      },
      content: post.content,
      sportsTags: post.sportsTags,
      mediaUrls: post.mediaUrls,
      timestamp: getRelativeTime(post.createdAt),
      likes: post.likes.length,
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.userId === userId),
      createdAt: post.createdAt,
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error("Feed API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}
