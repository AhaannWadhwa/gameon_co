import NextAuth, { AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logError } from "@/lib/errors";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            logError(
              new Error("Missing credentials"),
              "AUTH_AUTHORIZE"
            );
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || !user.password) {
            logError(
              new Error(`Login attempt for non-existent user: ${credentials.email}`),
              "AUTH_AUTHORIZE"
            );
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            logError(
              new Error(`Invalid password attempt for user: ${credentials.email}`),
              "AUTH_AUTHORIZE"
            );
            return null;
          }

          // Check if user account is active
          if (user.status === "SUSPENDED") {
            logError(
              new Error(`Suspended account login attempt: ${credentials.email}`),
              "AUTH_AUTHORIZE"
            );
            return null;
          }

          console.log(`✅ Successful login: ${user.email}`);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            onboardingCompleted: user.onboardingCompleted,
          };
        } catch (error) {
          logError(error, "AUTH_AUTHORIZE");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
