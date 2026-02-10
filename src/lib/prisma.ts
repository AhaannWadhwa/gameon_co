import { PrismaClient } from "@prisma/client";

// ========== ENVIRONMENT DIAGNOSTICS ==========
const isDevelopment = process.env.NODE_ENV !== "production";
const isProduction = process.env.NODE_ENV === "production";

// Note: Validation happens at PrismaClient instantiation time, not at module import time
// This prevents errors from showing in the browser during page load

// Production validations are now done lazily at runtime in API routes

// ========== PRISMA CLIENT CONFIGURATION ==========
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Serverless-optimized Prisma Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment
      ? ["query", "error", "warn"]
      : ["error"],
    errorFormat: isDevelopment ? "pretty" : "minimal",
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Prevent multiple instances in development (not in production for serverless)
if (isDevelopment) {
  globalForPrisma.prisma = prisma;
}

// ========== CONNECTION MANAGEMENT ==========
// Note: In serverless (Vercel), connections are ephemeral
// Each function invocation may get a new connection

// Test connection helper
export async function testConnection(): Promise<{
  success: boolean;
  error?: string;
  latency?: number;
}> {
  const start = Date.now();
  
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    
    console.log(`✅ Database connection successful (${latency}ms)`);
    return { success: true, latency };
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error("❌ Database connection test failed:", errorMessage);
    
    // Provide helpful diagnostic info
    if (errorMessage.includes("P1001") || errorMessage.includes("Can't reach database")) {
      console.error(
        "🔍 Connection error troubleshooting:\n" +
        "  1. Verify DATABASE_URL is set correctly in environment\n" +
        "  2. Check database server is running and accessible\n" +
        "  3. Ensure firewall allows connections from Vercel IPs\n" +
        "  4. For Supabase/Neon: Use connection pooling URL\n" +
        "  5. Check database credentials are correct"
      );
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  } finally {
    // In serverless, let Prisma manage disconnection
    if (isDevelopment) {
      await prisma.$disconnect();
    }
  }
}

// Connection testing is now done on-demand in API routes, not at module load time
// This prevents connection attempts during page loads and build-time

// ========== GRACEFUL SHUTDOWN (Development only) ==========
// In serverless/production, connections are managed per-request
if (isDevelopment) {
  const shutdown = async () => {
    console.log("Closing database connections...");
    await prisma.$disconnect();
    console.log("Database disconnected");
  };

  process.on("beforeExit", shutdown);
  process.on("SIGINT", async () => {
    await shutdown();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    await shutdown();
    process.exit(0);
  });
}

// ========== EXPORTS ==========
export { testConnection as ensureConnection }; // Alias for backward compatibility
export default prisma;
