"use client";

import { useState, ReactNode } from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

interface MainLayoutProps {
  children: ReactNode | ((view: "posts" | "events" | "people") => ReactNode);
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [activeView, setActiveView] = useState<"posts" | "events" | "people">("posts");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
      <TopBar onViewChange={setActiveView} />

      {/* Main Container */}
      <div className="max-w-[1920px] mx-auto flex">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Center Feed */}
        <main className="flex-1 min-w-0">
          {typeof children === 'function' ? children(activeView) : children}
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
