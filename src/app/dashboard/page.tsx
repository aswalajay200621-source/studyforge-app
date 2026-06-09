"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Layers,
  Brain,
  Upload,
  CheckCircle2,
  Target,
  File,
  Plus,
  Trash2,
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

const GOALS_STORAGE_KEY = "studyforge_daily_goals";

function loadGoals(): { text: string; done: boolean }[] {
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveGoals(goals: { text: string; done: boolean }[]) {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
}

export default function DashboardPage() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [goals, setGoals] = useState<{ text: string; done: boolean }[]>([]);
  const [newGoalText, setNewGoalText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Populate initial default data if empty
    populateDefaultData();
    // Load goals from localStorage
    setGoals(loadGoals());

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
    saveGoals(updatedGoals);
  };

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    const updatedGoals = [...goals, { text: newGoalText.trim(), done: false }];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setNewGoalText("");
  };

  const deleteGoal = (index: number) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const completedGoals = goals.filter((g) => g.done).length;

  return (
    <motion.div initial="initial" animate="animate" variants={stagger.container} className="space-y-6">
      {/* Welcome Header */}
      <motion.div variants={stagger.item}>
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
          Welcome back, Student! 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
          Here&apos;s your study overview for today
        </p>
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

      {/* Today's Goals */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div variants={stagger.item} className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
              Today&apos;s Goals
            </h2>
            <Target className="w-4 h-4" style={{ color: "var(--forge-indigo)" }} />
          </div>

          {/* Add new goal input */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGoal()}
              placeholder="Add a new goal..."
              maxLength={80}
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--forge-indigo)]"
              style={{
                background: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
              id="new-goal-input"
            />
            <button
              onClick={addGoal}
              disabled={!newGoalText.trim()}
              className="p-2 rounded-lg text-white transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, var(--forge-indigo), var(--forge-violet))",
              }}
              id="add-goal-btn"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Goals list */}
          {mounted && goals.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "var(--foreground-muted)" }}>
              No goals yet. Add your first goal above! 🎯
            </p>
          ) : (
            <div className="space-y-2">
              {goals.map((goal, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    goal.done ? "opacity-60" : ""
                  }`}
                  style={{ background: goal.done ? "transparent" : "var(--surface)" }}
                >
                  <button onClick={() => toggleGoal(i)} className="shrink-0">
                    <CheckCircle2
                      className={`w-[18px] h-[18px] ${
                        goal.done ? "text-emerald-500" : ""
                      } transition-colors`}
                      style={!goal.done ? { color: "var(--foreground-muted)" } : {}}
                    />
                  </button>
                  <span
                    className={`flex-1 text-sm cursor-pointer ${goal.done ? "line-through" : "font-medium"}`}
                    style={{ color: goal.done ? "var(--foreground-muted)" : "var(--foreground)" }}
                    onClick={() => toggleGoal(i)}
                  >
                    {goal.text}
                  </span>
                  <button
                    onClick={() => deleteGoal(i)}
                    className="shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
                    style={{ color: "#EF4444" }}
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Progress bar */}
          {goals.length > 0 && (
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
          )}
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
