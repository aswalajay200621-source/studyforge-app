import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyForge — Forge Knowledge. Master Anything.",
  description:
    "StudyForge is an AI-powered learning platform that helps students generate notes, flashcards, quizzes, and summaries from their study materials. Unlock your learning potential.",
  keywords: ["AI learning", "study platform", "flashcards", "quiz generator", "PDF notes", "student tools"],
  openGraph: {
    title: "StudyForge — Forge Knowledge. Master Anything.",
    description: "AI-powered learning platform for students",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
