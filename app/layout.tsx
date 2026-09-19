import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iMessage HTML — Native-looking conversations, made with HTML",
  description: "Composable iMessage-style HTML components. Customize messages, optional conversation UI, and compare against original screenshots.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
