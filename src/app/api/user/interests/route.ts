import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { interests } = body;

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json(
        { error: 'At least one interest must be selected.' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        interests: interests,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({
      message: 'Interests updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating interests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
