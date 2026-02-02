"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BellIcon as BellIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: BellIcon,
    iconSolid: BellIconSolid,
    badge: 3,
  },
  {
    name: "Explore",
    href: "/explore",
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: ChatBubbleLeftIcon,
    iconSolid: ChatBubbleLeftIconSolid,
  },
  {
    name: "Search",
    href: "/search",
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserIcon,
    iconSolid: UserIconSolid,
  },
];

export default function LeftSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex md:flex-col w-20 xl:w-60 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = active ? item.iconSolid : item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200
                ${active
                  ? "bg-gameon-blue-50 dark:bg-gameon-blue-950/30 text-gameon-blue-600 dark:text-gameon-blue-400"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
            >
              <div className="relative">
                <Icon className="h-6 w-6 flex-shrink-0" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="hidden xl:block font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* More Button */}
        <button className="group flex items-center gap-4 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 w-full">
          <EllipsisHorizontalIcon className="h-6 w-6 flex-shrink-0" />
          <span className="hidden xl:block font-medium">More</span>
        </button>
      </nav>

      {/* New Post Button */}
      <div className="p-2 pb-4">
        <button className="w-full bg-gradient-to-r from-gameon-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden xl:block">New Post</span>
        </button>
      </div>
    </aside>
  );
}
