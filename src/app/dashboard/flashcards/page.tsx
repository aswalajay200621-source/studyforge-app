"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Plus, ChevronLeft, ChevronRight, Check, X, RotateCcw, Upload } from "lucide-react";
import Link from "next/link";

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [activeDeck, setActiveDeck] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const storedDecks = localStorage.getItem("studyforge_flashcards_decks");
    const storedCards = localStorage.getItem("studyforge_flashcards_cards");
    if (storedDecks) {
      setDecks(JSON.parse(storedDecks));
    }
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  }, []);

  const handleNext = (deckCardsCount: number) => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev < deckCardsCount - 1 ? prev + 1 : prev));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }, 150);
  };

  if (activeDeck !== null) {
    const deckInfo = decks.find(d => d.id === activeDeck);
    const deckCards = cards.filter(c => c.deckId === activeDeck);
    
    return (
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => { setActiveDeck(null); setCurrentCardIndex(0); setIsFlipped(false); }}
              className="flex items-center gap-1 text-sm mb-2 hover:underline" style={{ color: "var(--foreground-muted)" }}
            >
              <ChevronLeft className="w-4 h-4" /> Back to Decks
            </button>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
              {deckInfo?.name}
            </h1>
          </div>
          <div className="text-sm font-medium px-4 py-2 rounded-full glass">
            Card {deckCards.length > 0 ? currentCardIndex + 1 : 0} of {deckCards.length}
          </div>
        </div>

        {/* Progress bar */}
        {deckCards.length > 0 && (
          <div className="w-full h-1.5 rounded-full mb-8 bg-[var(--surface)]">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentCardIndex + 1) / deckCards.length) * 100}%` }}
            />
          </div>
        )}

        {/* Card Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000 w-full mb-12">
          {deckCards.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCardIndex + (isFlipped ? '-back' : '-front')}
                initial={{ rotateX: isFlipped ? -90 : 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: isFlipped ? 90 : -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-2xl aspect-[3/2] glass border border-[var(--border)] rounded-3xl p-10 flex items-center justify-center cursor-pointer shadow-lg card-lift absolute inset-0 m-auto bg-[var(--surface-hover)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute top-4 right-6 text-sm opacity-50 font-medium">
                  {isFlipped ? "Answer" : "Question"}
                </div>
                <p className="text-2xl md:text-3xl text-center font-medium leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {isFlipped ? deckCards[currentCardIndex]?.back : deckCards[currentCardIndex]?.front}
                </p>
                <div className="absolute bottom-6 text-xs opacity-40">Click to flip</div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>No cards in this deck.</p>
          )}
        </div>

        {/* Controls */}
        {deckCards.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-auto">
            <button 
              onClick={handlePrev}
              disabled={currentCardIndex === 0}
              className="p-3 rounded-full glass hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3">
              <button onClick={() => handleNext(deckCards.length)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-semibold transition-colors">
                <X className="w-5 h-5" /> Hard
              </button>
              <button onClick={() => handleNext(deckCards.length)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-semibold transition-colors">
                <Check className="w-5 h-5" /> Easy
              </button>
            </div>

            <button 
              onClick={() => handleNext(deckCards.length)}
              disabled={currentCardIndex === deckCards.length - 1}
              className="p-3 rounded-full glass hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
            Flashcards
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
            Master concepts through active recall and spaced repetition.
          </p>
        </div>
        <Link href="/dashboard/upload" className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Create Deck
        </Link>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-20 glass border rounded-2xl flex flex-col items-center justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 text-violet-500">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>No Flashcard Decks Found</h3>
          <p className="max-w-md text-sm mb-6" style={{ color: "var(--foreground-secondary)" }}>
            You haven't uploaded any PDF files yet. Upload a syllabus or textbook chapter to generate interactive flashcards.
          </p>
          <Link href="/dashboard/upload" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity">
            <Upload className="w-4 h-4" /> Upload Material
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <motion.div 
              key={deck.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-5 card-lift border border-[var(--border)] relative overflow-hidden group cursor-pointer"
              onClick={() => setActiveDeck(deck.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ background: `${deck.color}15`, color: deck.color }}>
                  {deck.subject}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--foreground-muted)" }}>
                  <Layers className="w-3.5 h-3.5" /> {deck.count} cards
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-2 pr-4 leading-tight group-hover:text-[var(--forge-indigo)] transition-colors" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
                {deck.name}
              </h3>
              
              <p className="text-xs mb-6" style={{ color: "var(--foreground-secondary)" }}>
                Last studied: {deck.lastStudied}
              </p>

              <div className="flex items-center justify-between text-xs mb-2">
                <span style={{ color: "var(--foreground-muted)" }}>Mastery</span>
                <span className="font-semibold" style={{ color: deck.color }}>{deck.progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--surface-hover)]">
                <div className="h-full rounded-full" style={{ width: `${deck.progress}%`, background: deck.color }} />
              </div>

              {/* Hover Play Button Overlay */}
              <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white text-indigo-600 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Study Now
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
