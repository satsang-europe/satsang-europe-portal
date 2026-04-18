import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth configuration.
 *
 * This file must NOT import bcrypt, Prisma, or any other Node.js-only
 * native module. It is used by middleware.ts which runs on the Edge runtime.
 *
 * The full auth logic (bcrypt password comparison, DB lookups) lives in
 * auth.ts and is only used in API routes and Server Components.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },

  providers: [],      // providers are added in auth.ts; middleware only needs callbacks

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId  = user.id as string;
        token.role    = (user as any).role;
        token.familyId = (user as any).familyId;
        token.name    = user.name as string;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.userId   = token.userId as string;
      session.user.role     = token.role as "admin" | "primary_member";
      session.user.familyId = token.familyId as string | null;
      session.user.name     = token.name as string;
      return session;
    },

    // Allow the request to proceed; actual route protection is done in
    // middleware.ts after the token is decoded.
    authorized({ auth }) {
      return true;
    },
  },

  pages: {
    signIn: "/login",
  },
};
