import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Requires user to be authenticated. Redirects to landing page if not.
 * @returns User session
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/");
  }
  
  return session;
}

/**
 * Checks if user has completed onboarding. Redirects to sports-preferences if not.
 * @param session User session
 */
export function checkOnboarding(session: any) {
  if (!session.user.onboardingCompleted) {
    redirect("/sports-preferences");
  }
}

/**
 * Requires user to be authenticated AND have completed onboarding.
 * Redirects to landing page if not authenticated.
 * Redirects to sports-preferences if onboarding not completed.
 * @returns User session
 */
export async function requireOnboarding() {
  const session = await requireAuth();
  checkOnboarding(session);
  return session;
}

/**
 * Gets current user session without requiring auth (nullable).
 * @returns User session or null
 */
export async function getUserSession() {
  return await getServerSession(authOptions);
}
