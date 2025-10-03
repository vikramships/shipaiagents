import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";


export const metadata: Metadata = {
  title: "Ship AI Agents",
  description: "Optimize Claude Code for large codebases. Generate indexing workflows, context management rules, and AI-friendly architecture patterns. Stop fighting with token limits and context windows.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <script
          defer
          data-project-id="d5c4f364-f3b7-4d45-b73d-55b10162227b"
          src="https://feedbackstar.vercel.app/widget/widget.js">
        </script>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4393128549264519"
          crossOrigin="anonymous">
        </script>
      </body>
    </html>
  );
}
