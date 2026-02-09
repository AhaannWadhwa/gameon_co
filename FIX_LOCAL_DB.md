# 🚨 IMPORTANT: Understanding Local vs Production Database

## The Error You're Seeing

The error `Can't reach database server at localhost:5432` is from **LOCAL DEVELOPMENT**, not production.

---

## ✅ Production is Already Protected

Your production deployment on Vercel will **NEVER** use localhost because I've added this validation in `src/lib/prisma.ts`:

```typescript
// Prevent localhost connections in production
if (process.env.NODE_ENV === "production") {
  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")) {
    throw new Error(
      "❌ CRITICAL: Production environment is configured with a localhost database URL...",
    );
  }
}
```

**This means:**

- ✅ Production deployment will **crash immediately** if DATABASE_URL contains "localhost"
- ✅ You'll see a clear error in Vercel logs if misconfigured
- ✅ Production can ONLY connect to a cloud database

---

## Your Local Development Needs a Database

When you run `npm run dev` **locally**, the app needs a PostgreSQL database at `localhost:5432`.

You have two options:

### Option 1: Use the Automated Startup Script (Easiest)

```bash
# Instead of: npm run dev
# Use:
./dev.sh
```

This script will:

1. Check if Docker is running
2. Start PostgreSQL automatically
3. Generate Prisma client
4. Start your dev server

**First time setup:**

```bash
chmod +x dev.sh
./dev.sh
```

---

### Option 2: Manual Docker Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Verify it's running
docker ps

# Then start dev server
npm run dev
```

---

### Option 3: Use Cloud Database for Local Dev

Update `.env.local` to use a cloud database:

```env
# Instead of localhost:
DATABASE_URL="postgresql://postgres:password@localhost:5432/gameon"

# Use cloud database:
DATABASE_URL="postgresql://user:pass@cloud-host/db?sslmode=require"
```

---

## Summary

| Environment                   | Database Location       | Current Status              |
| ----------------------------- | ----------------------- | --------------------------- |
| **Local Dev** (`npm run dev`) | localhost:5432 OR cloud | ❌ PostgreSQL not running   |
| **Production** (Vercel)       | Cloud database ONLY     | ✅ Protected from localhost |

---

## Quick Fix for Local Development

**Choose ONE:**

```bash
# Option A: Use the startup script (recommended)
./dev.sh

# Option B: Start Docker manually
docker-compose up -d
npm run dev

# Option C: Use cloud database
# Edit .env.local with cloud DATABASE_URL
npm run dev
```

---

## Vercel Production Deployment

Your production deployment will work correctly when you:

1. Set `DATABASE_URL` in Vercel environment variables to your cloud database
2. **DO NOT** set it to localhost (it will fail immediately with a clear error)
3. Set other required environment variables (NEXTAUTH_SECRET, etc.)

The validation code I added ensures production CANNOT accidentally use localhost.
