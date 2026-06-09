"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock, X, Flame, PartyPopper, Pencil, Trash2 } from "lucide-react";

interface ExamConfig {
  examName: string;
  examDate: string; // ISO string
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // ms remaining
}

const STORAGE_KEY = "studyforge_exam_countdown";

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total: diff,
  };
}

export default function ExamCountdown() {
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");

  const popoverRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ExamConfig = JSON.parse(stored);
        if (parsed.examDate && parsed.examName) {
          setConfig(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Tick the countdown every second
  useEffect(() => {
    if (!config) return;
    const tick = () => setTimeLeft(getTimeLeft(config.examDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [config]);

  // Close popover when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    }
    if (popoverOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popoverOpen]);

  const handleSave = useCallback(() => {
    if (!formName.trim() || !formDate) return;
    const newConfig: ExamConfig = { examName: formName.trim(), examDate: new Date(formDate).toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    setConfig(newConfig);
    setPopoverOpen(false);
  }, [formName, formDate]);

  const handleReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConfig(null);
    setTimeLeft(null);
    setFormName("");
    setFormDate("");
    setPopoverOpen(false);
  }, []);

  const openEdit = useCallback(() => {
    if (config) {
      setFormName(config.examName);
      // Convert ISO back to datetime-local format
      const d = new Date(config.examDate);
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setFormDate(local);
    } else {
      setFormName("");
      setFormDate("");
    }
    setPopoverOpen(true);
  }, [config]);

  // Don't render anything until mounted (avoids SSR hydration mismatch)
  if (!mounted) return null;

  const isUrgent = timeLeft && timeLeft.total > 0 && timeLeft.days < 1;
  const isFinished = timeLeft && timeLeft.total <= 0 && config;

  // Min date for the input: right now
  const now = new Date();
  const minDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  return (
    <div className="relative" ref={popoverRef} id="exam-countdown-widget">
      {/* ---------- Trigger button / badge ---------- */}
      {!config ? (
        <button
          onClick={openEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, var(--forge-indigo), var(--forge-violet))",
            color: "#fff",
            boxShadow: "0 2px 10px rgba(124, 58, 237, 0.35)",
          }}
          id="set-exam-countdown-btn"
        >
          <CalendarClock className="w-3.5 h-3.5" />
          Set Exam
        </button>
      ) : isFinished ? (
        <button
          onClick={openEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse-glow transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "#fff",
          }}
          id="exam-finished-btn"
        >
          <PartyPopper className="w-3.5 h-3.5" />
          Exam Time!
        </button>
      ) : (
        <button
          onClick={openEdit}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 ${
            isUrgent ? "animate-pulse-glow" : ""
          }`}
          style={{
            background: isUrgent
              ? "linear-gradient(135deg, #F59E0B, #EF4444)"
              : "linear-gradient(135deg, var(--forge-indigo), var(--forge-violet))",
            color: "#fff",
            boxShadow: isUrgent
              ? "0 2px 14px rgba(239, 68, 68, 0.45)"
              : "0 2px 10px rgba(124, 58, 237, 0.35)",
          }}
          id="exam-countdown-btn"
        >
          {isUrgent ? <Flame className="w-3.5 h-3.5" /> : <CalendarClock className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline max-w-[90px] truncate">{config.examName}</span>
          <span className="font-mono tabular-nums tracking-tight">
            {timeLeft!.days > 0 && `${timeLeft!.days}d `}
            {String(timeLeft!.hours).padStart(2, "0")}:
            {String(timeLeft!.minutes).padStart(2, "0")}:
            {String(timeLeft!.seconds).padStart(2, "0")}
          </span>
        </button>
      )}

      {/* ---------- Popover ---------- */}
      <AnimatePresence>
        {popoverOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-3 w-80 rounded-2xl shadow-lg z-[100] overflow-hidden"
            style={{ background: "var(--background-secondary)", border: "1px solid var(--border-strong)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
            id="exam-countdown-popover"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                background: "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.12))",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                <CalendarClock className="w-4 h-4" style={{ color: "var(--forge-indigo)" }} />
                Exam Countdown
              </h3>
              <button
                onClick={() => setPopoverOpen(false)}
                className="p-1 rounded-md hover:bg-[var(--surface-hover)] transition-colors"
                style={{ color: "var(--foreground-muted)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4">
              {/* Exam Name */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground-secondary)" }}>
                  Exam Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Chemistry Midterm"
                  maxLength={40}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--forge-indigo)]"
                  style={{
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                  }}
                  id="exam-name-input"
                />
              </div>

              {/* Exam Date */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground-secondary)" }}>
                  Exam Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  min={minDate}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--forge-indigo)]"
                  style={{
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    colorScheme: "dark",
                  }}
                  id="exam-date-input"
                />
              </div>

              {/* Live preview */}
              {formDate && new Date(formDate).getTime() > Date.now() && (
                <div
                  className="rounded-xl px-4 py-3 text-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.08))",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: "var(--foreground-muted)" }}>
                    Countdown Preview
                  </p>
                  <CountdownPreview targetDate={formDate} />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={!formName.trim() || !formDate}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: "linear-gradient(135deg, var(--forge-indigo), var(--forge-violet))",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
                  }}
                  id="save-countdown-btn"
                >
                  <CalendarClock className="w-4 h-4" />
                  {config ? "Update Countdown" : "Start Countdown"}
                </button>

                {config && (
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl hover:bg-red-500/10 transition-colors"
                    style={{ color: "#EF4444" }}
                    title="Remove countdown"
                    id="reset-countdown-btn"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Small sub-component for the live preview inside the popover */
function CountdownPreview({ targetDate }: { targetDate: string }) {
  const [tl, setTl] = useState<TimeLeft>(getTimeLeft(new Date(targetDate).toISOString()));

  useEffect(() => {
    const tick = () => setTl(getTimeLeft(new Date(targetDate).toISOString()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Days", value: tl.days },
    { label: "Hrs", value: tl.hours },
    { label: "Min", value: tl.minutes },
    { label: "Sec", value: tl.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span
            className="text-xl font-black font-mono tabular-nums"
            style={{ color: "var(--forge-indigo)" }}
          >
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: "var(--foreground-muted)" }}>
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
