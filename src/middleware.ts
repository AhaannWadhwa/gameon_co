import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any;
    const path = req.nextUrl.pathname;

    if (token) {
        // If onboarding is NOT incomplete (assuming default false or undefined means incomplete if we want to force it, 
        // but schema has default false. However, existing users might be undefined if not updated? 
        // No, prisma migration handles it. New users will be false.)
        
        // Ensure boolean check
        const isCompleted = token.onboardingCompleted === true;

        if (!isCompleted && !path.startsWith("/onboarding")) {
             return NextResponse.redirect(new URL("/onboarding", req.url));
        }

        if (isCompleted && path.startsWith("/onboarding")) {
             return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/onboarding"],
};
