"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Layers,
  Brain,
  Upload,
  Clock,
  BookOpen,
  CheckCircle2,
  Target,
  ArrowUpRight,
  Calendar,
  File,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { populateDefaultData } from "@/lib/generator";

const quickActions = [
  { label: "Upload PDF", icon: Upload, href: "/dashboard/upload", color: "from-indigo-500 to-blue-500" },
  { label: "My Notes", icon: FileText, href: "/dashboard/notes", color: "from-violet-500 to-purple-500" },
  { label: "Flashcards", icon: Layers, href: "/dashboard/flashcards", color: "from-pink-500 to-rose-500" },
  { label: "Take Quiz", icon: Brain, href: "/dashboard/quiz", color: "from-amber-500 to-orange-500" },
];

const stagger = {
  container: { transition: { staggerChildren: 0.06 } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
};

export default function DashboardPage() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [goals, setGoals] = useState([
    { text: "Review Biology Chapter 5", done: true },
    { text: "Complete 30 flashcards", done: true },
    { text: "Take Chemistry quiz", done: false },
    { text: "Read Physics notes", done: false },
    { text: "Study for 2 hours", done: false },
  ]);

  useEffect(() => {
    // Populate initial default data if empty
    populateDefaultData();

    // Read from localStorage
    const storedUploads = localStorage.getItem("studyforge_uploads");
    const storedNotes = localStorage.getItem("studyforge_notes");
    
    if (storedUploads && storedNotes) {
      const parsedUploads = JSON.parse(storedUploads);
      const parsedNotes = JSON.parse(storedNotes);

      setUploads(parsedUploads.slice(0, 5));

      // Compute subject counts and progress
      const subjectMap: Record<string, { name: string; notes: number; progress: number; color: string }> = {};
      parsedNotes.forEach((note: any) => {
        if (!subjectMap[note.subject]) {
          subjectMap[note.subject] = {
            name: note.subject,
            notes: 0,
            progress: 35, // default starting progress
            color: note.color || "var(--forge-indigo)",
          };
        }
        subjectMap[note.subject].notes += 1;
        // Progress increases with notes up to 100%
        subjectMap[note.subject].progress = Math.min(35 + (subjectMap[note.subject].notes - 1) * 15, 100);
      });
      setSubjects(Object.values(subjectMap));

      // Generate dynamic recent activities
      const activities: any[] = [];
      parsedUploads.forEach((up: any, idx: number) => {
        if (idx < 3) {
          activities.push({
            title: `Uploaded ${up.name}`,
            type: "Document Uploaded",
            time: up.date,
            icon: Upload,
          });
        }
      });
      parsedNotes.forEach((note: any, idx: number) => {
        if (idx < 2) {
          activities.push({
            title: `Generated study guide: ${note.title}`,
            type: "AI Notes Created",
            time: note.date,
            icon: FileText,
          });
        }
      });
      setRecentActivity(activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()));
    }
  }, []);

  const toggleGoal = (index: number) => {
    const updatedGoals = [...goals];
    updatedGoals[index].done = !updatedGoals[index].done;
    setGoals(updatedGoals);
  };

  const completedGoals = goals.filter((g) => g.done).length;

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
          {subjects.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: "var(--foreground-muted)" }}>
              No subject progress recorded yet. Upload files to get started!
            </p>
          ) : (
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
          )}
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
            {goals.map((goal, i) => (
              <div
                key={i}
                onClick={() => toggleGoal(i)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
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
              <span className="font-semibold text-emerald-500">{completedGoals}/{goals.length} completed</span>
            </div>
            <div className="w-full h-2 rounded-full mt-2" style={{ background: "var(--surface)" }}>
              <div 
                className="h-full rounded-full bg-emerald-500 transition-all duration-300" 
                style={{ width: `${(completedGoals / goals.length) * 100}%` }}
              />
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
          {recentActivity.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: "var(--foreground-muted)" }}>
              No recent activity. Upload a file to get started.
            </p>
          ) : (
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
          )}
        </motion.div>

        {/* Recent Uploads (Quick View) */}
        <motion.div variants={stagger.item} className="glass rounded-xl p-5">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
            Recent Uploaded Documents
          </h2>
          {uploads.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: "var(--foreground-muted)" }}>
              No uploaded documents.
            </p>
          ) : (
            <div className="space-y-1">
              {uploads.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--surface)] transition-colors cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-red-500/10 text-red-500"
                  >
                    <File className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                      {file.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                      {file.size}
                    </p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: "var(--foreground-muted)" }}>
                    {file.date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
