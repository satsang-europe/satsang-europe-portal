"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isRateLimit, setIsRateLimit] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsRateLimit(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);

      if (result.success) {
        // Middleware handles the role-based redirect, but we need a hard
        // navigation so Next.js middleware re-evaluates the session cookie.
        router.push("/");
        router.refresh();
      } else {
        setError(result.error);
        setIsRateLimit(result.rateLimit ?? false);
      }
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo / heading */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-yellow-200 shadow-lg mb-4">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Satsang Europe
          </h1>
          <p className="text-indigo-300 text-sm mt-1">Arghya Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className="w-full rounded-lg bg-white/10 border border-white/15 text-white placeholder-slate-500
                           px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                           focus:border-transparent transition disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isPending}
                className="w-full rounded-lg bg-white/10 border border-white/15 text-white placeholder-slate-500
                           px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                           focus:border-transparent transition disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {/* Error messages */}
            {error && (
              <div
                role="alert"
                className={`rounded-lg px-4 py-3 text-sm ${
                  isRateLimit
                    ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                    : "bg-red-500/15 border border-red-500/30 text-red-300"
                }`}
              >
                {isRateLimit ? (
                  <>
                    <span className="font-semibold">Account temporarily locked.</span>{" "}
                    Too many failed attempts — please try again in 15 minutes.
                  </>
                ) : (
                  error
                )}
              </div>
            )}

            {/* Submit */}
            <button
              id="sign-in-button"
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
                         text-white font-semibold py-2.5 text-sm transition
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                         focus:ring-offset-transparent disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © {new Date().getFullYear()} Satsang Europe. All rights reserved.
        </p>
      </div>
    </main>
  );
}
