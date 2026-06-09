"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, FileText, CheckCircle2, AlertCircle, File, FileCode, Layers, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

const recentUploads: any[] = [];

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "success">("idle");
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    if (uploadState !== "idle") return;
    
    setUploadState("uploading");
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("processing");
          setTimeout(() => setUploadState("success"), 2500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
          <AnimatePresence mode="wait">
            {uploadState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  isDragging 
                    ? "border-indigo-500 bg-indigo-500/5" 
                    : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={simulateUpload}
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
                  <FileText className="w-4 h-4" /> Supports PDF up to 50MB
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
                      style={{ transition: "stroke-dashoffset 0.1s linear" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{progress}%</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 animate-pulse">
                  {uploadState === "uploading" ? "Uploading Document..." : "AI is Analyzing Content..."}
                </h3>
                <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                  {uploadState === "uploading" 
                    ? "Please wait while we securely upload your file." 
                    : "Extracting text, generating summaries, and creating knowledge graphs."}
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
                <p className="mb-8" style={{ color: "var(--foreground-secondary)" }}>
                  Your document has been successfully analyzed. What would you like to do next?
                </p>
                
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

                <button 
                  onClick={() => setUploadState("idle")}
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
              <span style={{ color: "var(--foreground-muted)" }}>0 MB / 1 GB</span>
              <span className="font-medium" style={{ color: "var(--foreground)" }}>0%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--surface-hover)]">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 w-[0%]" />
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
            <div className="space-y-3">
              {recentUploads.map((file) => (
                <div key={file.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors group cursor-pointer border border-transparent hover:border-[var(--border)]">
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
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-[var(--forge-indigo)] flex items-center justify-center gap-1">
              View all files <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
