"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopBarProps {
  onViewChange?: (view: "posts" | "events" | "people") => void;
}

export default function TopBar({ onViewChange }: TopBarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [activeView, setActiveView] = useState<"posts" | "events" | "people">("posts");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleViewChange = (view: "posts" | "events" | "people") => {
    setActiveView(view);
    onViewChange?.(view);
  };

  const getUserRoleBadge = () => {
    const role = (session?.user as any)?.role;
    if (!role) return null;
    
    const colors: Record<string, string> = {
      ATHLETE: "bg-blue-500",
      COACH: "bg-indigo-500",
      ACADEMY: "bg-emerald-500",
    };
    
    return (
      <span className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${colors[role] || "bg-gray-500"} border-2 border-white dark:border-slate-900`} />
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="h-16 px-4 flex items-center justify-between max-w-[1920px] mx-auto">
        {/* Left: Toggle Navigation */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => handleViewChange("posts")}
            className={`
              px-4 py-2 rounded-full font-medium text-sm transition-all duration-200
              ${activeView === "posts"
                ? "bg-gameon-blue-600 text-white shadow-md"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }
            `}
          >
            Posts
          </button>
          <button
            onClick={() => handleViewChange("events")}
            className={`
              px-4 py-2 rounded-full font-medium text-sm transition-all duration-200
              ${activeView === "events"
                ? "bg-gameon-blue-600 text-white shadow-md"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }
            `}
          >
            Events
          </button>
          <button
            onClick={() => handleViewChange("people")}
            className={`
              px-4 py-2 rounded-full font-medium text-sm transition-all duration-200
              ${activeView === "people"
                ? "bg-gameon-blue-600 text-white shadow-md"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }
            `}
          >
            People You Follow
          </button>
        </nav>

        {/* Right: Profile Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="relative flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-gameon-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
              {getUserRoleBadge()}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-20">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white">{session?.user?.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{session?.user?.email}</p>
                  <p className="text-xs text-gameon-blue-600 dark:text-gameon-blue-400 mt-1">
                    {(session?.user as any)?.role}
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setShowProfileMenu(false)}
                >
                  View Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Settings
                </Link>
                <hr className="my-2 border-slate-200 dark:border-slate-700" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Add logout functionality
                    window.location.href = "/api/auth/signout";
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
