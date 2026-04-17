#!/usr/bin/env ts-node
/**
 * Admin CLI — create a portal admin account.
 *
 * Usage:
 *   npx ts-node scripts/create-admin.ts <email> <name> <password>
 *
 * Example:
 *   npx ts-node scripts/create-admin.ts admin@example.com "Alice Smith" "Secure@123"
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.error(
      "❌ Usage: npx ts-node scripts/create-admin.ts <email> <name> <password>"
    );
    process.exit(1);
  }

  const [email, name, password] = args;

  const prisma = new PrismaClient();

  try {
    // Check for duplicate
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      console.error(`❌ An admin with email "${email}" already exists.`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        hashedPassword,
        isActive: true,
      },
    });

    console.log(`✓ Admin created: ${admin.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("❌ Error:", e.message ?? e);
  process.exit(1);
});
