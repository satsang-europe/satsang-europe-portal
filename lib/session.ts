import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Session } from "next-auth";

/**
 * Returns the current session, or null if unauthenticated.
 */
export async function getSession(): Promise<Session | null> {
  return auth();
}

/**
 * Asserts the current user is an admin.
 * Redirects to /login if not authenticated or wrong role.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }
  return session;
}

/**
 * Asserts the current user is a primary member.
 * Redirects to /login if not authenticated or wrong role.
 */
export async function requireMember(): Promise<Session> {
  const session = await getSession();
  if (!session || session.user.role !== "primary_member") {
    redirect("/login");
  }
  return session;
}
