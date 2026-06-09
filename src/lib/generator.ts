export interface Note {
  id: string;
  fileId: string;
  subject: string;
  color: string;
  title: string;
  preview: string;
  words: number;
  date: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface Deck {
  id: number;
  fileId: string;
  subject: string;
  name: string;
  count: number;
  lastStudied: string;
  progress: number;
  color: string;
}

export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
}

export interface Quiz {
  id: number;
  fileId: string;
  title: string;
  difficulty: string;
  questions: number;
  time: string;
  score: number;
  color: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

export function detectSubject(fileName: string) {
  const name = fileName.toLowerCase();
  if (/cell|bio|neuro|gene|plant|animal|dna|life|organism/i.test(name)) {
    return { subject: "Biology", color: "#10B981" };
  }
  if (/chem|atom|molecule|organic|periodic|reaction|acid|base/i.test(name)) {
    return { subject: "Chemistry", color: "#F59E0B" };
  }
  if (/physic|mechanic|quantum|relativity|gravity|thermo|force|motion|energy/i.test(name)) {
    return { subject: "Physics", color: "#3B82F6" };
  }
  if (/math|calc|algebra|geomet|trig|equat|number|statist|theorem/i.test(name)) {
    return { subject: "Mathematics", color: "#EC4899" };
  }
  if (/code|program|comput|js|python|html|css|dev|software|algo|data/i.test(name)) {
    return { subject: "Computer Science", color: "#8B5CF6" };
  }
  return { subject: "General Study", color: "#6366F1" };
}

export function generateStudyMaterials(fileName: string, fileSizeStr: string) {
  const fileId = Math.random().toString(36).substring(2, 9);
  const { subject, color } = detectSubject(fileName);
  
  // Clean file name for titles (remove extension and replace underscores/dashes with spaces)
  const cleanTitle = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Define subject-specific contents
  let notesPreview = "";
  let notesWords = 450;
  let flashcards: Flashcard[] = [];
  let questions: Question[] = [];

  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (subject === "Biology") {
    notesPreview = `This guide covers the fundamental structures of biological organisms. Cell theory states that all living things are composed of cells, the basic unit of life. We explore eukaryotic vs prokaryotic cells, organelle functions (nucleus, mitochondria, ribosomes, endoplasmic reticulum), and cell membrane transport mechanisms (active vs passive transport, diffusion, osmosis). Understanding these processes is essential for cellular homeostasis.`;
    notesWords = 680;
    flashcards = [
      { front: "What is mitosis?", back: "A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus." },
      { front: "What is the function of mitochondria?", back: "Known as the powerhouse of the cell, it generates most of the chemical energy needed to power the cell's biochemical reactions (ATP production)." },
      { front: "Define Eukaryotic Cells.", back: "Cells that contain a nucleus and other membrane-bound organelles, characteristic of all life forms except bacteria and archaea." },
      { front: "What is Active Transport?", back: "The movement of ions or molecules across a cell membrane into a region of higher concentration, assisted by enzymes and requiring energy (ATP)." },
      { front: "What are the base pairs in DNA?", back: "Adenine pairs with Thymine (A-T), and Cytosine pairs with Guanine (C-G)." }
    ];
    questions = [
      {
        id: "q1",
        text: "Which organelle is primarily responsible for protein synthesis in eukaryotic cells?",
        options: [
          { id: "A", text: "Mitochondria" },
          { id: "B", text: "Lysosome" },
          { id: "C", text: "Ribosome" },
          { id: "D", text: "Golgi Apparatus" }
        ],
        correctId: "C",
        explanation: "Ribosomes are molecular machines that facilitate the translation of genetic code into polypeptide chains (proteins)."
      },
      {
        id: "q2",
        text: "Which phase of mitosis involves the alignment of chromosomes along the equator of the cell?",
        options: [
          { id: "A", text: "Prophase" },
          { id: "B", text: "Metaphase" },
          { id: "C", text: "Anaphase" },
          { id: "D", text: "Telophase" }
        ],
        correctId: "B",
        explanation: "During metaphase, spindle fibers attach to kinetochores and align chromosomes along the metaphase plate in the center of the cell."
      },
      {
        id: "q3",
        text: "Osmosis is best described as the movement of what substance across a semi-permeable membrane?",
        options: [
          { id: "A", text: "Sodium ions" },
          { id: "B", text: "Water" },
          { id: "C", text: "Glucose" },
          { id: "D", text: "Proteins" }
        ],
        correctId: "B",
        explanation: "Osmosis is specifically the passive diffusion of water molecules from a region of low solute concentration to high solute concentration."
      }
    ];
  } else if (subject === "Chemistry") {
    notesPreview = `A comprehensive overview of atomic structures, chemical bonds, and periodic trends. This document details ionic, covalent, and metallic bonding models, including Lewis dot structures, VSEPR theory for molecular geometry, and electronegativity differences. It also outlines key thermodynamics concepts, stoichiometry calculations, and the behavior of acids and bases in chemical equilibrium.`;
    notesWords = 840;
    flashcards = [
      { front: "What is an Ionic Bond?", back: "A chemical bond formed through the electrostatic attraction between oppositely charged ions, usually a metal and a nonmetal." },
      { front: "State Avogadro's Number.", back: "6.022 × 10^23 particles per mole, which represents the number of molecules/atoms in one mole of a substance." },
      { front: "What is an exothermic reaction?", back: "A chemical reaction that releases energy, usually in the form of heat or light, to its surroundings (ΔH is negative)." },
      { front: "Define Bronsted-Lowry acid.", back: "A substance that can donate a proton (hydrogen ion, H+) to another substance." },
      { front: "What is the pH of a neutral solution at 25°C?", back: "The pH is 7.0." }
    ];
    questions = [
      {
        id: "q1",
        text: "Which type of chemical bond involves the equal sharing of electron pairs between atoms?",
        options: [
          { id: "A", text: "Ionic Bond" },
          { id: "B", text: "Nonpolar Covalent Bond" },
          { id: "C", text: "Polar Covalent Bond" },
          { id: "D", text: "Metallic Bond" }
        ],
        correctId: "B",
        explanation: "Nonpolar covalent bonds occur when the electronegativity difference between two bonded atoms is very small or zero, resulting in equal sharing of electrons."
      },
      {
        id: "q2",
        text: "What is the term for a substance that speeds up a chemical reaction without being consumed?",
        options: [
          { id: "A", text: "Reactant" },
          { id: "B", text: "Solvent" },
          { id: "C", text: "Catalyst" },
          { id: "D", text: "Inhibitor" }
        ],
        correctId: "C",
        explanation: "A catalyst provides an alternative pathway with lower activation energy for the reaction to occur, increasing the rate of reaction."
      },
      {
        id: "q3",
        text: "Which of the following describes a solution with a pH of 3?",
        options: [
          { id: "A", text: "Strongly Alkaline" },
          { id: "B", text: "Weakly Alkaline" },
          { id: "C", text: "Neutral" },
          { id: "D", text: "Acidic" }
        ],
        correctId: "D",
        explanation: "A pH scale ranges from 0 to 14. Solutions with a pH less than 7 are acidic, while those above 7 are basic/alkaline."
      }
    ];
  } else if (subject === "Physics") {
    notesPreview = `Analysis of Newtonian mechanics, forces, and conservation laws. This module studies kinematics equations, Newton's three laws of motion, work-energy theorem, and momentum conservation in collisions. Additionally, it introduces basic concepts of wave optics, electromagnetism (Coulomb's Law, electric fields), and thermodynamic cycles that govern modern physical engineering systems.`;
    notesWords = 720;
    flashcards = [
      { front: "State Newton's Second Law.", back: "F = ma (Force equals mass times acceleration), meaning the acceleration of an object is dependent on the net force and its mass." },
      { front: "What is the speed of light in a vacuum?", back: "Approximately 3.00 × 10^8 meters per second (c)." },
      { front: "What is Gravitational Potential Energy?", back: "The energy stored in an object due to its position in a gravitational field, calculated as PE = mgh." },
      { front: "Define Ohm's Law.", back: "V = IR, stating that the voltage across a conductor is directly proportional to the current flowing through it." },
      { front: "What is a photon?", back: "A quantum of electromagnetic radiation, representing the basic unit of light." }
    ];
    questions = [
      {
        id: "q1",
        text: "What is the SI unit of force?",
        options: [
          { id: "A", text: "Joule" },
          { id: "B", text: "Watt" },
          { id: "C", text: "Newton" },
          { id: "D", text: "Pascal" }
        ],
        correctId: "C",
        explanation: "One Newton (N) is defined as the force needed to accelerate 1 kilogram of mass at the rate of 1 meter per second squared."
      },
      {
        id: "q2",
        text: "If an object is in free fall near the Earth's surface and air resistance is neglected, what is its acceleration?",
        options: [
          { id: "A", text: "9.8 m/s²" },
          { id: "B", text: "0 m/s²" },
          { id: "C", text: "98 m/s²" },
          { id: "D", text: "Variable depending on weight" }
        ],
        correctId: "A",
        explanation: "The acceleration due to gravity (g) is constant for all falling bodies near Earth's surface, approximately 9.8 m/s²."
      },
      {
        id: "q3",
        text: "Which law states that energy cannot be created or destroyed, only transformed?",
        options: [
          { id: "A", text: "Newton's First Law" },
          { id: "B", text: "Law of Universal Gravitation" },
          { id: "C", text: "Law of Conservation of Energy" },
          { id: "D", text: "Second Law of Thermodynamics" }
        ],
        correctId: "C",
        explanation: "The Law of Conservation of Energy (First Law of Thermodynamics) states that the total energy of an isolated system remains constant."
      }
    ];
  } else if (subject === "Mathematics") {
    notesPreview = `This math study guide covers essential topics in calculus, linear algebra, and coordinate geometry. It provides rigorous derivations of limits, continuity, derivative rules (product rule, chain rule), and integration techniques. Matrix calculations, determinants, systems of linear equations, and vector spaces are also analyzed to build strong problem-solving skills.`;
    notesWords = 580;
    flashcards = [
      { front: "What is the derivative of x^n?", back: "nx^(n-1) (The Power Rule)." },
      { front: "Pythagorean Theorem formula", back: "a^2 + b^2 = c^2, where c is the hypotenuse of a right-angled triangle." },
      { front: "What is a derivative?", back: "The rate of change of a function with respect to a variable, geometrically representing the slope of the tangent line." },
      { front: "What is Euler's Number (e)?", back: "An irrational mathematical constant approximately equal to 2.71828, forming the base of natural logarithms." },
      { front: "Define prime number.", back: "A natural number greater than 1 that cannot be formed by multiplying two smaller natural numbers." }
    ];
    questions = [
      {
        id: "q1",
        text: "What is the derivative of the function f(x) = 3x² + 5x - 7 with respect to x?",
        options: [
          { id: "A", text: "3x + 5" },
          { id: "B", text: "6x + 5" },
          { id: "C", text: "6x - 7" },
          { id: "D", text: "3x² + 5" }
        ],
        correctId: "B",
        explanation: "Applying the power rule: d/dx(3x²) = 6x, d/dx(5x) = 5, and d/dx(-7) = 0. Adding these together yields 6x + 5."
      },
      {
        id: "q2",
        text: "Which of the following is the value of log₁₀(1000)?",
        options: [
          { id: "A", text: "2" },
          { id: "B", text: "3" },
          { id: "C", text: "4" },
          { id: "D", text: "10" }
        ],
        correctId: "B",
        explanation: "Logarithms ask the question '10 to what power equals 1000?'. Since 10³ = 1000, log₁₀(1000) = 3."
      },
      {
        id: "q3",
        text: "In a right-angled triangle, if the sides adjacent to the right angle are 3 and 4, what is the length of the hypotenuse?",
        options: [
          { id: "A", text: "5" },
          { id: "B", text: "6" },
          { id: "C", text: "7" },
          { id: "D", text: "25" }
        ],
        correctId: "A",
        explanation: "Using the Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25. Therefore, c = √25 = 5."
      }
    ];
  } else if (subject === "Computer Science") {
    notesPreview = `A deep dive into algorithms, data structures, and computer organization. We analyze Big O time complexity for common sorting (QuickSort, MergeSort) and search algorithms, abstract data types (stacks, queues, linked lists, binary trees), and object-oriented programming methodologies. We also cover core principles of database normalization and client-server network architectures.`;
    notesWords = 950;
    flashcards = [
      { front: "What is the time complexity of Binary Search?", back: "O(log n) logarithmic time complexity, requiring the list to be sorted first." },
      { front: "Define Stack data structure.", back: "A linear data structure that follows the Last-In-First-Out (LIFO) principle, where insertions and deletions happen at the same end." },
      { front: "What is Encapsulation?", back: "An OOP concept that bundles data and methods operating on that data inside a single unit (class), hiding internal representation." },
      { front: "What does HTML stand for?", back: "HyperText Markup Language, the standard markup language for creating web pages." },
      { front: "What is a primary key?", back: "A unique identifier for a database record, ensuring that no two rows in a database table share the same key value." }
    ];
    questions = [
      {
        id: "q1",
        text: "Which of the following data structures operates on a First-In, First-Out (FIFO) basis?",
        options: [
          { id: "A", text: "Stack" },
          { id: "B", text: "Queue" },
          { id: "C", text: "Binary Tree" },
          { id: "D", text: "Graph" }
        ],
        correctId: "B",
        explanation: "A Queue is a FIFO data structure where elements are added at the rear (enqueue) and removed from the front (dequeue)."
      },
      {
        id: "q2",
        text: "What is the average time complexity of the QuickSort algorithm?",
        options: [
          { id: "A", text: "O(n)" },
          { id: "B", text: "O(n log n)" },
          { id: "C", text: "O(n²)" },
          { id: "D", text: "O(log n)" }
        ],
        correctId: "B",
        explanation: "QuickSort uses a divide-and-conquer approach. On average, it divides the array in half, leading to O(n log n) comparisons."
      },
      {
        id: "q3",
        text: "What does HTTP stand for in web technology?",
        options: [
          { id: "A", text: "Hypertext Transfer Protocol" },
          { id: "B", text: "Hyperlink Text Translation Processor" },
          { id: "C", text: "High Transfer Technology Protocol" },
          { id: "D", text: "Home Text Transfer Program" }
        ],
        correctId: "A",
        explanation: "HTTP stands for Hypertext Transfer Protocol, which is the foundational protocol used for transmitting data over the World Wide Web."
      }
    ];
  } else {
    // General Study
    notesPreview = `This guide provides an academic framework for critical analysis, research methodology, and effective learning techniques. Key topics include formulating structured research questions, evaluating primary and secondary sources, synthesizing conflicting evidence, and mastering active recall. These study skills are universally applicable across scientific, artistic, and humanities disciplines.`;
    notesWords = 510;
    flashcards = [
      { front: "What is a Primary Source?", back: "An original document, artifact, diary, manuscript, or other source of information that was created at the time under study." },
      { front: "Define Active Recall.", back: "A study technique where you stimulate your memory during the learning process, retrieving information dynamically rather than passively reading." },
      { front: "What is a Hypothesis?", back: "A tentative, testable explanation for a phenomenon, which serves as the starting point for further investigation." },
      { front: "Spaced Repetition definition", back: "An learning technique where reviews are spaced out at increasing intervals, exploiting the psychological spacing effect." },
      { front: "What is cognitive load?", back: "The total amount of mental effort being used in the working memory during learning or problem solving." }
    ];
    questions = [
      {
        id: "q1",
        text: "Which of the following is considered a primary source for historical research?",
        options: [
          { id: "A", text: "A biography written in 2010" },
          { id: "B", text: "A textbook chapter about World War II" },
          { id: "C", text: "A letter written by a soldier during the Civil War" },
          { id: "D", text: "An encyclopedia article" }
        ],
        correctId: "C",
        explanation: "A letter written during the event is a first-hand, contemporaneous account, making it a primary source. The others are secondary analyses."
      },
      {
        id: "q2",
        text: "Which study method has been shown to result in the highest long-term retention of information?",
        options: [
          { id: "A", text: "Passive re-reading of textbook pages" },
          { id: "B", text: "Highlighting key sentences in color" },
          { id: "C", text: "Self-testing via active recall" },
          { id: "D", text: "Listening to lecture recordings passively" }
        ],
        correctId: "C",
        explanation: "Self-testing triggers retrieval practice, forcing the brain to reconstruct neural connections, which drastically increases long-term retention compared to passive methods."
      },
      {
        id: "q3",
        text: "What is the primary purpose of a literature review in a research paper?",
        options: [
          { id: "A", text: "To express the author's personal opinions on a topic" },
          { id: "B", text: "To survey existing scholarly works and identify gaps in the current research" },
          { id: "C", text: "To list all books checked out from the library" },
          { id: "D", text: "To describe the author's experiment setup in detail" }
        ],
        correctId: "B",
        explanation: "A literature review contextually positions the research within the wider academic field by reviewing what is already known and explaining what the new paper adds."
      }
    ];
  }

  // Generate finalized objects
  const noteId = Math.random().toString(36).substring(2, 9);
  const note: Note = {
    id: noteId,
    fileId,
    subject,
    color,
    title: `${cleanTitle} Study Notes`,
    preview: notesPreview,
    words: notesWords,
    date: dateStr
  };

  const deckId = Math.floor(Math.random() * 10000);
  const deck: Deck = {
    id: deckId,
    fileId,
    subject,
    name: `${cleanTitle} Flashcards`,
    count: flashcards.length,
    lastStudied: "Not studied yet",
    progress: 0,
    color
  };

  const formattedCards = flashcards.map(card => ({
    ...card,
    deckId
  }));

  const quizId = Math.floor(Math.random() * 10000);
  const quiz: Quiz = {
    id: quizId,
    fileId,
    title: `${cleanTitle} Quick Quiz`,
    difficulty: "Medium",
    questions: questions.length,
    time: `${questions.length * 5} mins`,
    score: 0,
    color
  };

  const formattedQuestions = questions.map(q => ({
    ...q,
    quizId
  }));

  const file: UploadedFile = {
    id: fileId,
    name: fileName,
    size: fileSizeStr,
    date: dateStr
  };

  return {
    file,
    note,
    deck,
    cards: formattedCards,
    quiz,
    questions: formattedQuestions
  };
}

export function populateDefaultData() {
  if (typeof window === "undefined") return;

  const currentUploads = localStorage.getItem("studyforge_uploads");
  if (!currentUploads || JSON.parse(currentUploads).length === 0) {
    const materials = generateStudyMaterials("Machine_Learning_Intro.pdf", "4.2 MB");
    
    localStorage.setItem("studyforge_uploads", JSON.stringify([materials.file]));
    localStorage.setItem("studyforge_notes", JSON.stringify([materials.note]));
    localStorage.setItem("studyforge_flashcards_decks", JSON.stringify([materials.deck]));
    localStorage.setItem("studyforge_flashcards_cards", JSON.stringify(materials.cards));
    localStorage.setItem("studyforge_quizzes", JSON.stringify([materials.quiz]));
    localStorage.setItem("studyforge_questions", JSON.stringify(materials.questions));
  }
}
