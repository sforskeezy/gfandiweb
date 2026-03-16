/* eslint-disable @typescript-eslint/no-require-imports */
const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";

async function seed() {
  const client = new ConvexHttpClient(CONVEX_URL);

  console.log("Seeding database...\n");

  // Create admin account
  const adminResult = await client.mutation(api.auth.createInitialUser, {
    name: "Admin",
    username: "admin",
    password: "admin123",
    isAdmin: true,
  });
  if (adminResult.success) {
    console.log("Created admin user: admin / admin123");
  } else {
    console.log("Admin user:", adminResult.error);
  }

  // Create amaya client account
  const amayaResult = await client.mutation(api.auth.createInitialUser, {
    name: "Amaya",
    username: "amaya",
    password: "amaya123",
    isAdmin: false,
  });
  if (amayaResult.success) {
    console.log("Created client user: amaya / amaya123");
  } else {
    console.log("Amaya user:", amayaResult.error);
  }

  console.log("\nDone! You can now log in.");
  console.log("  Admin: http://localhost:3001/login  (admin / admin123)");
  console.log("  Client: http://localhost:3001/login  (amaya / amaya123)");
}

seed().catch(console.error);
