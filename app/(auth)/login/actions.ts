"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type LoginActionResult =
  | { success: true }
  | { success: false; error: string; rateLimit?: boolean };

export async function loginAction(
  formData: FormData
): Promise<LoginActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      const msg = error.cause?.err?.message ?? error.message ?? "";

      if (msg.includes("Too many login attempts")) {
        return { success: false, error: msg, rateLimit: true };
      }

      return { success: false, error: "Invalid email or password." };
    }

    // Re-throw NEXT_REDIRECT (thrown by redirect()) — don't swallow it
    throw error;
  }
}
