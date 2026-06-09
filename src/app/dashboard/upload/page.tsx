"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, FileText, CheckCircle2, AlertCircle, File, FileCode, Layers, Brain, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { generateStudyMaterials, detectSubject } from "@/lib/generator";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMode, setUploadMode] = useState<"pdf" | "textbook">("pdf");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [storagePercentage, setStoragePercentage] = useState(0);
  const [storageMb, setStorageMb] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load recent uploads
  useEffect(() => {
    const loadUploads = () => {
      const uploadsRaw = localStorage.getItem("studyforge_uploads");
      if (uploadsRaw) {
        const parsed = JSON.parse(uploadsRaw);
        setRecentUploads(parsed);
        // Calculate storage usage (just a mock representation based on actual list length or mock sizes)
        const totalMb = parsed.reduce((acc: number, item: any) => {
          const val = parseFloat(item.size);
          return acc + (isNaN(val) ? 1.5 : val);
        }, 0);
        setStorageMb(Math.round(totalMb * 10) / 10);
        setStoragePercentage(Math.min(Math.round((totalMb / 1000) * 100), 100));
      }
    };
    loadUploads();
  }, [uploadState]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleFile = (file: globalThis.File) => {
    if (file && file.type === "application/pdf") {
      const sizeFormatted = formatBytes(file.size);
      const maxBytes = uploadMode === "textbook" ? 500 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxBytes) {
        alert(`File too large. Max size is ${uploadMode === "textbook" ? "500MB" : "50MB"}.`);
        return;
      }
      setSelectedFile({ name: file.name, size: sizeFormatted });
      startUploadFlow(file.name, sizeFormatted);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (uploadState !== "idle") return;
    fileInputRef.current?.click();
  };

  const generateTextbookNotes = (name: string): string => {
    const clean = name.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
    const { subject } = detectSubject(name);
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    return `📚 TEXTBOOK NOTES — ${clean.toUpperCase()}
Subject: ${subject} | Generated: ${today}
${"-".repeat(60)}

CHAPTER 1 — INTRODUCTION & CORE CONCEPTS
─────────────────────────────────────────
▶ KEY TERMS
  • Understand the foundational vocabulary of ${subject}.
  • Look for definitions in bold within each chapter.
  • Make connections between terms across chapters.

▶ MAIN IDEAS
  • The textbook establishes core principles of ${subject} from first principles.
  • Pay attention to chapter summaries at the end of each section.
  • Note diagrams and their labels — they appear in exams.

▶ IMPORTANT POINTS
  1. Every chapter builds upon the previous — do not skip ahead.
  2. Worked examples are crucial — solve them yourself before reading the solution.
  3. End-of-chapter problems are exam-level — attempt all.

CHAPTER 2 — FUNDAMENTAL PRINCIPLES
─────────────────────────────────────────
▶ THEORIES & MODELS
  • Look for the primary theoretical framework introduced early.
  • Compare and contrast competing models where applicable.
  • Note real-world applications of each model.

▶ FORMULAS & RULES (mark these in your notes)
  • Write each formula in a dedicated formula sheet.
  • Identify the variables: what each symbol means.
  • Practice deriving formulas from scratch.

CHAPTER 3 — APPLICATIONS & CASE STUDIES
─────────────────────────────────────────
▶ HOW CONCEPTS APPLY
  • Real-world examples bridge theory to practice.
  • Case studies show complex interactions — map them visually.
  • Identify patterns across different case studies.

▶ COMMON MISTAKES TO AVOID
  • Misreading the question — highlight key verbs (calculate, explain, compare).
  • Skipping units or signs in numerical answers.
  • Memorizing without understanding the underlying logic.

${"-".repeat(60)}
📌 STUDY TIPS FOR THIS TEXTBOOK
  • Read the chapter introduction and conclusion FIRST.
  • Then read in full, marking key sentences.
  • Summarize each section in 2–3 lines in your own words.
  • Test yourself using chapter-end questions.
  • Revisit this summary 24h, 1 week, and 1 month later.
${"-".repeat(60)}
`;
  };

  const startUploadFlow = (name: string, sizeStr: string) => {
    setUploadState("uploading");
    setProgress(0);

    // For textbooks, simulate a longer processing time
    const increment = uploadMode === "textbook" ? 4 : 10;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("processing");

          setTimeout(() => {
            const existingUploads = JSON.parse(localStorage.getItem("studyforge_uploads") || "[]");
            const existingNotes = JSON.parse(localStorage.getItem("studyforge_notes") || "[]");

            if (uploadMode === "textbook") {
              // Textbook mode: generate plain-text notes only
              const { subject, color } = detectSubject(name);
              const id = `note_${Date.now()}`;
              const fileId = `file_${Date.now()}`;
              const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const textbookNote = {
                id,
                fileId,
                subject,
                color,
                title: name.replace(/\.pdf$/i, "").replace(/[_-]/g, " "),
                preview: `Textbook notes — ${subject} — structured chapter summaries and key points`,
                words: 850,
                date: today,
                htmlContent: "", // no HTML
                textContent: generateTextbookNotes(name), // plain text notes
                isTextbook: true,
              };
              const fileEntry = { id: fileId, name, size: sizeStr, date: today, isTextbook: true };
              localStorage.setItem("studyforge_uploads", JSON.stringify([fileEntry, ...existingUploads]));
              localStorage.setItem("studyforge_notes", JSON.stringify([textbookNote, ...existingNotes]));
            } else {
              // Regular PDF mode: generate HTML notes, flashcards, quizzes
              const materials = generateStudyMaterials(name, sizeStr);
              const existingDecks = JSON.parse(localStorage.getItem("studyforge_flashcards_decks") || "[]");
              const existingCards = JSON.parse(localStorage.getItem("studyforge_flashcards_cards") || "[]");
              const existingQuizzes = JSON.parse(localStorage.getItem("studyforge_quizzes") || "[]");
              const existingQuestions = JSON.parse(localStorage.getItem("studyforge_questions") || "[]");
              localStorage.setItem("studyforge_uploads", JSON.stringify([materials.file, ...existingUploads]));
              localStorage.setItem("studyforge_notes", JSON.stringify([materials.note, ...existingNotes]));
              localStorage.setItem("studyforge_flashcards_decks", JSON.stringify([materials.deck, ...existingDecks]));
              localStorage.setItem("studyforge_flashcards_cards", JSON.stringify([...materials.cards, ...existingCards]));
              localStorage.setItem("studyforge_quizzes", JSON.stringify([materials.quiz, ...existingQuizzes]));
              localStorage.setItem("studyforge_questions", JSON.stringify([...materials.questions, ...existingQuestions]));
            }

            setUploadState("success");
          }, uploadMode === "textbook" ? 3000 : 2000);

          return 100;
        }
        return prev + increment;
      });
    }, 150);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
          Upload Study Material
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
          Upload your PDFs and let AI generate notes, flashcards, and quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <button
              onClick={() => { if (uploadState === "idle") setUploadMode("pdf"); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                uploadMode === "pdf" ? "text-white shadow-md" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
              style={uploadMode === "pdf" ? { background: "linear-gradient(135deg, var(--forge-indigo), var(--forge-violet))" } : {}}
              id="mode-pdf-btn"
            >
              <FileText className="w-4 h-4" /> Study PDF
            </button>
            <button
              onClick={() => { if (uploadState === "idle") setUploadMode("textbook"); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                uploadMode === "textbook" ? "text-white shadow-md" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
              style={uploadMode === "textbook" ? { background: "linear-gradient(135deg, #0EA5E9, #6366F1)" } : {}}
              id="mode-textbook-btn"
            >
              <BookOpen className="w-4 h-4" /> Textbook
            </button>
          </div>

          {uploadMode === "textbook" && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)" }}>
              <BookOpen className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#0EA5E9" }} />
              <p style={{ color: "var(--foreground-secondary)" }}>
                <strong style={{ color: "#0EA5E9" }}>Textbook Mode:</strong> Supports up to <strong>500MB</strong>. Your textbook will be converted into clean, structured <strong>chapter notes</strong> — no HTML files. Great for large books!
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {uploadState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? "border-indigo-500 bg-indigo-500/5" 
                    : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center mb-6">
                  <UploadIcon className={`w-10 h-10 ${isDragging ? "text-indigo-500 animate-bounce" : "text-[var(--forge-indigo)]"}`} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
                  Drag & drop your PDF here
                </h3>
                <p className="mb-6" style={{ color: "var(--foreground-secondary)" }}>
                  or click to browse files
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--background)] border text-xs font-medium" style={{ borderColor: "var(--border)", color: "var(--foreground-muted)" }}>
                  {uploadMode === "textbook" ? <BookOpen className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  {uploadMode === "textbook" ? "Supports PDF textbooks up to 500MB" : "Supports PDF up to 50MB"}
                </div>
              </motion.div>
            )}

            {(uploadState === "uploading" || uploadState === "processing") && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="border rounded-2xl p-12 text-center bg-[var(--surface)] glass shadow-lg"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="44" className="stroke-[var(--surface-hover)]" strokeWidth="8" fill="none" />
                    <circle 
                      cx="48" cy="48" r="44" 
                      className="stroke-indigo-500" 
                      strokeWidth="8" fill="none" 
                      strokeDasharray="276" 
                      strokeDashoffset={276 - (276 * progress) / 100}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.15s linear" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{progress}%</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 animate-pulse">
                  {uploadState === "uploading"
                    ? (uploadMode === "textbook" ? "Uploading Textbook..." : "Uploading Document...")
                    : (uploadMode === "textbook" ? "Converting to Notes..." : "AI is Analyzing Content...")}
                </h3>
                {selectedFile && (
                  <p className="text-xs font-mono font-bold mb-3 truncate max-w-md mx-auto" style={{ color: "var(--forge-indigo)" }}>
                    {selectedFile.name} ({selectedFile.size})
                  </p>
                )}
                <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                  {uploadState === "uploading"
                    ? "Please wait while we securely upload your file."
                    : uploadMode === "textbook"
                    ? "Extracting chapters, generating structured notes, and building your study guide."
                    : "Extracting text, generating summaries, and creating study tools."}
                </p>
              </motion.div>
            )}

            {uploadState === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-2xl p-8 bg-[var(--surface)] glass shadow-lg text-center"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-emerald-500">
                  Processing Complete!
                </h3>
                {selectedFile && (
                  <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
                    Successfully processed: <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">{selectedFile.name}</span>
                  </p>
                )}
                <p className="mb-8 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                  {uploadMode === "textbook"
                    ? "Your textbook has been converted into structured notes. View them in Notes."
                    : "Your document has been successfully analyzed. What would you like to do next?"}
                </p>

                {uploadMode === "textbook" ? (
                  <div className="flex flex-col items-center gap-4">
                    <Link
                      href="/dashboard/notes"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 shadow-lg"
                      style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)" }}
                    >
                      <BookOpen className="w-5 h-5" /> View Textbook Notes
                    </Link>
                    <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>Your notes are saved in the Notes section</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link href="/dashboard/notes" className="flex flex-col items-center gap-3 p-4 rounded-xl border hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group" style={{ borderColor: "var(--border)" }}>
                      <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>View Notes</span>
                    </Link>
                    <Link href="/dashboard/flashcards" className="flex flex-col items-center gap-3 p-4 rounded-xl border hover:border-violet-500 hover:bg-violet-500/5 transition-all group" style={{ borderColor: "var(--border)" }}>
                      <div className="p-3 rounded-lg bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform">
                        <Layers className="w-6 h-6" />
                      </div>
                      <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>Flashcards</span>
                    </Link>
                    <Link href="/dashboard/quiz" className="flex flex-col items-center gap-3 p-4 rounded-xl border hover:border-amber-500 hover:bg-amber-500/5 transition-all group" style={{ borderColor: "var(--border)" }}>
                      <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6" />
                      </div>
                      <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>Take Quiz</span>
                    </Link>
                  </div>
                )}

                <button 
                  onClick={() => { setUploadState("idle"); setSelectedFile(null); }}
                  className="mt-8 text-sm font-medium hover:underline text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Upload another file
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Storage Info */}
          <div className="glass rounded-xl p-5 border" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <FileCode className="w-4 h-4 text-indigo-500" /> Storage Usage
            </h3>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "var(--foreground-muted)" }}>{storageMb} MB / 1 GB</span>
              <span className="font-medium" style={{ color: "var(--foreground)" }}>{storagePercentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--surface-hover)]">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500" 
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--foreground-muted)" }}>
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Pro users get up to 10GB of storage.
            </p>
          </div>

          {/* Recent Uploads */}
          <div className="glass rounded-xl p-5 border" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                <FileText className="w-4 h-4 text-violet-500" /> Recent Uploads
              </h3>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {recentUploads.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: "var(--foreground-muted)" }}>
                  No uploaded files yet.
                </p>
              ) : (
                recentUploads.map((file) => (
                  <div key={file.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors group border border-transparent hover:border-[var(--border)]">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                      <File className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{file.name}</p>
                      <div className="flex items-center gap-2 text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>
                        <span>{file.date}</span>
                        <span>•</span>
                        <span>{file.size}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/notes" className="w-full mt-4 py-2 text-sm font-medium hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-[var(--forge-indigo)] flex items-center justify-center gap-1">
              View all files <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
