import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any;
    const path = req.nextUrl.pathname;

    // User is authenticated
    if (token) {
      const isOnboardingCompleted = token.onboardingCompleted === true;

      // If onboarding not completed, redirect to sports-preferences (except if already there)
      if (!isOnboardingCompleted && path !== "/sports-preferences") {
        return NextResponse.redirect(new URL("/sports-preferences", req.url));
      }

      // If onboarding is completed and trying to access sports-preferences, redirect to dashboard
      if (isOnboardingCompleted && path === "/sports-preferences") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Prevent authenticated users from accessing login/signup pages
      if (path === "/login" || path === "/signup") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Authorize callback: return true if user should be allowed, false to redirect to sign-in
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Allow access to public routes without auth
        if (path === "/" || path === "/login" || path === "/signup") {
          return true;
        }
        
        // All other routes require authentication
        return !!token;
      },
    },
    pages: {
      signIn: "/", // Redirect unauthenticated users to landing page
    },
  }
);

export const config = {
  matcher: [
    // Protected routes requiring authentication
    "/dashboard/:path*",
    "/profile/:path*",
    "/feed/:path*",
    "/events/:path*",
    "/search/:path*",
    "/sports-preferences",
    // Auth pages (to redirect if already logged in)
    "/login",
    "/signup",
  ],
};
