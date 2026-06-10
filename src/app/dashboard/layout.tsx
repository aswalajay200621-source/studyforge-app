"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import ExamCountdown from "@/components/ExamCountdown";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Brain,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  Sun,
  Moon,
  Menu,
  X,
  Upload,
  Clock,
  Bookmark,
  Search,
  Bell,
  ChevronDown,
  FolderOpen,
  Target,
  Users,
} from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/notes", icon: FileText, label: "Notes" },
  { href: "/dashboard/flashcards", icon: Layers, label: "Flashcards" },
  { href: "/dashboard/quiz", icon: Brain, label: "Quizzes" },
  { href: "/dashboard/study-rooms", icon: Users, label: "Study Rooms" },
  { href: "/dashboard/upload", icon: Upload, label: "Upload PDF" },
];

const bottomLinks = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--background-secondary)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b" style={{ borderColor: "var(--border)" }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text" style={{ fontFamily: "var(--font-outfit)" }}>
              StudyForge
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors"
            style={{ color: "var(--foreground-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-[var(--forge-indigo)]"
                    : "hover:bg-[var(--surface)] text-[var(--foreground-secondary)]"
                }`}
              >
                <link.icon
                  className={`w-[18px] h-[18px] ${
                    active ? "text-[var(--forge-indigo)]" : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground-secondary)]"
                  } transition-colors`}
                />
                <span>{link.label}</span>
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-600"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: "var(--border)" }}>
          {bottomLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] transition-colors"
              style={{ color: "var(--foreground-secondary)" }}
            >
              <link.icon className="w-[18px] h-[18px]" style={{ color: "var(--foreground-muted)" }} />
              <span>{link.label}</span>
            </Link>
          ))}
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors text-red-400"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-6 border-b shrink-0"
          style={{
            background: "var(--background-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
              style={{ color: "var(--foreground-secondary)" }}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg glass w-64 lg:w-80">
              <Search className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
              <input
                type="text"
                placeholder="Search notes, flashcards..."
                className="bg-transparent text-sm outline-none w-full"
                style={{ color: "var(--foreground)" }}
                id="dashboard-search"
              />
              <kbd
                className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono"
                style={{
                  background: "var(--surface)",
                  color: "var(--foreground-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Exam Countdown */}
            <ExamCountdown />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
              style={{ color: "var(--foreground-secondary)" }}
              id="dashboard-theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <button
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors relative"
              style={{ color: "var(--foreground-secondary)" }}
              id="notifications-btn"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors"
                id="profile-menu-btn"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  SF
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Student
                  </p>
                  <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                    Pro Plan
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 hidden md:block" style={{ color: "var(--foreground-muted)" }} />
              </button>

              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl glass shadow-lg py-2 z-50"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--surface)] transition-colors"
                    style={{ color: "var(--foreground-secondary)" }}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-500/10 transition-colors text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
