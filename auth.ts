import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";

const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 5;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.toLowerCase().trim();
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

        // ── STEP 1: Rate limit check ──────────────────────────────────────────
        const recentFailures = await db.loginAttempt.count({
          where: {
            identifier: email,
            success: false,
            attemptedAt: { gte: windowStart },
          },
        });

        if (recentFailures >= MAX_ATTEMPTS) {
          // Log the blocked attempt
          await db.loginAttempt.create({
            data: { identifier: email, success: false },
          });
          throw new Error(
            "Too many login attempts. Please try again in 15 minutes."
          );
        }

        // ── STEP 2: Admin lookup ──────────────────────────────────────────────
        const admin = await db.admin.findUnique({ where: { email } });
        if (
          admin &&
          admin.isActive &&
          (await bcrypt.compare(password, admin.hashedPassword))
        ) {
          await db.loginAttempt.create({
            data: { identifier: email, success: true },
          });
          return {
            id: admin.id,
            role: "admin" as const,
            familyId: null,
            name: admin.name,
          };
        }

        // ── STEP 3: Primary member lookup ─────────────────────────────────────
        const member = await db.member.findFirst({
          where: { email, role: "primary" },
        });
        if (
          member &&
          member.isActive &&
          member.hashedPassword &&
          (await bcrypt.compare(password, member.hashedPassword))
        ) {
          await db.loginAttempt.create({
            data: { identifier: email, success: true },
          });
          return {
            id: member.id,
            role: "primary_member" as const,
            familyId: member.familyId,
            name: member.name,
          };
        }

        // ── STEP 4: Failed ────────────────────────────────────────────────────
        await db.loginAttempt.create({
          data: { identifier: email, success: false },
        });
        return null;
      },
    }),
  ],

});
