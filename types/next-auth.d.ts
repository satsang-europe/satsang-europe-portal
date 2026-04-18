import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      role: "admin" | "primary_member";
      familyId: string | null;
      name: string;
      // keep built-in email optional
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id?: string;
    role: "admin" | "primary_member";
    familyId: string | null;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: "admin" | "primary_member";
    familyId: string | null;
    name: string;
  }
}
