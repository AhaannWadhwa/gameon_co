import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logError } from "@/lib/errors";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        logError(new Error("Missing credentials"), "AUTH_AUTHORIZE");
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email.toLowerCase(),
                        },
                    });

                    if (!user || !user.password) {
                        logError(
                            new Error(`Invalid login: ${credentials.email}`),
                            "AUTH_AUTHORIZE"
                        );
                        return null;
                    }

                    const valid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!valid) {
                        logError(
                            new Error(`Wrong password: ${credentials.email}`),
                            "AUTH_AUTHORIZE"
                        );
                        return null;
                    }

                    if (user.status === "SUSPENDED") {
                        logError(
                            new Error(`Suspended account: ${credentials.email}`),
                            "AUTH_AUTHORIZE"
                        );
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        image: user.image,
                        onboardingCompleted: user.onboardingCompleted,
                    };
                } catch (err) {
                    logError(err, "AUTH_AUTHORIZE");
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            // For Google OAuth, check if user needs to select role
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                // If new Google user, create with default role ATHLETE
                // User will be redirected to onboarding to select proper role
                if (!existingUser) {
                    // The adapter will create the user, but we'll update it with default role
                    return true;
                }
            }
            return true;
        },

        async jwt({ token, user, account, trigger }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.onboardingCompleted = user.onboardingCompleted;
            }

            // For OAuth users on first login, fetch from database to get role
            if (account?.provider === "google" && !token.role) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email! },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.onboardingCompleted = dbUser.onboardingCompleted;
                }
            }

            // When update() is called (e.g., after onboarding), refresh token from database
            if (trigger === "update" && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string },
                    select: {
                        id: true,
                        role: true,
                        onboardingCompleted: true,
                    },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.onboardingCompleted = dbUser.onboardingCompleted;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role;
                session.user.onboardingCompleted =
                    token.onboardingCompleted as boolean;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,

    debug: process.env.NODE_ENV === "development",
};
