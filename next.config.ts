import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Output ────────────────────────────────────────────────────────────────
  // Use "standalone" for Docker / AWS deployments; remove if not needed.
  // output: "standalone",

  // ── TypeScript ────────────────────────────────────────────────────────────
  typescript: {
    // Fail the build on type errors (default: true — listed for visibility).
    ignoreBuildErrors: false,
  },

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
    ],
  },

  // ── Experimental ─────────────────────────────────────────────────────────
  // ── Experimental ─────────────────────────────────────────────────────────
  // (no experimental options needed currently)
  // ── Server External Packages ────────────────────────────────────────────────
  serverExternalPackages: ["@react-pdf/renderer", "bcrypt", "@prisma/client"],
};

export default nextConfig;
