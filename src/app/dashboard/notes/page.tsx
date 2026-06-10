"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Bookmark, MoreVertical, FileText, ChevronDown, Upload, Download, Eye, X, BookOpen, Sparkles, RefreshCw, Layers, Brain, Volume2, VolumeX, Pause, Play, SkipForward, SkipBack, Settings as SettingsIcon, Trash2, Palette } from "lucide-react";
import Link from "next/link";
import { convertHtmlToText, convertTextToHtml } from "@/lib/generator";
import { themes, getThemeById, getThemeForSubject, generateThemedHtml, type Theme } from "@/lib/themes";

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [activeNote, setActiveNote] = useState<any | null>(null);
  
  // State for format viewer toggles and conversion animations
  const [viewMode, setViewMode] = useState<"html" | "text">("text");
  const [isConverting, setIsConverting] = useState(false);
  
  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Text-to-Speech states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem("studyforge_notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }

    // Load available voices for text-to-speech
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoice) {
        // Prefer English voices
        const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        setSelectedVoice(englishVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      // Cleanup: stop speech when component unmounts
      window.speechSynthesis.cancel();
    };
  }, []);

  // Whenever a note is opened, always default to the distraction-free Notes version (plain text)
  useEffect(() => {
    if (activeNote) {
      setViewMode("text");
      
      // Stop any ongoing speech when switching notes
      stopSpeech();
      
      // Set theme based on subject
      const suggestedTheme = getThemeForSubject(activeNote.subject || 'General');
      setSelectedTheme(suggestedTheme);
      
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
    } else {
      // Stop speech when closing note
      stopSpeech();
    }
  }, [activeNote]);

  // Text-to-Speech Functions
  const startSpeech = () => {
    if (!activeNote?.textContent) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(activeNote.textContent);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
    };

    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  };

  const togglePlayPause = () => {
    if (!isPlaying) {
      startSpeech();
    } else if (isPaused) {
      resumeSpeech();
    } else {
      pauseSpeech();
    }
  };

  const changeSpeed = (newRate: number) => {
    setSpeechRate(newRate);
    if (isPlaying) {
      // Restart with new speed
      stopSpeech();
      setTimeout(() => startSpeech(), 100);
    }
  };

  const changeVoice = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    if (isPlaying) {
      // Restart with new voice
      stopSpeech();
      setTimeout(() => startSpeech(), 100);
    }
  };

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

  // Triggers dynamic Textbook plain text to HTML guide conversion with theme
  const handleConvertToHtml = () => {
    if (!activeNote) return;
    setIsConverting(true);
    
    setTimeout(() => {
      // Convert text content to formatted HTML with proper structure
      const formattedContent = activeNote.textContent
        .split('\n\n')
        .map((para: string) => {
          // Check if it's a heading
          if (para.startsWith('# ')) {
            return `<h2>${para.substring(2)}</h2>`;
          } else if (para.startsWith('## ')) {
            return `<h3>${para.substring(3)}</h3>`;
          } else if (para.startsWith('### ')) {
            return `<h4>${para.substring(4)}</h4>`;
          } else if (para.startsWith('- ') || para.startsWith('• ')) {
            const items = para.split('\n').map(line => {
              const text = line.replace(/^[-•]\s*/, '');
              return text ? `<li>${text}</li>` : '';
            }).filter(Boolean).join('');
            return `<ul>${items}</ul>`;
          } else if (para.match(/^\d+\./)) {
            const items = para.split('\n').map(line => {
              const text = line.replace(/^\d+\.\s*/, '');
              return text ? `<li>${text}</li>` : '';
            }).filter(Boolean).join('');
            return `<ol>${items}</ol>`;
          } else if (para.startsWith('```')) {
            const code = para.replace(/```/g, '');
            return `<pre><code>${code}</code></pre>`;
          } else if (para.trim().startsWith('**') || para.includes('Definition:') || para.includes('Key Concept:')) {
            return `<div class="definition"><div class="definition-term">${para.replace(/\*\*/g, '')}</div></div>`;
          } else if (para.includes('Example:') || para.includes('📌')) {
            return `<div class="example"><div class="example-title">Example</div><p>${para.replace(/Example:|📌/g, '')}</p></div>`;
          } else if (para.includes('Important:') || para.includes('Note:') || para.includes('⚠️')) {
            return `<div class="callout"><div class="callout-title">Important</div><p>${para.replace(/Important:|Note:|⚠️/g, '')}</p></div>`;
          } else if (para.match(/[=≠<>≤≥∑∫]/)) {
            return `<div class="formula">${para}</div>`;
          } else {
            return `<p>${para}</p>`;
          }
        })
        .join('\n');
      
      // Generate themed HTML
      const generatedHtml = generateThemedHtml(
        activeNote.title,
        formattedContent,
        selectedTheme,
        activeNote.subject
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
  
  // Apply theme to existing HTML
  const applyThemeToNote = (theme: Theme) => {
    if (!activeNote || !activeNote.htmlContent) return;
    
    setIsConverting(true);
    setTimeout(() => {
      // Extract content from existing HTML or use text content
      const content = activeNote.textContent
        ? activeNote.textContent.split('\n\n').map((para: string) => `<p>${para}</p>`).join('\n')
        : activeNote.htmlContent;
      
      const themedHtml = generateThemedHtml(
        activeNote.title,
        content,
        theme,
        activeNote.subject
      );
      
      const updatedNotes = notes.map(n => {
        if (n.id === activeNote.id) {
          return { ...n, htmlContent: themedHtml };
        }
        return n;
      });
      
      localStorage.setItem("studyforge_notes", JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      setActiveNote({ ...activeNote, htmlContent: themedHtml });
      setIsConverting(false);
    }, 800);
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
                {/* Quick Access to Study Tools */}
                <Link
                  href="/dashboard/flashcards"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border border-violet-500/20 transition-colors text-xs font-bold"
                  title="View Flashcards"
                >
                  <Layers className="w-4 h-4" /> Flashcards
                </Link>
                <Link
                  href="/dashboard/quiz"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors text-xs font-bold"
                  title="Take Quiz"
                >
                  <Brain className="w-4 h-4" /> Quiz
                </Link>
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

                  {/* Audio Player Controls */}
                  <div className="mb-6 glass rounded-xl p-4 border border-[#162035]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-semibold text-white">Podcast Mode / Read Aloud</span>
                      </div>
                      <button
                        onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                        className="p-2 rounded-lg hover:bg-[#111B2E] transition-colors"
                        title="Voice Settings"
                      >
                        <SettingsIcon className="w-4 h-4 text-[#7A9AB8]" />
                      </button>
                    </div>

                    {/* Voice Settings Panel */}
                    {showVoiceSettings && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 p-3 rounded-lg bg-[#0E1626] border border-[#162035]"
                      >
                        <div className="space-y-3">
                          {/* Voice Selection */}
                          <div>
                            <label className="text-xs text-[#7A9AB8] mb-1 block">Voice</label>
                            <select
                              value={selectedVoice?.name || ''}
                              onChange={(e) => {
                                const voice = availableVoices.find(v => v.name === e.target.value);
                                if (voice) changeVoice(voice);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#06090F] border border-[#162035] text-white text-xs focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                            >
                              {availableVoices.map((voice) => (
                                <option key={voice.name} value={voice.name}>
                                  {voice.name} ({voice.lang})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Speed Control */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-xs text-[#7A9AB8]">Speed</label>
                              <span className="text-xs text-emerald-400 font-mono">{speechRate.toFixed(1)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="2.0"
                              step="0.1"
                              value={speechRate}
                              onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #10B981 0%, #10B981 ${((speechRate - 0.5) / 1.5) * 100}%, #162035 ${((speechRate - 0.5) / 1.5) * 100}%, #162035 100%)`
                              }}
                            />
                            <div className="flex justify-between text-[10px] text-[#7A9AB8] mt-1">
                              <span>0.5x</span>
                              <span>1.0x</span>
                              <span>2.0x</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Playback Controls */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={stopSpeech}
                        disabled={!isPlaying}
                        className="p-2 rounded-lg hover:bg-[#111B2E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Stop"
                      >
                        <SkipBack className="w-5 h-5 text-[#7A9AB8]" />
                      </button>

                      <button
                        onClick={togglePlayPause}
                        className="p-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 transition-all shadow-lg shadow-emerald-950/40"
                        title={!isPlaying ? "Play" : isPaused ? "Resume" : "Pause"}
                      >
                        {!isPlaying ? (
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        ) : isPaused ? (
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        ) : (
                          <Pause className="w-6 h-6 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          stopSpeech();
                          setTimeout(() => startSpeech(), 100);
                        }}
                        disabled={!isPlaying}
                        className="p-2 rounded-lg hover:bg-[#111B2E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Restart"
                      >
                        <SkipForward className="w-5 h-5 text-[#7A9AB8]" />
                      </button>

                      {isPlaying && (
                        <div className="ml-4 flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-xs text-emerald-400 font-medium">Playing...</span>
                        </div>
                      )}
                    </div>

                    {/* Info Text */}
                    <p className="text-center text-xs text-[#7A9AB8] mt-3">
                      {!isPlaying ? "Listen to your notes as a podcast while studying" : isPaused ? "Paused - Click play to resume" : "Now reading your notes aloud"}
                    </p>
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
                  {/* Option to return back to Notes version + Theme Selector */}
                  <div className="h-12 bg-[#0E1626] border-b border-[#162035] px-6 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#7A9AB8] font-semibold tracking-wider uppercase">Interactive HTML Guide</span>
                      
                      {/* Theme Selector */}
                      <div className="relative">
                        <button
                          onClick={() => setShowThemeSelector(!showThemeSelector)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C2C4E] hover:bg-[#253966] text-white text-[11px] font-bold transition-colors border border-[#253966]"
                        >
                          <Palette className="w-3.5 h-3.5" />
                          {selectedTheme.preview} {selectedTheme.name}
                        </button>
                        
                        {showThemeSelector && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-[#1C2C4E] border border-[#253966] rounded-lg shadow-2xl z-50 overflow-hidden"
                          >
                            <div className="p-2 border-b border-[#253966]">
                              <p className="text-[10px] text-[#7A9AB8] font-semibold uppercase tracking-wider px-2">Choose Theme</p>
                            </div>
                            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                              {themes.map((theme) => (
                                <button
                                  key={theme.id}
                                  onClick={() => {
                                    setSelectedTheme(theme);
                                    setShowThemeSelector(false);
                                    if (activeNote?.htmlContent) {
                                      applyThemeToNote(theme);
                                    }
                                  }}
                                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                                    selectedTheme.id === theme.id
                                      ? 'bg-indigo-500/20 border border-indigo-500/40'
                                      : 'hover:bg-[#253966] border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{theme.preview}</span>
                                    <span className="text-xs font-bold text-white">{theme.name}</span>
                                    {selectedTheme.id === theme.id && (
                                      <span className="ml-auto text-[10px] text-indigo-400">✓ Active</span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-[#7A9AB8] leading-relaxed">{theme.description}</p>
                                  <div className="flex gap-1 mt-2">
                                    <div className="w-4 h-4 rounded-full" style={{ background: theme.colors.primary }}></div>
                                    <div className="w-4 h-4 rounded-full" style={{ background: theme.colors.secondary }}></div>
                                    <div className="w-4 h-4 rounded-full" style={{ background: theme.colors.accent }}></div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
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
