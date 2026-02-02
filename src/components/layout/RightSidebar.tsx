"use client";

import { ArrowTrendingUpIcon, CalendarIcon, UserGroupIcon } from "@heroicons/react/24/outline";

interface HighlightCard {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  action: string;
  href: string;
}

const highlights: HighlightCard[] = [
  {
    id: "1",
    icon: CalendarIcon,
    title: "Elite Youth Trial",
    subtitle: "Manchester • This Weekend",
    action: "Apply",
    href: "/events/1",
  },
  {
    id: "2",
    icon: ArrowTrendingUpIcon,
    title: "Top Performance",
    subtitle: "Marcus T. • 3 Goals",
    action: "View",
    href: "/profile/marcus",
  },
  {
    id: "3",
    icon: UserGroupIcon,
    title: "New Connections",
    subtitle: "12 scouts viewed your profile",
    action: "See",
    href: "/notifications",
  },
  {
    id: "4",
    icon: CalendarIcon,
    title: "U-19 Tournament",
    subtitle: "London • Next Month",
    action: "Details",
    href: "/events/2",
  },
  {
    id: "5",
    icon: ArrowTrendingUpIcon,
    title: "Rising Star",
    subtitle: "Sarah K. • 5 Assists",
    action: "View",
    href: "/profile/sarah",
  },
];

export default function RightSidebar() {
  return (
    <aside className="hidden xl:flex xl:flex-col w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Highlights
          </h2>
          <button className="text-xs text-gameon-blue-600 hover:text-gameon-blue-700 font-medium">
            View All
          </button>
        </div>

        {/* Highlight Cards */}
        <div className="space-y-2">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <a
                key={highlight.id}
                href={highlight.href}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-gameon-blue-400 dark:hover:border-gameon-blue-500 hover:shadow-md transition-all duration-200 group"
              >
                {/* Icon */}
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-gameon-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {highlight.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {highlight.subtitle}
                  </p>
                </div>

                {/* Action */}
                <div className="flex-shrink-0">
                  <span className="text-xs font-medium text-gameon-blue-600 group-hover:text-gameon-blue-700 dark:text-gameon-blue-400 dark:group-hover:text-gameon-blue-300">
                    {highlight.action} →
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Trending Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Trending Sports
          </h3>
          <div className="space-y-2">
            {["⚽ Soccer", "🏀 Basketball", "🏏 Cricket", "🎾 Tennis"].map((sport, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="text-sm text-slate-700 dark:text-slate-300">{sport}</span>
                <span className="text-xs text-slate-500">
                  {Math.floor(Math.random() * 500 + 100)}k posts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
