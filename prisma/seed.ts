import { PrismaClient, MemberRole, MemberCategory } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ── Admin ────────────────────────────────────────────────────────────────
  const adminEmail = "admin@test.com";
  const adminHashedPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Test Admin",
      email: adminEmail,
      hashedPassword: adminHashedPassword,
      isActive: true,
    },
  });
  console.log(`✓ Admin: ${admin.email}`);

  // ── SPR Masters ───────────────────────────────────────────────────────────
  const sprData = [
    { name: "Rajendra Sharma", region: "India" },
    { name: "Radha Krishna Sharma", region: "Netherlands" },
    { name: "Ram Kinkar Thakur", region: "United States" },
  ];

  const sprs = await Promise.all(
    sprData.map((spr) =>
      prisma.sprMaster.upsert({
        where: { name: spr.name },
        update: {},
        create: {
          name: spr.name,
          region: spr.region,
          isActive: true,
        },
      })
    )
  );
  console.log(`✓ SPR Masters: ${sprs.map((s) => s.name).join(", ")}`);

  const firstSpr = sprs[0];

  // ── Family ────────────────────────────────────────────────────────────────
  const family = await prisma.family.upsert({
    where: { familyCode: "TESTFAM1" },
    update: {},
    create: {
      familyCode: "TESTFAM1",
      isActive: true,
    },
  });
  console.log(`✓ Family: ${family.familyCode}`);

  // ── Primary Member ────────────────────────────────────────────────────────
  const primaryHashedPassword = await bcrypt.hash("Test@123", 12);

  const primaryMember = await prisma.member.upsert({
    where: { email: "primary@test.com" },
    update: {},
    create: {
      familyId: family.id,
      name: "Test Primary",
      email: "primary@test.com",
      role: MemberRole.primary,
      category: MemberCategory.initiated,
      sprId: firstSpr.id,
      hashedPassword: primaryHashedPassword,
      isActive: true,
    },
  });
  console.log(`✓ Primary Member: ${primaryMember.name}`);

  // ── Secondary Member ──────────────────────────────────────────────────────
  // Secondary has no email — check by name+familyId to avoid duplicate on re-seed
  const existingSecondary = await prisma.member.findFirst({
    where: {
      familyId: family.id,
      role: MemberRole.secondary,
      name: "Test Secondary",
    },
  });

  if (!existingSecondary) {
    const secondaryMember = await prisma.member.create({
      data: {
        familyId: family.id,
        name: "Test Secondary",
        role: MemberRole.secondary,
        category: MemberCategory.non_initiated,
        isActive: true,
      },
    });
    console.log(`✓ Secondary Member: ${secondaryMember.name}`);
  } else {
    console.log(`✓ Secondary Member already exists: ${existingSecondary.name}`);
  }

  // ── Arghya Codes ─────────────────────────────────────────────────────────
  const arghyaCodesData = [
    { code: "ARGHYA-2025-01", isActive: true },
    { code: "ARGHYA-2025-02", isActive: false },
  ];

  const arghyaCodes = await Promise.all(
    arghyaCodesData.map((ac) =>
      prisma.arghyaCode.upsert({
        where: { code: ac.code },
        update: {},
        create: {
          code: ac.code,
          isActive: ac.isActive,
          hasDonations: false,
          createdByAdminId: admin.id,
        },
      })
    )
  );
  console.log(`✓ Arghya Codes: ${arghyaCodes.map((a) => a.code).join(", ")}`);

  console.log("\n✅ Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
