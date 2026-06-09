"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Bookmark, MoreVertical, FileText, ChevronDown, Upload, Download, Eye, X, BookOpen } from "lucide-react";
import Link from "next/link";

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [activeNote, setActiveNote] = useState<any | null>(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem("studyforge_notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  const subjects = ["All", ...Array.from(new Set(notes.map((n) => n.subject)))];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const downloadHtmlFile = (note: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!note.htmlContent) return;
    const blob = new Blob([note.htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[\s\W]+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadTextFile = (note: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!note.textContent) return;
    const blob = new Blob([note.textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[\s\W]+/g, "_")}_notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
            My Notes
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
            Access, view, and download your AI-generated HTML study guides.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/upload" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Create Note
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5" style={{ color: "var(--foreground-muted)" }} />
          </div>
          <input 
            type="text" 
            placeholder="Search in notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-sm"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        
        <div className="flex overflow-x-auto pb-2 lg:pb-0 hide-scrollbar w-full gap-2">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSubject === subject 
                  ? "bg-indigo-500/10 text-[var(--forge-indigo)]" 
                  : "glass hover:bg-[var(--surface-hover)] text-[var(--foreground-secondary)]"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-20 glass border rounded-2xl flex flex-col items-center justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-500">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>No Notes Found</h3>
          <p className="max-w-md text-sm mb-6" style={{ color: "var(--foreground-secondary)" }}>
            {notes.length === 0 
              ? "You haven't uploaded any PDF files yet. Upload a syllabus or textbook chapter to generate study notes."
              : "No notes match your current search terms or filters."}
          </p>
          {notes.length === 0 && (
            <Link href="/dashboard/upload" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity">
              <Upload className="w-4 h-4" /> Upload Material
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map((note) => (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-5 card-lift border border-[var(--border)] relative group flex flex-col h-full"
            >
              {/* Tag & Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${note.color}15`, color: note.color }}>
                    {note.subject}
                  </span>
                  {note.isTextbook && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(14,165,233,0.12)", color: "#0EA5E9", border: "1px solid rgba(14,165,233,0.25)" }}>
                      <BookOpen className="w-3 h-3" /> Textbook
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!note.isTextbook && (
                    <button onClick={(e) => downloadHtmlFile(note, e)} title="Download HTML" className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-emerald-500 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {note.isTextbook && (
                    <button onClick={(e) => downloadTextFile(note, e)} title="Download Text Notes" className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-sky-500 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold mb-2 pr-4 leading-snug group-hover:text-[var(--forge-indigo)] transition-colors" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
                {note.title}
              </h3>
              
              <p className="text-sm line-clamp-3 mb-6 flex-1" style={{ color: "var(--foreground-secondary)" }}>
                {note.preview}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4 pt-2">
                <button 
                  onClick={() => setActiveNote(note)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-500/10 text-[var(--forge-indigo)] hover:bg-indigo-500 hover:text-white transition-all text-xs font-semibold border border-indigo-500/20"
                >
                  <Eye className="w-3.5 h-3.5" /> {note.isTextbook ? "View Notes" : "View Guide"}
                </button>
                <button 
                  onClick={(e) => note.isTextbook ? downloadTextFile(note, e) : downloadHtmlFile(note, e)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[var(--surface-hover)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-all text-xs font-semibold border border-[var(--border)]"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs pt-3 border-t mt-auto" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-1.5" style={{ color: "var(--foreground-muted)" }}>
                  <FileText className="w-3.5 h-3.5" />
                  <span>{note.words} words</span>
                </div>
                <span style={{ color: "var(--foreground-muted)" }}>{note.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Note Viewer Modal */}
      <AnimatePresence>
        {activeNote && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[999] flex flex-col"
          >
            {/* Modal Header */}
            <div className="h-16 bg-[#06090F] border-b border-[#162035] px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveNote(null)}
                  className="p-2 rounded-lg hover:bg-[#111B2E] text-[#7A9AB8] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-sm font-bold text-white leading-tight font-mono">{activeNote.title}</h2>
                  <span className="text-[10px] text-[#7A9AB8] uppercase tracking-wider font-semibold">
                    {activeNote.isTextbook ? "📚 Textbook Notes" : "Interactive HTML Guide"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => activeNote.isTextbook ? downloadTextFile(activeNote) : downloadHtmlFile(activeNote)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-colors text-xs font-bold shadow-md"
                  style={{ background: activeNote.isTextbook ? "linear-gradient(135deg, #0EA5E9, #6366F1)" : "#059669" }}
                >
                  <Download className="w-4 h-4" /> {activeNote.isTextbook ? "Download .txt" : "Download HTML"}
                </button>
                <button 
                  onClick={() => setActiveNote(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111B2E] text-white hover:bg-[#162035] border border-[#1E2F4A] transition-colors text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-[#06090F] overflow-auto">
              {activeNote.isTextbook ? (
                /* Plain text viewer for textbook notes */
                <div className="max-w-3xl mx-auto p-8">
                  <pre
                    className="whitespace-pre-wrap font-mono text-sm leading-relaxed"
                    style={{ color: "#D8E8F5", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                  >
                    {activeNote.textContent}
                  </pre>
                </div>
              ) : (
                /* HTML iframe viewer for PDF study guides */
                <iframe 
                  srcDoc={activeNote.htmlContent}
                  title={activeNote.title}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
