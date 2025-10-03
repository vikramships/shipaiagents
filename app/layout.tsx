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
  const enableAdSense = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true";
  const enableFeedback = process.env.NEXT_PUBLIC_ENABLE_FEEDBACK === "true";
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const feedbackProjectId = process.env.NEXT_PUBLIC_FEEDBACK_PROJECT_ID;

  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}

        {/* Analytics - Only if enabled */}
        <Analytics />

        {/* Feedback Widget - Only if enabled and ID provided */}
        {enableFeedback && feedbackProjectId && (
          <script
            defer
            data-project-id={feedbackProjectId}
            src="https://feedbackstar.vercel.app/widget/widget.js">
          </script>
        )}

        {/* AdSense - Only if enabled and ID provided */}
        {enableAdSense && adSenseClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
            crossOrigin="anonymous">
          </script>
        )}
      </body>
    </html>
  );
}
