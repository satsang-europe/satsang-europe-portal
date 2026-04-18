import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Satsang Europe Arghya Portal",
  description: "Member portal for Satsang Europe donations and arghya management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
