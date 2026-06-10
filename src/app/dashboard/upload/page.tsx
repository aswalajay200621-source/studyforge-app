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
      startUploadFlow(file, file.name, sizeFormatted);
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
    
    // Generate comprehensive, detailed notes based on subject detection
    if (subject === "Computer Science" || /algo|comput|program|code|foc/i.test(name)) {
      return `📚 STUDY NOTES — ${clean.toUpperCase()}
Subject: Computer Science | Generated: ${today}
${"-".repeat(60)}

CHAPTER 1 — ORIGINS OF ALGORITHMS AND HISTORICAL CONTEXT
═════════════════════════════════════════════════════════

▶ DEFINITION OF ALGORITHM
  An algorithm is a finite sequence of well-defined, unambiguous instructions
  that can be executed mechanically to solve a problem or perform a computation.
  The term derives from Muhammad ibn Musa al-Khwarizmi, a 9th century Persian
  mathematician. Algorithmic thinking, however, dates back to ancient civilizations.

▶ HISTORICAL DEVELOPMENT

  • Ancient Babylonian Mathematics (2000-1600 BCE)
    - Solving quadratic equations
    - Early systematic procedures for mathematical problems
    - Clay tablets show step-by-step calculation methods

  • Indian Mathematics (800 BCE onwards)
    - Sulba Sutras: geometric algorithms
    - Aryabhata (476-550 CE): linear equations
    - Brahmagupta (598-668 CE): quadratic equations
    - Development of the decimal system and zero

  • Greek Mathematics (300 BCE)
    - Euclid's Elements introduced one of the oldest recorded algorithms
    - Euclid's Algorithm for computing the Greatest Common Divisor (GCD)
    - Systematic approach to geometric proofs

▶ GREATEST COMMON DIVISOR (GCD)

  Definition: Let a, b ∈ Z with at least one nonzero. The greatest common
  divisor gcd(a, b) is the largest positive integer that divides both a and b.

  Examples:
    • gcd(12, 8) = 4
    • gcd(15, 25) = 5
    • gcd(17, 19) = 1 (coprime numbers)
    • gcd(100, 50) = 50

▶ EUCLID'S GCD ALGORITHM

  Key Idea: gcd(a, b) = gcd(b, a mod b)

  Algorithm:
    1. Input: Non-negative integers a, b (not both zero)
    2. While b ≠ 0:
         temp = b
         b = a mod b
         a = temp
    3. Output: a (which is gcd(original a, original b))

  Example Execution: gcd(48, 18)
    Step 1: 48 mod 18 = 12  →  gcd(18, 12)
    Step 2: 18 mod 12 = 6   →  gcd(12, 6)
    Step 3: 12 mod 6 = 0    →  gcd(6, 0)
    Result: 6

  Time Complexity: O(log min(a, b))
  Space Complexity: O(1)

${"-".repeat(60)}

CHAPTER 2 — ARISTOTLE (384-322 BCE): FOUNDER OF FORMAL LOGIC
═════════════════════════════════════════════════════════════

▶ CONTRIBUTIONS

  Aristotle created the first formal system of logic and developed the theory
  of syllogisms, establishing the foundation of deductive reasoning. His logical
  works were collected in the Organon.

▶ FUNDAMENTAL LAWS OF THOUGHT

  Aristotle identified three laws that govern all reasoning:

  1. Law of Identity: A statement is identical to itself (A is A)
     Example: "A triangle is a triangle"

  2. Law of Non-Contradiction: A statement cannot be both true and false at
     the same time. If A is true, then not-A must be false.
     Example: A door cannot be open and not open simultaneously.

  3. Law of Excluded Middle: A statement is either true or false; no third
     option exists.
     Example: Either it is raining or it is not raining.

▶ SYLLOGISMS

  Definition: A syllogism is a logical argument consisting of a major premise,
  a minor premise, and a conclusion that follows necessarily from the premises.

  Structure:
    • Three terms: Major term (P), Minor term (S), Middle term (M)
    • Three propositions: Two premises and one conclusion

  Basic Form:
    All M are P (Major premise)
    All S are M (Minor premise)
    Therefore: All S are P (Conclusion)

  Classic Example — The Socrates Syllogism:
    • Major Premise: All humans are mortal
    • Minor Premise: Socrates is human
    • Conclusion: Therefore, Socrates is mortal

  The argument is valid because if Socrates belongs to the class "human" and
  all members of "human" belong to "mortal," then Socrates must belong to "mortal."

▶ LIMITATIONS OF SYLLOGISTIC LOGIC

  Syllogistic logic cannot express:
    • Relations (e.g., "John is taller than Mary")
    • Multiple quantifiers (e.g., "Everyone loves someone")
    • Complex quantitative relationships
    • Temporal or modal logic

${"-".repeat(60)}

CHAPTER 3 — GEORGE BOOLE (1854): ALGEBRAIZATION OF LOGIC
═════════════════════════════════════════════════════════

▶ KEY CONTRIBUTION

  George Boole transformed logic into algebra by asking: Can human reasoning
  be expressed mathematically? In Laws of Thought (1854), he introduced Boolean
  Algebra, treating logical statements as algebraic variables and converting
  logical operations into algebraic operations.

▶ SYMBOLIC REPRESENTATION OF THE LAWS OF LOGIC

  The fundamental laws of thought could now be expressed symbolically:

    • Identity: A = A
    • Non-Contradiction: ¬(A ∧ ¬A)
    • Excluded Middle: A ∨ ¬A

  Where AND (∧), OR (∨), and NOT (¬) became algebraic operations, enabling
  logic to be manipulated as algebra rather than purely as philosophical reasoning.

${"-".repeat(60)}

CHAPTER 4 — PROPOSITIONAL AND PREDICATE LOGIC
═════════════════════════════════════════════════════════════

▶ PROPOSITIONAL CALCULUS (SENTENTIAL LOGIC)

  Propositional Calculus is a formal system for reasoning about truth values
  of propositions and their combinations using logical connectives.

  Atomic Propositions: Simple declarative statements with definite truth values
  (True or False). Examples: "It is raining", "2 + 2 = 4"

  Compound Propositions: Built using logical connectives from atomic propositions.

▶ LOGICAL OPERATORS

  ┌──────────┬────────┬─────────────────────────────────────────┐
  │ Operator │ Symbol │ Meaning                                 │
  ├──────────┼────────┼─────────────────────────────────────────┤
  │ NOT      │ ¬      │ Negation                                │
  │ AND      │ ∧      │ Conjunction                             │
  │ OR       │ ∨      │ Disjunction                             │
  │ IMPLIES  │ →      │ Conditional (If...then)                 │
  │ IFF      │ ↔      │ Biconditional (If and only if)          │
  └──────────┴────────┴─────────────────────────────────────────┘

▶ TRUTH TABLES

  Truth tables define the output of logical operations for all possible input
  combinations:

  AND (∧) Truth Table:
    A | B | A ∧ B
    --|---|------
    T | T |   T
    T | F |   F
    F | T |   F
    F | F |   F

  OR (∨) Truth Table:
    A | B | A ∨ B
    --|---|------
    T | T |   T
    T | F |   T
    F | T |   T
    F | F |   F

  IMPLIES (→) Truth Table:
    A | B | A → B
    --|---|------
    T | T |   T
    T | F |   F
    F | T |   T
    F | F |   T

  Key Insight: A → B is only false when A is true and B is false.

▶ PREDICATE LOGIC (FIRST-ORDER LOGIC)

  Predicate logic extends propositional logic by introducing:
    • Variables (x, y, z)
    • Predicates (properties or relations)
    • Quantifiers (∀ for "for all", ∃ for "there exists")

  Examples:
    • ∀x (Human(x) → Mortal(x))
      "For all x, if x is human, then x is mortal"
    
    • ∃x (Prime(x) ∧ Even(x))
      "There exists an x such that x is prime and x is even"
      (This is true: x = 2)

${"-".repeat(60)}

CHAPTER 5 — ALGORITHM ANALYSIS AND COMPLEXITY
═════════════════════════════════════════════════════════════

▶ TIME COMPLEXITY

  Time complexity measures how the runtime of an algorithm scales with input size.

  Common Complexity Classes:
    • O(1)       - Constant time
    • O(log n)   - Logarithmic time (e.g., Binary Search)
    • O(n)       - Linear time (e.g., Linear Search)
    • O(n log n) - Linearithmic time (e.g., Merge Sort, Quick Sort average)
    • O(n²)      - Quadratic time (e.g., Bubble Sort, Selection Sort)
    • O(2ⁿ)      - Exponential time (e.g., Recursive Fibonacci)

▶ SPACE COMPLEXITY

  Space complexity measures the amount of memory an algorithm uses relative
  to input size.

  Example: Recursive vs Iterative Fibonacci
    • Recursive: O(n) space due to call stack
    • Iterative: O(1) space using only variables

▶ MASTER THEOREM

  For recurrence relations of the form:
    T(n) = aT(n/b) + f(n)

  Where:
    • a = number of subproblems
    • n/b = size of each subproblem
    • f(n) = cost of dividing and combining

  The Master Theorem provides the solution based on comparing f(n) with n^(log_b(a)).

${"-".repeat(60)}

CHAPTER 6 — SORTING ALGORITHMS
═════════════════════════════════════════════════════════════

▶ BUBBLE SORT

  Concept: Repeatedly swap adjacent elements if they are in wrong order.
  
  Time Complexity:
    • Best: O(n) - already sorted
    • Average: O(n²)
    • Worst: O(n²)
  
  Space: O(1)
  Stable: Yes

▶ MERGE SORT

  Concept: Divide array into halves, recursively sort, then merge.
  
  Time Complexity: O(n log n) in all cases
  Space: O(n) - requires auxiliary array
  Stable: Yes

▶ QUICK SORT

  Concept: Choose pivot, partition array, recursively sort partitions.
  
  Time Complexity:
    • Best/Average: O(n log n)
    • Worst: O(n²) - poor pivot selection
  
  Space: O(log n) - recursion stack
  Stable: No (typically)

${"-".repeat(60)}

📌 STUDY TIPS FOR ALGORITHMS
  • Implement each algorithm by hand before coding
  • Trace through examples step-by-step
  • Understand WHY an algorithm works, not just HOW
  • Practice analyzing time/space complexity
  • Compare trade-offs between different approaches
  • Solve problems on LeetCode, HackerRank, or Codeforces

📌 KEY TAKEAWAYS
  • Algorithms have ancient roots across multiple civilizations
  • Formal logic evolved from Aristotle → Boole → Modern computing
  • Understanding complexity helps choose the right algorithm
  • Practice is essential for mastering algorithmic thinking

${"-".repeat(60)}
`;
    }
    
    // Enhanced fallback for other subjects
    return `📚 TEXTBOOK NOTES — ${clean.toUpperCase()}
Subject: ${subject} | Generated: ${today}
${"-".repeat(60)}

CHAPTER 1 — INTRODUCTION & FOUNDATIONAL CONCEPTS
═════════════════════════════════════════════════════════════

▶ OVERVIEW
  This textbook provides a comprehensive introduction to ${subject}, covering
  fundamental principles, key theories, and practical applications. Each chapter
  builds upon previous concepts, creating a structured learning pathway.

▶ KEY TERMS AND DEFINITIONS
  • Master the foundational vocabulary specific to ${subject}
  • Pay attention to bold or italicized terms in each chapter
  • Create flashcards for technical terminology
  • Understand how terms relate to each other conceptually

▶ CORE PRINCIPLES
  • The textbook establishes ${subject} principles from first principles
  • Focus on understanding WHY concepts work, not just memorizing facts
  • Look for cause-and-effect relationships between concepts
  • Identify patterns and recurring themes across chapters

▶ LEARNING APPROACH
  1. Preview: Read chapter introduction and summary first
  2. Active Reading: Take notes, highlight key points, ask questions
  3. Practice: Work through all examples before checking solutions
  4. Review: Summarize each section in your own words
  5. Test: Complete end-of-chapter problems and self-assessments

${"-".repeat(60)}

CHAPTER 2 — FUNDAMENTAL THEORIES AND MODELS
═════════════════════════════════════════════════════════════

▶ THEORETICAL FRAMEWORKS
  • Identify the primary theoretical framework introduced in early chapters
  • Understand the historical development of key theories
  • Compare and contrast competing models where applicable
  • Note the assumptions and limitations of each theory

▶ MATHEMATICAL FOUNDATIONS
  • Write each formula in a dedicated formula sheet
  • Identify all variables and their units
  • Understand the derivation process for key equations
  • Practice applying formulas to various problem types
  • Recognize when to use which formula

▶ CONCEPTUAL MODELS
  • Visual representations help solidify understanding
  • Draw diagrams and flowcharts to map relationships
  • Create concept maps linking related ideas
  • Use analogies to connect abstract concepts to familiar experiences

${"-".repeat(60)}

CHAPTER 3 — APPLICATIONS AND PROBLEM-SOLVING
═════════════════════════════════════════════════════════════

▶ REAL-WORLD APPLICATIONS
  • Real-world examples bridge theory to practice
  • Case studies demonstrate complex interactions
  • Identify patterns across different application scenarios
  • Consider how concepts apply to current events or technologies

▶ PROBLEM-SOLVING STRATEGIES
  1. Understand: Read the problem carefully, identify what's given and what's asked
  2. Plan: Choose appropriate methods, formulas, or approaches
  3. Execute: Show all work, include units, check reasonableness
  4. Verify: Review your solution, check against expected results

▶ WORKED EXAMPLES
  • Study worked examples before attempting problems
  • Cover the solution and try solving independently
  • Compare your approach with the textbook's method
  • Understand alternative solution paths

${"-".repeat(60)}

CHAPTER 4 — ADVANCED TOPICS AND EXTENSIONS
═════════════════════════════════════════════════════════════

▶ BUILDING ON FUNDAMENTALS
  • Advanced chapters assume mastery of earlier material
  • Review prerequisite concepts before tackling new topics
  • Identify how new concepts extend or modify earlier principles
  • Look for synthesis opportunities across chapters

▶ INTERDISCIPLINARY CONNECTIONS
  • Note connections to other fields of study
  • Understand how ${subject} relates to broader contexts
  • Explore applications in research and industry
  • Consider ethical implications where relevant

${"-".repeat(60)}

CHAPTER 5 — SYNTHESIS AND INTEGRATION
═════════════════════════════════════════════════════════════

▶ CONNECTING THE DOTS
  • Create a comprehensive concept map of the entire textbook
  • Identify the "big ideas" that unify different chapters
  • Understand how individual topics contribute to the whole
  • Prepare for cumulative assessments by reviewing connections

▶ COMMON MISTAKES TO AVOID
  • Misreading questions — highlight key verbs (calculate, explain, compare)
  • Skipping units or signs in numerical answers
  • Memorizing without understanding underlying logic
  • Neglecting to show work or explain reasoning
  • Rushing through problems without checking answers

${"-".repeat(60)}

📌 EFFECTIVE STUDY STRATEGIES FOR THIS TEXTBOOK

  ▶ BEFORE READING
    • Preview chapter titles, headings, and summaries
    • Review prerequisite concepts from earlier chapters
    • Set specific learning goals for the session

  ▶ DURING READING
    • Take active notes using Cornell or outline method
    • Highlight sparingly — only truly key information
    • Write questions in margins for unclear concepts
    • Pause after each section to summarize mentally

  ▶ AFTER READING
    • Summarize each section in 2-3 sentences
    • Create flashcards for key terms and formulas
    • Attempt all practice problems
    • Teach concepts to someone else (Feynman Technique)

  ▶ SPACED REPETITION SCHEDULE
    • Review notes 24 hours after initial reading
    • Second review after 1 week
    • Third review after 1 month
    • Final review before exams

  ▶ ACTIVE RECALL TECHNIQUES
    • Close the book and write everything you remember
    • Use flashcards to test yourself regularly
    • Explain concepts out loud without notes
    • Create practice tests and take them under timed conditions

📌 EXAM PREPARATION CHECKLIST
  ☐ Completed all chapter readings
  ☐ Worked through all example problems
  ☐ Attempted all end-of-chapter exercises
  ☐ Created comprehensive study notes
  ☐ Made flashcards for key concepts
  ☐ Reviewed and understood all formulas
  ☐ Identified and addressed weak areas
  ☐ Completed practice exams under timed conditions
  ☐ Formed or joined a study group
  ☐ Visited office hours for clarification

${"-".repeat(60)}
`;
  };

  const startUploadFlow = async (file: globalThis.File, name: string, sizeStr: string) => {
    setUploadState("uploading");
    setProgress(0);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('useOpenAI', 'true'); // Try OpenAI first, will fallback to HuggingFace or template

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 30) {
            clearInterval(uploadInterval);
            return 30;
          }
          return prev + 5;
        });
      }, 200);

      // Call the AI-powered PDF processing API
      console.log('🚀 Uploading PDF to AI processing endpoint...');
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      clearInterval(uploadInterval);
      setProgress(40);
      setUploadState("processing");

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ PDF processing complete:', result);

      // Simulate processing progress
      const processingInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(processingInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Wait for processing animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      clearInterval(processingInterval);
      setProgress(100);

      if (result.success && result.data) {
        const { notes, flashcards, quizQuestions, metadata } = result.data;
        
        const existingUploads = JSON.parse(localStorage.getItem("studyforge_uploads") || "[]");
        const existingNotes = JSON.parse(localStorage.getItem("studyforge_notes") || "[]");
        const id = `note-${Date.now()}`;
        const fileId = `file-${Date.now()}`;
        const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const { subject, color } = detectSubject(name);

        console.log('📝 Saving AI-generated content to localStorage...');
        console.log('Notes word count:', metadata.wordCount);
        console.log('Flashcards:', flashcards.length);
        console.log('Quiz questions:', quizQuestions.length);

        if (uploadMode === "textbook") {
          // Textbook mode: save plain text notes
          const textbookNote = {
            id,
            fileId,
            subject,
            color,
            title: name.replace(/\.pdf$/i, "").replace(/[_-]/g, " "),
            preview: `AI-generated textbook notes — ${subject} — ${metadata.wordCount} words — ${metadata.pages} pages extracted`,
            words: metadata.wordCount,
            date: today,
            htmlContent: "",
            textContent: notes,
            isTextbook: true,
            aiGenerated: true as any,
          };
          const fileEntry = { id: fileId, name, size: sizeStr, date: today, isTextbook: true };
          localStorage.setItem("studyforge_uploads", JSON.stringify([fileEntry, ...existingUploads]));
          localStorage.setItem("studyforge_notes", JSON.stringify([textbookNote, ...existingNotes]));
        } else {
          // Regular PDF mode: save notes, flashcards, and quizzes
          const materials = generateStudyMaterials(name, sizeStr);
          
          // Override with AI-generated content
          materials.note.textContent = notes;
          materials.note.words = metadata.wordCount;
          materials.note.preview = `AI-generated notes — ${subject} — ${metadata.wordCount} words`;
          (materials.note as any).aiGenerated = true;
          
          // Use AI-generated flashcards if available
          if (flashcards && flashcards.length > 0) {
            materials.cards = flashcards.map((card: any, idx: number) => ({
              id: `card-${Date.now()}-${idx}`,
              deckId: materials.deck.id,
              front: card.front,
              back: card.back,
              mastered: false,
            }));
          }
          
          // Use AI-generated quiz questions if available
          if (quizQuestions && quizQuestions.length > 0) {
            materials.questions = quizQuestions.map((q: any, idx: number) => ({
              id: `q-${Date.now()}-${idx}`,
              quizId: materials.quiz.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            }));
          }

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

        console.log('✅ Content saved successfully!');
        setUploadState("success");
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('❌ PDF processing failed:', error);
      alert('Failed to process PDF. Please try again or check console for details.');
      setUploadState("idle");
      setProgress(0);
    }
  };

  // Keep the old mock generation function for fallback
  const startUploadFlowOld = (name: string, sizeStr: string) => {
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
              const generatedNotes = generateTextbookNotes(name);
              const wordCount = generatedNotes.split(/\s+/).filter(w => w.length > 0).length;
              
              console.log('=== TEXTBOOK NOTE GENERATION ===');
              console.log('File name:', name);
              console.log('Generated notes length:', generatedNotes.length);
              console.log('Word count:', wordCount);
              console.log('First 500 chars:', generatedNotes.substring(0, 500));
              
              const textbookNote = {
                id,
                fileId,
                subject,
                color,
                title: name.replace(/\.pdf$/i, "").replace(/[_-]/g, " "),
                preview: `Comprehensive textbook notes — ${subject} — ${wordCount} words — detailed chapters with examples, definitions, and historical context`,
                words: wordCount,
                date: today,
                htmlContent: "", // no HTML
                textContent: generatedNotes, // plain text notes
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
