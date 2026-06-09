"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Bookmark, MoreVertical, FileText, ChevronDown, Upload, Download, Eye, X, BookOpen, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";
import { convertHtmlToText, convertTextToHtml } from "@/lib/generator";

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [activeNote, setActiveNote] = useState<any | null>(null);
  
  // State for format viewer toggles and conversion animations
  const [viewMode, setViewMode] = useState<"html" | "text">("text");
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const storedNotes = localStorage.getItem("studyforge_notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  // Whenever a note is opened, always default to the distraction-free Notes version (plain text)
  useEffect(() => {
    if (activeNote) {
      setViewMode("text");
      
      // Auto-extract textContent on-the-fly for any legacy notes that don't have it
      if (!activeNote.textContent && activeNote.htmlContent) {
        const extractedText = convertHtmlToText(activeNote.htmlContent);
        const updatedNotes = notes.map(n => {
          if (n.id === activeNote.id) {
            return { ...n, textContent: extractedText };
          }
          return n;
        });
        localStorage.setItem("studyforge_notes", JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
        setActiveNote({ ...activeNote, textContent: extractedText });
      }
    }
  }, [activeNote]);

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

  // Triggers dynamic Textbook plain text to HTML guide conversion
  const handleConvertToHtml = () => {
    if (!activeNote) return;
    setIsConverting(true);
    
    setTimeout(() => {
      const generatedHtml = convertTextToHtml(
        activeNote.title,
        activeNote.textContent || "",
        activeNote.subject,
        activeNote.color
      );
      
      const updatedNotes = notes.map(n => {
        if (n.id === activeNote.id) {
          return { ...n, htmlContent: generatedHtml };
        }
        return n;
      });
      
      localStorage.setItem("studyforge_notes", JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      setActiveNote({ ...activeNote, htmlContent: generatedHtml });
      setIsConverting(false);
    }, 1200);
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
            Access, view, and switch between plain-text textbook notes and premium HTML guides.
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
              className="glass rounded-xl p-5 card-lift border border-[var(--border)] relative group flex flex-col h-full animate-fade-in"
            >
              {/* Tag & Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${note.color}15`, color: note.color }}>
                    {note.subject}
                  </span>
                  {note.isTextbook && !note.htmlContent && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(14,165,233,0.12)", color: "#0EA5E9", border: "1px solid rgba(14,165,233,0.25)" }}>
                      <BookOpen className="w-3 h-3" /> Textbook
                    </span>
                  )}
                  {note.htmlContent && note.textContent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      Dual Mode
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {note.htmlContent && (
                    <button onClick={(e) => downloadHtmlFile(note, e)} title="Download HTML" className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-emerald-500 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {note.textContent && (
                    <button onClick={(e) => downloadTextFile(note, e)} title="Download Text Notes" className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-sky-500 transition-colors">
                      <FileText className="w-4 h-4" />
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
                  <Eye className="w-3.5 h-3.5" /> View Note
                </button>
                <button 
                  onClick={(e) => note.htmlContent ? downloadHtmlFile(note, e) : downloadTextFile(note, e)}
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

      {/* Interactive Dual Format Note Viewer Modal */}
      <AnimatePresence>
        {activeNote && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[999] flex flex-col"
          >
            {/* Modal Header */}
            <div className="h-16 bg-[#06090F] border-b border-[#162035] px-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button 
                  onClick={() => setActiveNote(null)}
                  className="p-2 rounded-lg hover:bg-[#111B2E] text-[#7A9AB8] hover:text-white transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="truncate">
                  <h2 className="text-sm font-bold text-white leading-tight font-mono truncate">{activeNote.title}</h2>
                  <span className="text-[10px] text-[#7A9AB8] uppercase tracking-wider font-semibold">
                    {activeNote.isTextbook ? "📚 Textbook Source" : "📄 PDF Source"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {viewMode === "html" && activeNote.htmlContent && (
                  <button 
                    onClick={() => downloadHtmlFile(activeNote)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors text-xs font-bold shadow-md shadow-emerald-950/20"
                  >
                    <Download className="w-4 h-4" /> Download HTML
                  </button>
                )}
                {viewMode === "text" && activeNote.textContent && (
                  <button 
                    onClick={() => downloadTextFile(activeNote)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-colors text-xs font-bold shadow-md"
                    style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)" }}
                  >
                    <Download className="w-4 h-4" /> Download .txt
                  </button>
                )}
                <button 
                  onClick={() => setActiveNote(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111B2E] text-white hover:bg-[#162035] border border-[#1E2F4A] transition-colors text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-[#06090F] overflow-auto flex flex-col justify-start">
              {viewMode === "text" ? (
                /* Plain text notes viewer */
                <div className="max-w-3xl mx-auto p-8 w-full relative">
                  {/* Option next to notes to view HTML version */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#162035]">
                    <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-400" /> Study Notes
                    </h3>
                    <button
                      onClick={() => setViewMode("html")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90 shadow-md shadow-indigo-950/40"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" /> HTML Version
                    </button>
                  </div>
                  
                  <pre
                    className="whitespace-pre-wrap font-mono text-sm leading-relaxed"
                    style={{ color: "#D8E8F5", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                  >
                    {activeNote.textContent}
                  </pre>
                </div>
              ) : (
                /* HTML guide viewer */
                <div className="flex-1 relative flex flex-col h-full w-full">
                  {/* Option to return back to Notes version */}
                  <div className="h-10 bg-[#0E1626] border-b border-[#162035] px-6 flex items-center justify-between flex-shrink-0">
                    <span className="text-xs text-[#7A9AB8] font-semibold tracking-wider uppercase">Interactive HTML Guide</span>
                    <button
                      onClick={() => setViewMode("text")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C2C4E] hover:bg-[#253966] text-white text-[11px] font-bold transition-colors border border-[#253966]"
                    >
                      ← Back to Notes
                    </button>
                  </div>
                  
                  {activeNote.htmlContent ? (
                    <iframe 
                      srcDoc={activeNote.htmlContent}
                      title={activeNote.title}
                      className="w-full h-full border-none flex-1"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    /* Auto-convert or prompt to convert Textbook note to HTML */
                    <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center px-6 py-12">
                      <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400">
                        {isConverting ? (
                          <RefreshCw className="w-8 h-8 animate-spin" />
                        ) : (
                          <Sparkles className="w-8 h-8 animate-pulse" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">Generate HTML Guide</h3>
                      <p className="text-sm text-[#7A9AB8] mb-6 leading-relaxed">
                        Transform this plain text textbook note into a premium interactive HTML study guide with custom chapters, callouts, and layout stylings.
                      </p>
                      <button
                        onClick={handleConvertToHtml}
                        disabled={isConverting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isConverting ? "Converting note..." : "Convert to HTML"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
