"use client";

import { useState, useEffect } from "react";

interface FeedPost {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  sportsTags: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface FeedContainerProps {
  view?: "posts" | "events" | "people";
}

export default function FeedContainer({ view = "posts" }: FeedContainerProps) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/feed?view=${view}&limit=20&offset=0`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch feed");
        }
        
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err: any) {
        setError(err.message);
        console.error("Feed fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, [view]);

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      ATHLETE: "bg-blue-500",
      COACH: "bg-indigo-500",
      ACADEMY: "bg-emerald-500",
    };
    return colors[role] || "bg-gray-500";
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <p className="text-red-600 dark:text-red-400">Failed to load feed: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No posts yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Start following people and add sports interests to see personalized content.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/explore"
              className="px-4 py-2 bg-gameon-blue-600 text-white rounded-lg hover:bg-gameon-blue-700 transition-colors"
            >
              Explore
            </a>
            <a
              href="/sports-preferences"
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Update Interests
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Create Post Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <textarea
          placeholder="What's on your mind?"
          className="w-full border-0 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 resize-none"
          rows={3}
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </button>
          </div>
          <button className="px-4 py-2 bg-gameon-blue-600 text-white rounded-lg font-medium hover:bg-gameon-blue-700 transition-colors">
            Post
          </button>
        </div>
      </div>

      {/* Feed Posts */}
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-gameon-blue-400 dark:hover:border-gameon-blue-500 transition-colors"
        >
          {/* Post Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className={`h-12 w-12 rounded-full ${getRoleBadgeColor(post.author.role)} flex items-center justify-center text-white font-bold`}>
              {post.author.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {post.author.name}
                </h3>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-sm text-slate-500">{post.timestamp}</span>
              </div>
              <p className="text-xs text-slate-500">{post.author.role}</p>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-slate-700 dark:text-slate-300 mb-3">
            {post.content}
          </p>

          {/* Sports Tags */}
          {post.sportsTags && post.sportsTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.sportsTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gameon-blue-100 dark:bg-gameon-blue-950/30 text-gameon-blue-700 dark:text-gameon-blue-400 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-6 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button className={`flex items-center gap-2 transition-colors ${
              post.isLiked
                ? "text-red-500"
                : "text-slate-600 dark:text-slate-400 hover:text-gameon-blue-600 dark:hover:text-gameon-blue-400"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill={post.isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-gameon-blue-600 dark:hover:text-gameon-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
              </svg>
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-gameon-blue-600 dark:hover:text-gameon-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
