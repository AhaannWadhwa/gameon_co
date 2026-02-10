import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Handler
const handler = NextAuth(authOptions);

// Required for App Router - export only HTTP methods
export { handler as GET, handler as POST };