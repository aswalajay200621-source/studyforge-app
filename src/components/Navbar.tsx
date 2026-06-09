"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sun, Moon, Zap } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass border-b border-[var(--border)] mx-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-violet-500/40 transition-shadow duration-300">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span
                className="font-bold text-xl gradient-text"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                StudyForge
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                id="theme-toggle"
                className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-200"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                id="nav-get-started"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity shadow-md hover:shadow-violet-500/30 transition-all duration-300"
              >
                Get Started
              </Link>

              {/* Mobile menu btn */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--surface-hover)] transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[var(--border)] px-4 py-4"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] py-2 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/login" className="text-sm font-medium text-center py-2 text-[var(--foreground-secondary)]">
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold text-center py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-violet-600"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
