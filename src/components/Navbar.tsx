"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { Logo } from "@/components/Logo";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-custom flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Logo className="w-[140px] h-[70px] text-primary" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#community"
            className="hover:text-primary transition-colors"
          >
            Community
          </Link>
          <Link
            href="#pricing"
            className="hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {/* @ts-ignore - role is added via callback */}
                    {session.user.role || "User"}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold border-2 border-background shadow-sm">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(session.user.name || "User")}</span>
                  )}
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-border sm:hidden">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Profile
                  </Link>
                  <div className="px-4 py-2 flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Theme</span>
                     <div className="flex bg-muted rounded-full p-1 border border-border relative">
                        <button
                          onClick={() => setTheme("light")}
                          className={`p-1.5 rounded-full transition-all duration-300 ${
                            theme === "light" 
                              ? "bg-background text-yellow-500 shadow-sm" 
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          aria-label="Light Mode"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`p-1.5 rounded-full transition-all duration-300 ${
                            theme === "dark" 
                              ? "bg-background text-foreground shadow-sm" 
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          aria-label="Dark Mode"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>
                        </button>
                     </div>
                  </div>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
