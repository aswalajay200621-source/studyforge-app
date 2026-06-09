"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Layers,
  Brain,
  BookOpen,
  BarChart3,
  Flame,
  Bookmark,
  Search,
  FolderOpen,
  Moon,
  Download,
  Clock,
  Award,
} from "lucide-react";

const primaryFeatures = [
  {
    title: "AI Notes Generator",
    description: "Upload any PDF, textbook, or document and instantly get structured, comprehensive study notes broken down by concept.",
    icon: FileText,
  },
  {
    title: "Flashcard Engine",
    description: "Automatically generate high-yield study flashcards from your materials to optimize active recall and memory retention.",
    icon: Layers,
  },
  {
    title: "Quiz Generator",
    description: "Create practice tests and MCQs instantly from your notes to test your knowledge before the real exam.",
    icon: Brain,
  },
  {
    title: "PDF Analysis",
    description: "Deep understanding of your materials. Ask questions and get instant, context-aware answers from your documents.",
    icon: BookOpen,
  },
];

const secondaryFeatures = [
  { title: "Progress Tracking", desc: "Visualize your learning journey.", icon: BarChart3 },
  { title: "Study Streaks", desc: "Build consistency every day.", icon: Flame },
  { title: "Bookmarks", desc: "Save key concepts for later.", icon: Bookmark },
  { title: "Search Notes", desc: "Find anything instantly.", icon: Search },
  { title: "Organization", desc: "Keep subjects separated.", icon: FolderOpen },
  { title: "Dark Mode", desc: "Easy on the eyes at night.", icon: Moon },
  { title: "Export to PDF", desc: "Take your notes offline.", icon: Download },
  { title: "Pomodoro Timer", desc: "Stay focused while studying.", icon: Clock },
  { title: "Achievements", desc: "Earn badges as you learn.", icon: Award },
];

const stagger = {
  container: { transition: { staggerChildren: 0.1 } },
  item: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    viewport: { once: true },
  },
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-16">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-[100px] rounded-full animate-blob -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <span className="block" style={{ color: "var(--foreground)" }}>Powerful Features for</span>
            <span className="block gradient-text mt-2">Smarter Learning</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--foreground-secondary)" }}
          >
            Discover the comprehensive suite of AI tools designed to transform how you study, understand, and retain complex information.
          </motion.p>
        </div>
      </section>

      {/* Primary Features */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger.container}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {primaryFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={stagger.item}
                className="glass rounded-2xl p-8 card-lift border border-[var(--border)] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <feature.icon className="w-32 h-32" style={{ color: "var(--forge-indigo)" }} />
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Secondary Features Grid */}
      <section className="py-20 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
              More Tools to Help You Succeed
            </h2>
            <p className="text-lg" style={{ color: "var(--foreground-muted)" }}>
              Everything you need in one unified platform.
            </p>
          </div>
          
          <motion.div
            variants={stagger.container}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {secondaryFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={stagger.item}
                className="glass rounded-xl p-6 card-lift flex items-start gap-4"
              >
                <div className="p-3 rounded-lg bg-[var(--surface-hover)] shrink-0 border border-[var(--border)]">
                  <feature.icon className="w-6 h-6" style={{ color: "var(--forge-violet)" }} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>{feature.title}</h4>
                  <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
            Start Using These Features Today
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 shadow-lg hover:shadow-violet-500/40 transition-all duration-300 card-lift"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
