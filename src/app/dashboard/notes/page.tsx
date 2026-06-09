"use client";

import { motion } from "framer-motion";
import { Plus, Search, Bookmark, MoreVertical, FileText, ChevronDown } from "lucide-react";

const sampleNotes: any[] = [];

const subjects = ["All"];

export default function NotesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
            My Notes
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
            Access and manage all your AI-generated study notes.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border border-[var(--border)] hover:bg-[var(--surface)] transition-colors glass" style={{ color: "var(--foreground)" }}>
            <span className="text-sm">Filter: All</span> <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Create Note
          </button>
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-sm"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        
        <div className="flex overflow-x-auto pb-2 lg:pb-0 hide-scrollbar w-full gap-2">
          {subjects.map((subject, idx) => (
            <button
              key={subject}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                idx === 0 
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleNotes.map((note) => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-5 card-lift border border-[var(--border)] relative group cursor-pointer flex flex-col h-full"
          >
            {/* Tag & Actions */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${note.color}15`, color: note.color }}>
                {note.subject}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-yellow-500 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
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

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-4 border-t mt-auto" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-1.5" style={{ color: "var(--foreground-muted)" }}>
                <FileText className="w-3.5 h-3.5" />
                <span>{note.words} words</span>
              </div>
              <span style={{ color: "var(--foreground-muted)" }}>{note.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
