import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedFeedData() {
  console.log("Seeding feed data...");

  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create athletes
  const athlete1 = await prisma.user.upsert({
    where: { email: "marcus.athlete@example.com" },
    update: {},
    create: {
      email: "marcus.athlete@example.com",
      password: hashedPassword,
      name: "Marcus Trent",
      role: "ATHLETE",
      dateOfBirth: new Date("2002-05-15"),
      interests: ["Soccer", "Basketball"],
      onboardingCompleted: true,
      status: "ACTIVE",
    },
  });

  const athlete2 = await prisma.user.upsert({
    where: { email: "sarah.athlete@example.com" },
    update: {},
    create: {
      email: "sarah.athlete@example.com",
      password: hashedPassword,
      name: "Sarah Williams",
      role: "ATHLETE",
      dateOfBirth: new Date("2003-08-22"),
      interests: ["Tennis", "Soccer"],
      onboardingCompleted: true,
      status: "ACTIVE",
    },
  });

  // Create coaches
  const coach1 = await prisma.user.upsert({
    where: { email: "john.coach@example.com" },
    update: {},
    create: {
      email: "john.coach@example.com",
      password: hashedPassword,
      name: "Coach John Smith",
      role: "COACH",
      dateOfBirth: new Date("1985-03-10"),
      interests: ["Soccer", "Coaching"],
      onboardingCompleted: true,
      status: "ACTIVE",
    },
  });

  // Create academy
  const academy1 = await prisma.user.upsert({
    where: { email: "elite.academy@example.com" },
    update: {},
    create: {
      email: "elite.academy@example.com",
      password: hashedPassword,
      name: "Elite FC Academy",
      role: "ACADEMY",
      interests: ["Soccer", "Basketball", "Tennis"],
      onboardingCompleted: true,
      status: "ACTIVE",
    },
  });

  console.log("Users created");

  // Create connections
  await prisma.connection.upsert({
    where: { senderId_receiverId: { senderId: athlete1.id, receiverId: coach1.id } },
    update: {},
    create: {
      senderId: athlete1.id,
      receiverId: coach1.id,
      status: "ACCEPTED",
    },
  });

  await prisma.connection.upsert({
    where: { senderId_receiverId: { senderId: athlete1.id, receiverId: academy1.id } },
    update: {},
    create: {
      senderId: athlete1.id,
      receiverId: academy1.id,
      status: "ACCEPTED",
    },
  });

  await prisma.connection.upsert({
    where: { senderId_receiverId: { senderId: athlete2.id, receiverId: coach1.id } },
    update: {},
    create: {
      senderId: athlete2.id,
      receiverId: coach1.id,
      status: "ACCEPTED",
    },
  });

  console.log("Connections created");

  // Create posts
  await prisma.post.upsert({
    where: { id: "seed-post-1" },
    update: {},
    create: {
      id: "seed-post-1",
      authorId: athlete1.id,
      content: "Just finished an incredible training session! 💪 Working on my finishing skills. The grind never stops! #AthleteLife #Soccer",
      sportsTags: ["Soccer"],
      visibility: "PUBLIC",
    },
  });

  await prisma.post.upsert({
    where: { id: "seed-post-2" },
    update: {},
    create: {
      id: "seed-post-2",
      authorId: coach1.id,
      content: "Looking forward to tomorrow's trial session in Manchester. Excited to see the new talent! If you're attending, make sure to bring your A-game. 🔥",
      sportsTags: ["Soccer"],
      visibility: "PUBLIC",
    },
  });

  await prisma.post.upsert({
    where: { id: "seed-post-3" },
    update: {},
    create: {
      id: "seed-post-3",
      authorId: academy1.id,
      content: "Registration now open for our U-19 Summer Camp! Limited spots available. Professional coaching, world-class facilities. Visit our profile for more details. ⚽🎯",
      sportsTags: ["Soccer", "Basketball"],
      visibility: "PUBLIC",
    },
  });

  await prisma.post.upsert({
    where: { id: "seed-post-4" },
    update: {},
    create: {
      id: "seed-post-4",
      authorId: athlete2.id,
      content: "Match day vibes! Ready to dominate the court today. Let's get this win! 🎾💯",
      sportsTags: ["Tennis"],
      visibility: "PUBLIC",
    },
  });

  await prisma.post.upsert({
    where: { id: "seed-post-5" },
    update: {},
    create: {
      id: "seed-post-5",
      authorId: athlete1.id,
      content: "Proud to announce I've been selected for the regional team! All the hard work is paying off. Thank you to my coaches and supporters! 🏆",
      sportsTags: ["Soccer", "Basketball"],
      visibility: "PUBLIC",
    },
  });

  console.log("Posts created");
  console.log("Feed data seeded successfully!");
}

seedFeedData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
