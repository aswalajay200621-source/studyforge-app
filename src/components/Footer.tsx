"use client";

import Link from "next/link";
import { Zap, Globe, Code, Briefcase, BookOpen } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Changelog", href: "#" },
  ],
  "Study Tools": [
    { label: "Notes Generator", href: "/dashboard/notes" },
    { label: "Flashcards", href: "/dashboard/flashcards" },
    { label: "Quiz Mode", href: "/dashboard/quiz" },
    { label: "Study Planner", href: "/dashboard" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span
                className="font-bold text-xl gradient-text"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                StudyForge
              </span>
            </Link>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-6">
              Forge knowledge. Master anything. AI-powered learning for every student.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Globe, href: "#", label: "Twitter" },
                { Icon: Code, href: "#", label: "GitHub" },
                { Icon: Briefcase, href: "#", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--forge-indigo)] hover:border-[var(--border-strong)] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-4">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            © {new Date().getFullYear()} StudyForge. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
            <BookOpen className="w-4 h-4 text-violet-500" />
            <span>Built for students, by builders who care.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
