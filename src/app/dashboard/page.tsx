"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Layers,
  Brain,
  Upload,
  Flame,
  Clock,
  BookOpen,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Target,
  Zap,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  { label: "Upload PDF", icon: Upload, href: "/dashboard/upload", color: "from-indigo-500 to-blue-500" },
  { label: "My Notes", icon: FileText, href: "/dashboard/notes", color: "from-violet-500 to-purple-500" },
  { label: "Flashcards", icon: Layers, href: "/dashboard/flashcards", color: "from-pink-500 to-rose-500" },
  { label: "Take Quiz", icon: Brain, href: "/dashboard/quiz", color: "from-amber-500 to-orange-500" },
];

const recentActivity: any[] = [];
const subjects: any[] = [];

const stagger = {
  container: { transition: { staggerChildren: 0.06 } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
};

export default function DashboardPage() {
  return (
    <motion.div initial="initial" animate="animate" variants={stagger.container} className="space-y-6">
      {/* Welcome Header */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
            Welcome back, Student! 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
            Here&apos;s your study overview for today
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity shadow-md"
        >
          <Upload className="w-4 h-4" />
          Upload Material
        </Link>
      </motion.div>



      {/* Quick Actions */}
      <motion.div variants={stagger.item}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--foreground-muted)" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="glass rounded-xl p-4 card-lift flex items-center gap-3 group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Progress */}
        <motion.div variants={stagger.item} className="lg:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
              Subject Progress
            </h2>
            <Link href="/dashboard/progress" className="text-xs font-medium text-[var(--forge-indigo)] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: subject.color }} />
                    <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {subject.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                      {subject.notes} notes
                    </span>
                    <span className="text-sm font-semibold" style={{ color: subject.color }}>
                      {subject.progress}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: "var(--surface)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: subject.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Today's Goals */}
        <motion.div variants={stagger.item} className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
              Today&apos;s Goals
            </h2>
            <Target className="w-4 h-4" style={{ color: "var(--forge-indigo)" }} />
          </div>
          <div className="space-y-3">
            {[
              { text: "Review Biology Chapter 5", done: true },
              { text: "Complete 30 flashcards", done: true },
              { text: "Take Chemistry quiz", done: false },
              { text: "Read Physics notes", done: false },
              { text: "Study for 2 hours", done: false },
            ].map((goal, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  goal.done ? "opacity-60" : ""
                }`}
                style={{ background: goal.done ? "transparent" : "var(--surface)" }}
              >
                <CheckCircle2
                  className={`w-[18px] h-[18px] shrink-0 ${
                    goal.done ? "text-emerald-500" : ""
                  }`}
                  style={!goal.done ? { color: "var(--foreground-muted)" } : {}}
                />
                <span
                  className={`text-sm ${goal.done ? "line-through" : "font-medium"}`}
                  style={{ color: goal.done ? "var(--foreground-muted)" : "var(--foreground)" }}
                >
                  {goal.text}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--foreground-muted)" }}>Progress</span>
              <span className="font-semibold text-emerald-500">2/5 completed</span>
            </div>
            <div className="w-full h-2 rounded-full mt-2" style={{ background: "var(--surface)" }}>
              <div className="h-full rounded-full bg-emerald-500 w-[40%]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div variants={stagger.item} className="glass rounded-xl p-5">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
            Recent Activity
          </h2>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--surface)] transition-colors cursor-pointer"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "var(--surface)" }}
                >
                  <item.icon className="w-4 h-4" style={{ color: "var(--forge-indigo)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {item.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                    {item.type}
                  </p>
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--foreground-muted)" }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
