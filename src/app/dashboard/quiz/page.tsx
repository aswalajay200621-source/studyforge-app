"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Plus, Clock, AlertCircle, CheckCircle2, XCircle, RotateCcw, ChevronRight } from "lucide-react";

const sampleQuizzes: any[] = [];
const sampleQuestions: any[] = [];

export default function QuizPage() {
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins

  // Timer logic
  useEffect(() => {
    if (activeQuiz !== null && !quizFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [activeQuiz, quizFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    
    setIsAnswered(true);
    if (selectedOption === sampleQuestions[currentQuestionIdx].correctId) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < sampleQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setTimeLeft(15 * 60);
  };

  // ------------------- QUIZ FINISHED VIEW -------------------
  if (quizFinished) {
    const percentage = Math.round((score / sampleQuestions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
          Quiz Results
        </h1>
        
        <div className="glass p-10 rounded-3xl w-full max-w-md flex flex-col items-center mb-8 border border-[var(--border)] shadow-lg">
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" className="stroke-[var(--surface-hover)]" strokeWidth="12" fill="none" />
              <circle 
                cx="96" cy="96" r="88" 
                className="stroke-[var(--forge-indigo)]" 
                strokeWidth="12" fill="none" 
                strokeDasharray="553" 
                strokeDashoffset={553 - (553 * percentage) / 100}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold" style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}>{percentage}%</span>
              <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>Score</span>
            </div>
          </div>
          
          <div className="w-full grid grid-cols-2 gap-4 text-center">
            <div className="bg-emerald-500/10 rounded-xl p-3">
              <div className="text-emerald-500 font-bold text-xl">{score}</div>
              <div className="text-xs text-emerald-500/80 uppercase tracking-wider">Correct</div>
            </div>
            <div className="bg-red-500/10 rounded-xl p-3">
              <div className="text-red-500 font-bold text-xl">{sampleQuestions.length - score}</div>
              <div className="text-xs text-red-500/80 uppercase tracking-wider">Incorrect</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={resetQuiz} className="px-6 py-3 rounded-xl font-semibold glass hover:bg-[var(--surface-hover)] transition-colors border border-[var(--border)]" style={{ color: "var(--foreground)" }}>
            Back to Quizzes
          </button>
          <button onClick={() => { setQuizFinished(false); setCurrentQuestionIdx(0); setScore(0); setSelectedOption(null); setIsAnswered(false); setTimeLeft(15 * 60); }} className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md">
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // ------------------- QUIZ TAKING VIEW -------------------
  if (activeQuiz !== null) {
    const question = sampleQuestions[currentQuestionIdx];
    
    return (
      <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header & Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
              Question {currentQuestionIdx + 1} of {sampleQuestions.length}
            </span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass font-mono text-sm border" style={{ borderColor: "var(--border)", color: timeLeft < 60 ? "#EF4444" : "var(--foreground)" }}>
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--surface)]">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIdx) / sampleQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl md:text-3xl font-medium leading-relaxed mb-8" style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}>
            {question.text}
          </h2>

          <div className="space-y-3 mt-auto mb-8">
            {question.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = isAnswered && opt.id === question.correctId;
              const isWrong = isAnswered && isSelected && opt.id !== question.correctId;
              
              let borderStyle = "border-[var(--border)]";
              let bgStyle = "bg-[var(--surface)]";
              
              if (isSelected && !isAnswered) {
                borderStyle = "border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]";
                bgStyle = "bg-indigo-500/5";
              } else if (isCorrect) {
                borderStyle = "border-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]";
                bgStyle = "bg-emerald-500/10";
              } else if (isWrong) {
                borderStyle = "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]";
                bgStyle = "bg-red-500/10";
              } else if (isAnswered && !isSelected && !isCorrect) {
                bgStyle = "opacity-50 bg-[var(--surface)]";
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.id)}
                  disabled={isAnswered}
                  className={`w-full flex items-center p-4 rounded-xl border text-left transition-all ${borderStyle} ${bgStyle} ${!isAnswered ? "hover:border-indigo-500/50 hover:bg-[var(--surface-hover)]" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-4 transition-colors ${
                    isCorrect ? "bg-emerald-500 text-white" : isWrong ? "bg-red-500 text-white" : isSelected ? "bg-indigo-500 text-white" : "bg-[var(--surface-hover)] text-[var(--foreground-muted)]"
                  }`}>
                    {opt.id}
                  </div>
                  <span className="flex-1 text-lg" style={{ color: "var(--foreground)" }}>{opt.text}</span>
                  
                  {isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  {isWrong && <XCircle className="w-6 h-6 text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl glass border border-[var(--border)] mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-indigo-500 mb-1">Explanation</h4>
                  <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>{question.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <div className="flex justify-end border-t pt-6" style={{ borderColor: "var(--border)" }}>
            {!isAnswered ? (
              <button 
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                Submit Answer
              </button>
            ) : (
              <button 
                onClick={handleNextQuestion}
                className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md"
              >
                {currentQuestionIdx < sampleQuestions.length - 1 ? "Next Question" : "View Results"} <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ------------------- QUIZ SELECTION VIEW -------------------
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
            Quizzes
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
            Test your knowledge with AI-generated multiple choice questions.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity shadow-md">
          <Plus className="w-4 h-4" /> Generate Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleQuizzes.map((quiz) => (
          <motion.div 
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-5 card-lift border border-[var(--border)] flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg" style={{ background: `${quiz.color}15` }}>
                <Brain className="w-5 h-5" style={{ color: quiz.color }} />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-[var(--surface-hover)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                {quiz.difficulty}
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-4 pr-4 leading-snug flex-1" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
              {quiz.title}
            </h3>
            
            <div className="grid grid-cols-3 gap-2 mb-6 text-center divide-x" style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--foreground-muted)" }}>Questions</p>
                <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{quiz.questions}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--foreground-muted)" }}>Time</p>
                <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{quiz.time}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--foreground-muted)" }}>Best</p>
                <p className="font-semibold text-sm text-emerald-500">{quiz.score}%</p>
              </div>
            </div>

            <button 
              onClick={() => setActiveQuiz(quiz.id)}
              className="w-full py-2.5 rounded-lg font-semibold bg-[var(--surface-hover)] hover:bg-indigo-500 hover:text-white border border-[var(--border)] hover:border-indigo-500 transition-all text-sm"
              style={{ color: "var(--foreground)" }}
            >
              Start Quiz
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
