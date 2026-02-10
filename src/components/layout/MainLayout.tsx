"use client";

import { useState, ReactNode } from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import FeedContainer from "@/components/feed/FeedContainer";

interface MainLayoutProps {
  children?: ReactNode;
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
          <FeedContainer view={activeView} />
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
