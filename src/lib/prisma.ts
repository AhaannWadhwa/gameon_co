import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Enhanced Prisma Client with logging and error handling
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Connection health check with retry logic
let connectionAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function ensureConnection(retryCount = 0): Promise<boolean> {
  try {
    await prisma.$connect();
    if (retryCount > 0) {
      console.log("✅ Database connection restored");
    }
    connectionAttempts = 0;
    return true;
  } catch (error) {
    connectionAttempts++;
    console.error(
      `❌ Database connection failed (attempt ${connectionAttempts}/${MAX_RETRIES}):`,
      error
    );

    if (retryCount < MAX_RETRIES) {
      console.log(`🔄 Retrying connection in ${RETRY_DELAY / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return ensureConnection(retryCount + 1);
    }

    console.error(
      "💥 Max connection retries reached. Database is unavailable."
    );
    return false;
  }
}

// Initial connection check (non-blocking)
if (process.env.NODE_ENV === "development") {
  ensureConnection().then((connected) => {
    if (connected) {
      console.log("✅ Database connected successfully");
      console.log(`📊 Connection: ${process.env.DATABASE_URL?.split("@")[1]}`);
    }
  });
}

// Graceful shutdown
async function disconnectPrisma() {
  await prisma.$disconnect();
  console.log("Database connection closed");
}

if (typeof process !== "undefined") {
  process.on("beforeExit", disconnectPrisma);
  process.on("SIGINT", async () => {
    await disconnectPrisma();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    await disconnectPrisma();
    process.exit(0);
  });
}

// Export helper for connection testing
export { ensureConnection };
