import { PrismaClient } from "@prisma/client";

// ========== ENVIRONMENT DIAGNOSTICS ==========
const isDevelopment = process.env.NODE_ENV !== "production";
const isProduction = process.env.NODE_ENV === "production";

console.log(`🔌 Prisma initializing in ${process.env.NODE_ENV || 'development'} mode`);

// ========== VALIDATE DATABASE_URL ==========
if (!process.env.DATABASE_URL) {
  const errorMsg = 
    "❌ DATABASE_URL environment variable is not set.\n" +
    "For local development: Check .env.local\n" +
    "For production (Vercel): Set in environment variables dashboard";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// Log DATABASE_URL presence (not value) for debugging
const dbUrl = process.env.DATABASE_URL;
const dbHost = dbUrl.split("@")[1]?.split("/")[0] || "unknown";
console.log(`📊 Database host: ${dbHost}`);
console.log(`🔗 DATABASE_URL present: ✅`);
console.log(`🔗 DIRECT_URL present: ${process.env.DIRECT_URL ? '✅' : '⚠️  (optional)'}`);

// ========== PRODUCTION VALIDATIONS ==========
if (isProduction) {
  // Prevent localhost in production
  if (dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")) {
    const errorMsg = 
      "❌ CRITICAL: Production is using localhost database!\n" +
      `Current host: ${dbHost}\n` +
      "Action required: Set DATABASE_URL in Vercel to your cloud database";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Warn about connection pooling
  if (!dbUrl.includes("pgbouncer") && !dbUrl.includes("pooler")) {
    console.warn(
      "⚠️  WARNING: Production DATABASE_URL may not be using connection pooling.\n" +
      "   For Vercel/serverless, use pooled connection string:\n" +
      "   - Supabase: Use 'Connection pooling' URL (port 6543)\n" +
      "   - Neon: Use 'Pooled connection'\n" +
      "   - Recommended parameters: ?pgbouncer=true&connection_limit=1"
    );
  }

  console.log("✅ Production database configuration validated");
}

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

// Development-only: Test connection on startup
if (isDevelopment) {
  testConnection().then(result => {
    if (!result.success) {
      console.error("\n" + "=".repeat(60));
      console.error("⚠️  DATABASE CONNECTION FAILED");
      console.error("=".repeat(60));
      console.error("To start your local database:");
      console.error("  npm run dev:start  (recommended - includes database)");
      console.error("  OR");
      console.error("  npm run db:start   (starts PostgreSQL only)");
      console.error("=".repeat(60) + "\n");
    }
  });
}

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
