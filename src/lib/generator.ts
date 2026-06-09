export interface Note {
  id: string;
  fileId: string;
  subject: string;
  color: string;
  title: string;
  preview: string;
  words: number;
  date: string;
  htmlContent: string;
  textContent?: string;
  isTextbook?: boolean;
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

export function generateHtmlContent(cleanTitle: string, subject: string, color: string, dateStr: string): string {
  // Define content pieces based on the subject
  let headingText = cleanTitle;
  let bodyChapters = "";
  let modulesListHtml = "";

  if (subject === "Biology") {
    modulesListHtml = `
      <div class="module-card">
        <div class="module-num">MODULE_01 /</div>
        <h3>Cell Biology Fundamentals</h3>
        <p>Cell theory, prokaryotes vs eukaryotes, organelle structures, and cellular dynamics.</p>
        <span class="module-badge badge-sky">3 Chapters</span>
      </div>
      <div class="module-card">
        <div class="module-num">MODULE_02 /</div>
        <h3>Cell Transport & Homeostasis</h3>
        <p>Passive transport, active transport, and mitosis cell division.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
    `;

    bodyChapters = `
      <!-- CH 1 -->
      <div class="chapter" id="ch1">
        <div class="chapter-header">
          <span class="chapter-tag">CH_01</span>
          <h3>Cell Theory & Classifications</h3>
        </div>
        <div class="prose">
          <p>Cell theory is one of the unifying principles of Biology. It asserts that all living organisms are composed of one or more cells, the cell is the basic unit of life, and all cells arise from pre-existing cells. We classify cells into two major domains: <strong>Prokaryotes</strong> and <strong>Eukaryotes</strong>.</p>
          
          <div class="callout">
            <div class="callout-label">Definition</div>
            <p><strong>Cellular Organisms</strong> are characterized by having a membrane-bound barrier, a metabolic framework, and genetic material stored in DNA for self-replication.</p>
          </div>

          <h4>Key Structural Differences</h4>
          <table class="trait-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Prokaryotes (e.g. Bacteria)</th>
                <th>Eukaryotes (e.g. Plant/Animal)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nucleus</td>
                <td>Absent (nucleoid region)</td>
                <td>Present (double-membrane bound)</td>
              </tr>
              <tr>
                <td>Organelles</td>
                <td>No membrane-bound organelles</td>
                <td>Mitochondria, ER, Golgi, etc. present</td>
              </tr>
              <tr>
                <td>DNA Structure</td>
                <td>Circular, naked DNA in cytoplasm</td>
                <td>Linear, associated with histones in nucleus</td>
              </tr>
            </tbody>
          </table>

          <div class="analogy">
            <div class="analogy-label">Analogy — Studio Apartment vs. Multi-room Mansion</div>
            <p>A prokaryotic cell is like a studio apartment: a single open room where everything (cooking, sleeping, working) happens in the same space. A eukaryotic cell is a mansion: separate rooms (organelles) specialized for specific tasks like energy production (kitchen/mitochondria) and storage (closet/nucleus).</p>
          </div>
        </div>
      </div>

      <!-- CH 2 -->
      <div class="chapter" id="ch2">
        <div class="chapter-header">
          <span class="chapter-tag">CH_02</span>
          <h3>Organelle Functions</h3>
        </div>
        <div class="prose">
          <p>Eukaryotic cells are filled with membrane-bound organelles that partition metabolic processes. This compartmentalization optimizes efficiency and allows contrasting reactions to occur simultaneously.</p>
          
          <div class="concept-grid">
            <div class="concept-cell">
              <span class="concept-icon">🧬</span>
              <h5>Nucleus</h5>
              <p>Stores linear DNA genome and acts as the transcription command center.</p>
            </div>
            <div class="concept-cell">
              <span class="concept-icon">⚡</span>
              <h5>Mitochondria</h5>
              <p>Powerhouse of the cell, carrying out cellular respiration and generating ATP.</p>
            </div>
            <div class="concept-cell">
              <span class="concept-icon">🏗️</span>
              <h5>Ribosomes</h5>
              <p>Non-membrane bound structures responsible for translating mRNA into proteins.</p>
            </div>
          </div>

          <h4>The Protein Pathway</h4>
          <div class="steps-list">
            <div class="step-item">
              <span class="step-num">01</span>
              <div class="step-content">
                <h6>Transcription</h6>
                <p>mRNA is synthesized from DNA inside the nucleus.</p>
              </div>
            </div>
            <div class="step-item">
              <span class="step-num">02</span>
              <div class="step-content">
                <h6>Translation</h6>
                <p>Ribosomes on the Rough Endoplasmic Reticulum (RER) build the polypeptide chain.</p>
              </div>
            </div>
            <div class="step-item">
              <span class="step-num">03</span>
              <div class="step-content">
                <h6>Packaging & Transport</h6>
                <p>The Golgi Apparatus modifies and packages proteins into vesicles for secretion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (subject === "Chemistry") {
    modulesListHtml = `
      <div class="module-card">
        <div class="module-num">MODULE_01 /</div>
        <h3>Atomic Structure & Bonding</h3>
        <p>Quantum models, electronegativity, ionic, covalent, and metallic chemical bonds.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
      <div class="module-card">
        <div class="module-num">MODULE_02 /</div>
        <h3>Reaction Kinetics & Equilibrium</h3>
        <p>Thermodynamics, activation energy, catalysis, and acid-base stoichiometry.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
    `;

    bodyChapters = `
      <div class="chapter" id="ch1">
        <div class="chapter-header">
          <span class="chapter-tag">CH_01</span>
          <h3>Chemical Bonding Models</h3>
        </div>
        <div class="prose">
          <p>Chemical bonding is the physical process responsible for the attractive interactions between atoms and molecules. Atoms bond to achieve a stable outer shell of valence electrons, typically following the octet rule.</p>
          
          <div class="callout">
            <div class="callout-label">Core Principle</div>
            <p><strong>Electronegativity difference (ΔEN)</strong> dictates whether a bond is covalent, polar covalent, or ionic. A high difference leads to electron transfer (ionic), while a low difference leads to sharing (covalent).</p>
          </div>

          <h4>Bond Comparison Table</h4>
          <table class="trait-table">
            <thead>
              <tr>
                <th>Bond Type</th>
                <th>Electron Interaction</th>
                <th>Physical Characteristics</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ionic Bond</td>
                <td>Transfer of valence electrons</td>
                <td>High melting points, crystalline structures, conductive in aqueous state.</td>
              </tr>
              <tr>
                <td>Covalent Bond</td>
                <td>Sharing of electron pairs</td>
                <td>Lower melting points, poor electrical conductivity, distinct molecular geometries.</td>
              </tr>
              <tr>
                <td>Metallic Bond</td>
                <td>Delocalized 'sea of electrons'</td>
                <td>Highly malleable, ductile, excellent thermal and electrical conductivity.</td>
              </tr>
            </tbody>
          </table>

          <div class="analogy">
            <div class="analogy-label">Analogy — Tug-of-war vs. Shared Blanket</div>
            <p>Covalent bonding is like two people sharing a blanket on a cold night—both hold onto it to stay comfortable. Ionic bonding is a game of tug-of-war where one side is so strong they pull the rope completely out of the other's hands, resulting in separate charged ions attracted by gravity.</p>
          </div>
        </div>
      </div>

      <div class="chapter" id="ch2">
        <div class="chapter-header">
          <span class="chapter-tag">CH_02</span>
          <h3>Catalysis & Kinetics</h3>
        </div>
        <div class="prose">
          <p>Chemical kinetics studies the rates of reactions and the factors affecting them. Reaction rates can be mathematically accelerated using catalysts, which lower the required activation energy barriers.</p>

          <div class="code-block">
            <div class="code-block-header">
              <div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div>
              <div class="code-block-label">reaction-kinetics.pseudo — Reaction Threshold</div>
            </div>
            <pre><span class="cm">// Catalysts lower activation energy (Ea) to increase rate constant (k)</span>
<span class="kw">function</span> <span class="fn">canReact</span>(collisionEnergy, isCatalyzed) {
  <span class="kw">const</span> <span class="nm">Ea</span> = isCatalyzed ? <span class="nm">50.0</span> : <span class="nm">120.0</span>; <span class="cm">// Catalyst lowers barrier</span>
  <span class="kw">return</span> collisionEnergy >= <span class="nm">Ea</span>;
}</pre>
          </div>
        </div>
      </div>
    `;
  } else if (subject === "Physics") {
    modulesListHtml = `
      <div class="module-card">
        <div class="module-num">MODULE_01 /</div>
        <h3>Classical Mechanics</h3>
        <p>Newtonian dynamics, kinematics equations, and energy conservation laws.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
      <div class="module-card">
        <div class="module-num">MODULE_02 /</div>
        <h3>Electromagnetism</h3>
        <p>Coulomb's law, electric potentials, magnetic induction, and Ohm's law.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
    `;

    bodyChapters = `
      <div class="chapter" id="ch1">
        <div class="chapter-header">
          <span class="chapter-tag">CH_01</span>
          <h3>Newtonian Mechanics</h3>
        </div>
        <div class="prose">
          <p>Mechanics deals with the behavior of physical bodies when subjected to forces or displacements, and the subsequent effects of the bodies on their environment.</p>

          <div class="callout">
            <div class="callout-label">Newton's Laws</div>
            <p><strong>First Law:</strong> Inertia—bodies remain at rest or constant velocity unless acted on by external force.<br>
            <strong>Second Law:</strong> Acceleration is proportional to net force and inversely proportional to mass (F = ma).<br>
            <strong>Third Law:</strong> Action-Reaction—every force triggers an equal and opposite force.</p>
          </div>

          <div class="code-block">
            <div class="code-block-header">
              <div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div>
              <div class="code-block-label">dynamics.pseudo — Calculate Force</div>
            </div>
            <pre><span class="cm">// Calculates force required for acceleration (F = m * a)</span>
<span class="kw">function</span> <span class="fn">getRequiredForce</span>(massKg, accelerationMss) {
  <span class="kw">return</span> massKg * accelerationMss; <span class="cm">// returns Force in Newtons</span>
}</pre>
          </div>

          <div class="analogy">
            <div class="analogy-label">Analogy — Inertia of a Rolling Bowling Ball</div>
            <p>A rolling bowling ball is hard to stop compared to a tennis ball rolling at the same speed. This is because the bowling ball has much greater mass, and thus higher inertia—it strongly resists any changes to its current state of motion, as described in Newton's First Law.</p>
          </div>
        </div>
      </div>
    `;
  } else if (subject === "Mathematics") {
    modulesListHtml = `
      <div class="module-card">
        <div class="module-num">MODULE_01 /</div>
        <h3>Differential Calculus</h3>
        <p>Limits, continuity, derivative definitions, and calculation rules.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
      <div class="module-card">
        <div class="module-num">MODULE_02 /</div>
        <h3>Linear Algebra & Systems</h3>
        <p>Matrices, vector operations, determinants, and linear transformations.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
    `;

    bodyChapters = `
      <div class="chapter" id="ch1">
        <div class="chapter-header">
          <span class="chapter-tag">CH_01</span>
          <h3>The Derivative & Power Rule</h3>
        </div>
        <div class="prose">
          <p>Calculus focuses on change. The derivative measures the instantaneous rate of change of a function with respect to one of its variables.</p>
          
          <div class="callout">
            <div class="callout-label">Definition</div>
            <p>The derivative of a function <strong>f(x)</strong> at a point is geometrically defined as the <strong>slope of the tangent line</strong> to the curve of f(x) at that point.</p>
          </div>

          <div class="code-block">
            <div class="code-block-header">
              <div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div>
              <div class="code-block-label">power-rule.pseudo — Derivative Calculation</div>
            </div>
            <pre><span class="cm">// Calculates the power rule derivative for f(x) = x^n</span>
<span class="kw">function</span> <span class="fn">derivePowerTerm</span>(coefficient, exponent) {
  <span class="kw">const</span> <span class="nm">newCoeff</span> = coefficient * exponent;
  <span class="kw">const</span> <span class="nm">newExp</span>   = exponent - <span class="nm">1</span>;
  <span class="kw">return</span> <span class="st">\`\${newCoeff}x^\${newExp}\`</span>;
}</pre>
          </div>
        </div>
      </div>
    `;
  } else if (subject === "Computer Science") {
    modulesListHtml = `
      <div class="module-card">
        <div class="module-num">MODULE_01 /</div>
        <h3>Algorithms & Data Structures</h3>
        <p>Time complexity, searching/sorting, stacks, queues, trees, and linked lists.</p>
        <span class="module-badge badge-sky">3 Chapters</span>
      </div>
      <div class="module-card">
        <div class="module-num">MODULE_02 /</div>
        <h3>Software Architectures & Networks</h3>
        <p>Object-Oriented Programming (OOP) paradigms, RESTful APIs, and TCP/IP protocol stack.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
    `;

    bodyChapters = `
      <div class="chapter" id="ch1">
        <div class="chapter-header">
          <span class="chapter-tag">CH_01</span>
          <h3>Data Structures: Stacks vs. Queues</h3>
        </div>
        <div class="prose">
          <p>Data structures organize and store data efficiently in memory. Two of the most fundamental linear structures are <strong>Stacks</strong> and <strong>Queues</strong>.</p>
          
          <table class="trait-table">
            <thead>
              <tr>
                <th>Data Structure</th>
                <th>Operation Pattern</th>
                <th>Core Methods</th>
                <th>Example Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Stack</td>
                <td>Last-In, First-Out (LIFO)</td>
                <td>Push, Pop, Peek</td>
                <td>Undo operations in text editors, call stack tracking in compilers.</td>
              </tr>
              <tr>
                <td>Queue</td>
                <td>First-In, First-Out (FIFO)</td>
                <td>Enqueue, Dequeue</td>
                <td>Print job spooling, handling incoming request queues in web servers.</td>
              </tr>
            </tbody>
          </table>

          <div class="analogy">
            <div class="analogy-label">Analogy — Cafeteria Trays vs. Checkout Line</div>
            <p>A Stack is like a stack of cafeteria trays—the tray placed last on top is the first one picked up by a customer. A Queue is like a checkout line at a store—the person who enters the line first is the first one served and leaves first.</p>
          </div>
        </div>
      </div>

      <div class="chapter" id="ch2">
        <div class="chapter-header">
          <span class="chapter-tag">CH_02</span>
          <h3>Sorting Complexities</h3>
        </div>
        <div class="prose">
          <p>Algorithm efficiency is measured using Big O notation, which describes performance scaling with input size.</p>

          <div class="code-block">
            <div class="code-block-header">
              <div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div>
              <div class="code-block-label">sorting-complexity.pseudo — Sort Comparison</div>
            </div>
            <pre><span class="cm">// Big O Time Complexities for sorting algorithms</span>
<span class="kw">const</span> <span class="nm">algorithms</span> = {
  <span class="nm">QuickSort</span>: <span class="st">"Best/Avg: O(n log n) | Worst: O(n²)"</span>,
  <span class="nm">MergeSort</span>: <span class="st">"Best/Avg/Worst: O(n log n)"</span>,
  <span class="nm">BubbleSort</span>: <span class="st">"Best: O(n) | Avg/Worst: O(n²)"</span>
};</pre>
          </div>
        </div>
      </div>
    `;
  } else {
    modulesListHtml = `
      <div class="module-card">
        <div class="module-num">MODULE_01 /</div>
        <h3>Active Learning Methodologies</h3>
        <p>Scientific memory retention techniques, spaced repetition, and cognitive load management.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
      <div class="module-card">
        <div class="module-num">MODULE_02 /</div>
        <h3>Research & Source Evaluation</h3>
        <p>Evaluating primary vs secondary source documents and critical structured writing.</p>
        <span class="module-badge badge-sky">2 Chapters</span>
      </div>
    `;

    bodyChapters = `
      <div class="chapter" id="ch1">
        <div class="chapter-header">
          <span class="chapter-tag">CH_01</span>
          <h3>Active Recall & Spaced Repetition</h3>
        </div>
        <div class="prose">
          <p>Traditional study methods like passive re-reading yield poor retention. Modern cognitive science points to <strong>Active Recall</strong> and <strong>Spaced Repetition</strong> as the gold standard for learning.</p>
          
          <div class="callout">
            <div class="callout-label">Core Concept</div>
            <p><strong>Active Recall</strong> involves testing your brain to retrieve information rather than passively reviewing notes. This forces the brain to rebuild and strengthen neural pathways.</p>
          </div>

          <div class="analogy">
            <div class="analogy-label">Analogy — Re-reading a map vs. Driving without a map</div>
            <p>Passive reading is like staring at a map: it feels easy, but you don't learn the route. Active recall is like driving the route yourself without looking at the map—you might make mistakes, but your brain figures out the turns, creating long-term spatial memory.</p>
          </div>
        </div>
      </div>
    `;
  }

  // Inject full standalone HTML matching index (7).html CSS
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${headingText}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#06090F;
  --surface:#0D1421;
  --surface2:#111B2E;
  --border:#162035;
  --border-bright:#1E2F4A;
  --sky:#00C2FF;
  --sky-dim:#009FD4;
  --sky-glow:rgba(0,194,255,0.15);
  --sky-glow2:rgba(0,194,255,0.07);
  --sky-text:#00E5FF;
  --white:#FFFFFF;
  --text:#D8E8F5;
  --text-muted:#7A9AB8;
  --text-dim:#3E5570;
  --accent:#0077FF;
  --accent2:#00FFD4;
  --gold:#F0C040;
  --teal:#00E5C0;
}

html{scroll-behavior:smooth;font-size:16px}

body{
  background-color:var(--bg);
  color:var(--text);
  font-family:'Space Grotesk',sans-serif;
  line-height:1.7;
  min-height:100vh;
  background-image:
    linear-gradient(rgba(0,194,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,194,255,0.03) 1px, transparent 1px);
  background-size:40px 40px;
}

nav{
  position:sticky;top:0;z-index:100;
  background:rgba(6,9,15,0.94);
  backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border-bright);
  padding:0 2rem;
  display:flex;align-items:center;justify-content:space-between;
  height:56px;
}

.nav-logo{
  display:flex;align-items:center;gap:10px;
  font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--text-muted);
}
.nav-logo span{color:var(--sky)}

.nav-links{display:flex;gap:4px;list-style:none}
.nav-links a{
  display:block;padding:6px 14px;font-size:13px;font-weight:500;letter-spacing:0.04em;
  color:var(--text-muted);text-decoration:none;border-radius:3px;border:1px solid transparent;
  transition:all 0.18s;
}
.nav-links a:hover{color:var(--text);border-color:var(--border-bright);background:var(--surface)}
.nav-links a.active{color:var(--sky);border-color:var(--sky-glow);background:var(--sky-glow2)}

.hero{
  position:relative;overflow:hidden;
  padding:6rem 2rem 5rem;text-align:center;
  border-bottom:1px solid var(--border);
}
.hero::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,194,255,0.09) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 80% 100%, rgba(0,119,255,0.06) 0%, transparent 60%);
  pointer-events:none;
}

.hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;
  color:var(--sky);background:var(--sky-glow2);
  border:1px solid var(--sky-glow);padding:5px 14px;border-radius:2px;margin-bottom:1.5rem;
}
.hero-eyebrow::before{
  content:'';width:6px;height:6px;background:var(--sky);border-radius:50%;
  animation:pulse 2s infinite;
}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.75)}}

.hero h1{
  font-size:clamp(2rem,5vw,3.6rem);font-weight:700;
  line-height:1.15;letter-spacing:-0.02em;margin-bottom:0.5rem;color:var(--white);
}
.hero h1 em{font-style:normal;color:var(--sky)}

.hero-subtitle{
  font-family:'Crimson Pro',serif;font-size:1.25rem;font-weight:300;font-style:italic;
  color:var(--text-muted);margin-bottom:1.5rem;
}
.hero-meta{display:flex;justify-content:center;gap:2rem;flex-wrap:wrap}
.hero-meta-item{font-size:12px;color:var(--text-dim);letter-spacing:0.06em}
.hero-meta-item strong{display:block;font-size:13px;font-weight:600;color:var(--text-muted);letter-spacing:0.02em}

.section-label{
  display:flex;align-items:center;gap:1rem;padding:2.5rem 2rem 1rem;
}
.section-label h2{
  font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-dim);
  white-space:nowrap;
}
.section-label::after{content:'';flex:1;height:1px;background:var(--border)}

.module-grid{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:1px;background:var(--border);
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);
}
.module-card{
  background:var(--bg);padding:2rem;position:relative;overflow:hidden;transition:background 0.2s;
}
.module-card:hover{background:var(--surface2)}
.module-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:var(--border-bright);transition:background 0.2s;
}
.module-card:hover::before{background:var(--sky)}
.module-num{
  font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-dim);
  letter-spacing:0.1em;margin-bottom:0.75rem;
}
.module-card h3{font-size:1rem;font-weight:600;color:var(--white);margin-bottom:0.5rem;line-height:1.35}
.module-card p{font-size:13px;color:var(--text-muted);line-height:1.6}
.module-badge{
  display:inline-block;margin-top:1.25rem;font-size:11px;font-weight:600;
  letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:2px;
}
.badge-sky{background:var(--sky-glow2);color:var(--sky);border:1px solid var(--sky-glow)}
.badge-dim{background:rgba(255,255,255,0.03);color:var(--text-dim);border:1px solid var(--border)}

.content{max-width:900px;margin:0 auto;padding:3rem 2rem 6rem}

.module-header{
  display:flex;align-items:flex-start;gap:1.5rem;
  padding:2rem 0 2.5rem;border-bottom:1px solid var(--border);margin-bottom:3rem;
}
.module-num-large{
  font-family:'JetBrains Mono',monospace;font-size:3.5rem;font-weight:500;
  color:var(--sky);line-height:1;opacity:0.5;flex-shrink:0;
}
.module-header-text h2{
  font-size:1.75rem;font-weight:700;letter-spacing:-0.02em;color:var(--white);margin-bottom:0.4rem;
}
.module-header-text p{font-size:14px;color:var(--text-muted);line-height:1.6}

.chapter{margin-bottom:4rem;padding-bottom:4rem;border-bottom:1px solid var(--border)}
.chapter-header{display:flex;align-items:center;gap:1rem;margin-bottom:2rem}
.chapter-tag{
  font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--sky);
  background:var(--sky-glow2);border:1px solid var(--sky-glow);
  padding:3px 9px;border-radius:2px;white-space:nowrap;
}
.chapter-header h3{font-size:1.35rem;font-weight:700;color:var(--white);letter-spacing:-0.01em}

.prose p{color:var(--text-muted);margin-bottom:1.25rem;font-size:15px;line-height:1.8}
.prose strong{color:var(--white);font-weight:600}
.prose h4{
  font-size:1rem;font-weight:600;color:var(--white);margin:2rem 0 0.75rem;
  display:flex;align-items:center;gap:8px;
}
.prose h4::before{
  content:'';width:3px;height:1em;background:var(--sky);border-radius:2px;flex-shrink:0;
}

.callout{
  border:1px solid var(--border-bright);border-left:3px solid var(--sky);
  background:var(--surface);padding:1.25rem 1.5rem;margin:1.75rem 0;
  border-radius:0 4px 4px 0;
}
.callout-label{
  font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;
  letter-spacing:0.15em;text-transform:uppercase;color:var(--sky);margin-bottom:0.5rem;
}
.callout p{margin:0;font-size:14px;color:var(--text-muted);line-height:1.7}
.callout p strong{color:var(--white)}

.code-block{
  background:var(--surface);border:1px solid var(--border-bright);
  border-top:2px solid var(--accent);border-radius:0 0 4px 4px;margin:1.75rem 0;overflow:hidden;
}
.code-block-header{
  background:var(--surface2);border-bottom:1px solid var(--border);
  padding:8px 16px;display:flex;align-items:center;justify-content:space-between;
}
.code-block-label{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-dim);letter-spacing:0.06em}
.code-dots{display:flex;gap:5px}
.code-dots span{width:9px;height:9px;border-radius:50%}
.dot-r{background:#FF5F57}.dot-y{background:#FEBC2E}.dot-g{background:#28C840}
.code-block pre{
  padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:13px;
  line-height:1.75;color:#9ECBFF;overflow-x:auto;white-space:pre-wrap;
}
.code-block pre .kw{color:#79C0FF}
.code-block pre .st{color:#A5D6FF}
.code-block pre .cm{color:#4A6080;font-style:italic}
.code-block pre .fn{color:#00E5C0}
.code-block pre .nm{color:#E3B341}
.code-block pre .op{color:#00C2FF}

.analogy{
  background:rgba(0,119,255,0.05);
  border:1px solid rgba(0,194,255,0.15);
  border-radius:4px;padding:1.25rem 1.5rem;margin:1.75rem 0;
}
.analogy-label{
  font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;
  color:var(--teal);margin-bottom:0.5rem;display:flex;align-items:center;gap:6px;
}
.analogy-label::before{content:'◈';font-size:12px}
.analogy p{
  font-family:'Crimson Pro',serif;font-size:15px;color:var(--text-muted);margin:0;line-height:1.7;
}

.concept-grid{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:1px;background:var(--border);border:1px solid var(--border);margin:1.75rem 0;
}
.concept-cell{background:var(--bg);padding:1.25rem}
.concept-cell:hover{background:var(--surface)}
.concept-icon{font-size:22px;margin-bottom:0.5rem;display:block}
.concept-cell h5{font-size:13px;font-weight:600;color:var(--white);margin-bottom:0.35rem}
.concept-cell p{font-size:12px;color:var(--text-dim);line-height:1.55}

.trait-table{width:100%;border-collapse:collapse;margin:1.75rem 0;font-size:13px}
.trait-table th{
  text-align:left;padding:10px 14px;font-size:11px;font-weight:600;
  letter-spacing:0.1em;text-transform:uppercase;color:var(--text-dim);
  border-bottom:1px solid var(--border-bright);
}
.trait-table td{
  padding:11px 14px;border-bottom:1px solid var(--border);color:var(--text-muted);vertical-align:top;
}
.trait-table tr:hover td{background:var(--surface);color:var(--text)}
.trait-table td:first-child{font-weight:600;color:var(--white);white-space:nowrap}

.pull-quote{border-left:2px solid var(--gold);padding:0.5rem 0 0.5rem 1.5rem;margin:2rem 0}
.pull-quote p{
  font-family:'Crimson Pro',serif;font-size:1.15rem;font-style:italic;
  color:var(--white);line-height:1.65;margin:0 0 0.4rem;
}
.pull-quote cite{font-size:12px;color:var(--text-dim);letter-spacing:0.06em;font-style:normal}

.tag-row{display:flex;flex-wrap:wrap;gap:6px;margin:1.25rem 0}
.tag{
  font-size:11px;font-weight:500;letter-spacing:0.05em;padding:3px 10px;
  border:1px solid var(--border-bright);color:var(--text-dim);border-radius:2px;background:var(--surface);
}

.type-grid{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:1px;background:var(--border);border:1px solid var(--border);margin:1.75rem 0;
}
.type-card{background:var(--bg);padding:1.5rem;position:relative;transition:background 0.18s}
.type-card:hover{background:var(--surface)}
.type-card::before{
  content:'';position:absolute;top:0;left:0;bottom:0;width:2px;
  background:var(--border-bright);transition:background 0.18s;
}
.type-card:hover::before{background:var(--sky)}
.type-card h5{font-size:14px;font-weight:700;color:var(--white);margin-bottom:0.4rem}
.type-card .type-tag{
  font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--sky);
  letter-spacing:0.1em;display:block;margin-bottom:0.6rem;
}
.type-card p{font-size:13px;color:var(--text-muted);line-height:1.6;margin:0}
.type-card ul{padding-left:1rem;margin-top:0.5rem}
.type-card ul li{font-size:12px;color:var(--text-dim);line-height:1.8}

.steps-list{margin:1.75rem 0;display:flex;flex-direction:column;gap:0}
.step-item{
  display:flex;gap:1.25rem;padding:1.25rem 1.5rem;
  border:1px solid var(--border);border-bottom:none;background:var(--bg);
  transition:background 0.15s;
}
.step-item:first-child{border-radius:4px 4px 0 0}
.step-item:last-child{border-bottom:1px solid var(--border);border-radius:0 0 4px 4px}
.step-item:hover{background:var(--surface)}
.step-num{
  font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;
  color:var(--sky);flex-shrink:0;width:28px;padding-top:2px;
}
.step-content h6{font-size:14px;font-weight:600;color:var(--white);margin-bottom:0.3rem}
.step-content p{font-size:13px;color:var(--text-muted);margin:0;line-height:1.65}

#btt{
  position:fixed;bottom:2rem;right:2rem;z-index:200;
  width:44px;height:44px;background:var(--sky);color:var(--bg);
  border:none;border-radius:0;cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:22px;line-height:1;
  transition:transform 0.15s, background 0.15s;
  box-shadow:0 0 0 1px rgba(0,194,255,0.3),0 8px 24px rgba(0,194,255,0.18);
  font-weight:700;
}
#btt:hover{background:var(--white);transform:translateY(-2px)}
#btt:active{transform:translateY(0)}

footer{
  border-top:1px solid var(--border);padding:2rem;
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;
}
footer p{font-size:12px;color:var(--text-dim);letter-spacing:0.04em}

@media(max-width:640px){
  nav{padding:0 1rem}
  .nav-links a{padding:6px 8px;font-size:12px}
  .hero{padding:4rem 1rem 3rem}
  .content{padding:2rem 1rem 4rem}
}
</style>
</head>
<body id="top">

<nav>
  <div class="nav-logo">
    <span>STUDY</span>FORGE &nbsp;·&nbsp; ${subject} Guide
  </div>
  <ul class="nav-links">
    <li><a href="#ch1" class="active">Chapter 1</a></li>
    <li><a href="#ch2">Chapter 2</a></li>
  </ul>
</nav>

<section class="hero">
  <div class="hero-eyebrow">AI Study Resource · ${dateStr}</div>
  <h1>${headingText}</h1>
  <p class="hero-subtitle">Standalone structured knowledge guide generated by StudyForge</p>
  <div class="hero-meta">
    <div class="hero-meta-item">
      <strong>Subject Core</strong>${subject}
    </div>
    <div class="hero-meta-item">
      <strong>Document Source</strong>Digital Repository
    </div>
    <div class="hero-meta-item">
      <strong>System Engine</strong>StudyForge v1.0
    </div>
  </div>
</section>

<div class="section-label" style="margin-top:3rem">
  <h2>Study Modules</h2>
</div>

<div class="module-grid">
  ${modulesListHtml}
</div>

<div class="content">
  <div class="module-header">
    <div class="module-num-large">I</div>
    <div class="module-header-text">
      <h2>Complete Notes Analysis</h2>
      <p>This dynamic outline breaks down essential concepts, analogies, formulas, and structural code examples extracted directly from your files.</p>
    </div>
  </div>

  ${bodyChapters}
</div>

<button id="btt" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">↑</button>

<footer>
  <p>© ${new Date().getFullYear()} StudyForge. All rights reserved.</p>
  <p>Engineered for high-retention learning.</p>
</footer>

</body>
</html>`;
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

  // Generate dynamic HTML content
  const htmlContent = generateHtmlContent(cleanTitle, subject, color, dateStr);
  const textContent = convertHtmlToText(htmlContent);

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
    date: dateStr,
    htmlContent,
    textContent
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

  const clearedKey = "studyforge_data_cleared_v2";
  if (!localStorage.getItem(clearedKey)) {
    localStorage.removeItem("studyforge_uploads");
    localStorage.removeItem("studyforge_notes");
    localStorage.removeItem("studyforge_flashcards_decks");
    localStorage.removeItem("studyforge_flashcards_cards");
    localStorage.removeItem("studyforge_quizzes");
    localStorage.removeItem("studyforge_questions");
    localStorage.setItem(clearedKey, "true");
  }
}

// Dynamic converter from HTML study guides to plain text
export function convertHtmlToText(htmlContent: string): string {
  if (typeof window === "undefined") return "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    
    // Remove style, script, and link elements
    doc.querySelectorAll("style, script, link").forEach(el => el.remove());
    
    const title = doc.querySelector("h1, h2, h3")?.textContent?.trim() || "Study Notes";
    let text = `📚 STUDY NOTES — ${title.toUpperCase()}\n`;
    text += `Generated from HTML Guide\n`;
    text += `═`.repeat(60) + "\n\n";
    
    // Select all chapters or sections
    const chapters = doc.querySelectorAll(".chapter, .section, [id^='ch']");
    if (chapters.length > 0) {
      chapters.forEach((ch, idx) => {
        const tag = ch.querySelector(".chapter-tag, .section-tag")?.textContent?.trim() || `SECTION ${idx + 1}`;
        const title = ch.querySelector("h3, h4")?.textContent?.trim() || "Core Concepts";
        text += `\n${tag} — ${title.toUpperCase()}\n`;
        text += `─`.repeat(40) + "\n";
        
        const elements = ch.querySelectorAll("p, h4, h5, h6, table, .callout, .analogy, .step-item");
        elements.forEach(el => {
          if (el.tagName === "H4" || el.tagName === "H5" || el.tagName === "H6") {
            text += `\n▶ ${el.textContent?.trim().toUpperCase()}\n`;
          } else if (el.classList.contains("callout") || el.classList.contains("analogy")) {
            const label = el.querySelector(".callout-label, .analogy-label")?.textContent?.trim() || "Highlight";
            const pText = el.querySelector("p")?.textContent?.trim() || el.textContent?.trim() || "";
            text += `\n📌 [${label}]: ${pText}\n`;
          } else if (el.classList.contains("step-item")) {
            const num = el.querySelector(".step-num")?.textContent?.trim() || "•";
            const desc = el.querySelector(".step-content")?.textContent?.trim() || el.textContent?.trim() || "";
            text += `  • [${num}] ${desc.replace(/\s+/g, " ")}\n`;
          } else if (el.tagName === "TABLE") {
            text += "\n[Comparison Matrix]:\n";
            el.querySelectorAll("tr").forEach(row => {
              const cells = Array.from(row.querySelectorAll("th, td")).map(c => c.textContent?.trim() || "");
              if (cells.length > 0) {
                text += `  | ${cells.join(" | ")} |\n`;
              }
            });
            text += "\n";
          } else if (el.tagName === "P" && !el.closest(".callout") && !el.closest(".analogy") && !el.closest(".step-item")) {
            text += `  ${el.textContent?.trim()}\n\n`;
          }
        });
        text += "\n" + `═`.repeat(60) + "\n\n";
      });
    } else {
      // General fallback extraction
      const bodyText = doc.body.textContent || "";
      text += bodyText.split("\n").map(l => l.trim()).filter(l => l).join("\n");
    }
    
    return text.replace(/\n{3,}/g, "\n\n").trim();
  } catch (err) {
    console.error("Extraction error:", err);
    return "Failed to extract plain text notes from HTML guide.";
  }
}

// Dynamic converter from plain text notes to premium styled HTML
export function convertTextToHtml(title: string, textContent: string, subject: string, color: string): string {
  const lines = textContent.split("\n");
  let htmlBody = "";
  let currentChapter: { title: string; tag: string; content: string[] } | null = null;
  const chapters: Array<{ title: string; tag: string; content: string[] }> = [];
  
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    
    if (line.startsWith("CHAPTER") || (line.toUpperCase().includes("CHAPTER") && lines[index+1]?.includes("──"))) {
      if (currentChapter) {
        chapters.push(currentChapter);
      }
      
      const parts = line.split("—");
      const tag = parts[0]?.trim() || "CH";
      const chTitle = parts[1]?.trim() || "Concepts";
      
      currentChapter = {
        tag,
        title: chTitle,
        content: []
      };
      
      if (lines[index+1]?.includes("──")) {
        index++;
      }
    } else if (line) {
      if (currentChapter) {
        currentChapter.content.push(lines[index]);
      } else {
        if (!line.startsWith("📚") && !line.startsWith("---") && !line.includes("Subject:")) {
          htmlBody += `<p class="intro-p" style="color: var(--text-muted); font-size: 15px; margin-bottom: 1rem;">${line}</p>`;
        }
      }
    }
    index++;
  }
  if (currentChapter) {
    chapters.push(currentChapter);
  }
  
  if (chapters.length === 0) {
    htmlBody += `
      <div class="chapter">
        <div class="chapter-header">
          <span class="chapter-tag">NOTES</span>
          <h3>${title}</h3>
        </div>
        <div class="prose">
          <pre style="white-space: pre-wrap; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-muted); line-height: 1.8; background: var(--surface); padding: 1.5rem; border-radius: 4px; border: 1px solid var(--border-bright);">${textContent}</pre>
        </div>
      </div>
    `;
  } else {
    chapters.forEach(ch => {
      let chHtml = `
        <div class="chapter">
          <div class="chapter-header">
            <span class="chapter-tag">${ch.tag}</span>
            <h3>${ch.title}</h3>
          </div>
          <div class="prose">
      `;
      
      let inList = false;
      let inCallout = false;
      
      ch.content.forEach(cLine => {
        const trimmed = cLine.trim();
        if (!trimmed) return;
        
        if (trimmed.startsWith("▶")) {
          if (inList) { chHtml += `</ul>`; inList = false; }
          if (inCallout) { chHtml += `</div>`; inCallout = false; }
          chHtml += `<h4>${trimmed.substring(1).trim()}</h4>`;
        } else if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          if (inCallout) { chHtml += `</div>`; inCallout = false; }
          if (!inList) { chHtml += `<ul class="notes-list">`; inList = true; }
          chHtml += `<li>${trimmed.substring(1).trim()}</li>`;
        } else if (/^\d+\./.test(trimmed)) {
          if (inList) { chHtml += `</ul>`; inList = false; }
          if (inCallout) { chHtml += `</div>`; inCallout = false; }
          const match = trimmed.match(/^(\d+)\.(.*)/);
          if (match) {
            chHtml += `
              <div class="step-item" style="display: flex; gap: 1rem; margin-bottom: 0.75rem;">
                <span class="step-num" style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--sky); font-weight: 600;">0${match[1]}</span>
                <div class="step-content"><p style="font-size: 14px; color: var(--text-muted); margin: 0;">${match[2].trim()}</p></div>
              </div>
            `;
          }
        } else if (trimmed.startsWith("📌") || trimmed.startsWith("★")) {
          if (inList) { chHtml += `</ul>`; inList = false; }
          if (inCallout) { chHtml += `</div>`; inCallout = false; }
          chHtml += `
            <div class="callout" style="border: 1px solid var(--border-bright); border-left: 3px solid var(--sky); background: var(--surface); padding: 1.25rem 1.5rem; margin: 1.75rem 0; border-radius: 0 4px 4px 0;">
              <div class="callout-label" style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--sky); margin-bottom: 0.5rem;">Study Tip</div>
              <p style="margin: 0; font-size: 14px; color: var(--text-muted);">${trimmed.substring(1).trim()}</p>
            </div>
          `;
        } else {
          if (inList) { chHtml += `</ul>`; inList = false; }
          if (inCallout) { chHtml += `</div>`; inCallout = false; }
          chHtml += `<p style="color: var(--text-muted); margin-bottom: 1.25rem; font-size: 15px;">${trimmed}</p>`;
        }
      });
      
      if (inList) chHtml += `</ul>`;
      if (inCallout) chHtml += `</div>`;
      
      chHtml += `
          </div>
        </div>
      `;
      htmlBody += chHtml;
    });
  }
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #070A13;
      --surface: #0E1326;
      --surface2: #131A33;
      --border: rgba(255,255,255,0.06);
      --border-bright: rgba(255,255,255,0.12);
      --white: #FFFFFF;
      --text: #E2E8F0;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      --sky: ${color};
      --sky-glow: ${color}22;
      --sky-glow2: ${color}0D;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
    }
    
    .hero {
      text-align: center;
      padding: 5rem 2rem 4rem;
      border-bottom: 1px solid var(--border);
      background: radial-gradient(circle at top, var(--sky-glow) 0%, transparent 60%);
    }
    .hero h1 {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      color: var(--white);
      margin-bottom: 0.5rem;
    }
    .hero-subtitle {
      font-family: 'Crimson Pro', serif;
      font-size: 1.25rem;
      font-weight: 300;
      font-style: italic;
      color: var(--text-muted);
    }
    
    .content {
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 2rem 6rem;
    }
    
    .chapter {
      margin-bottom: 4rem;
      padding-bottom: 4rem;
      border-bottom: 1px solid var(--border);
    }
    .chapter-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .chapter-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--sky);
      background: var(--sky-glow2);
      border: 1px solid var(--sky-glow);
      padding: 3px 9px;
      border-radius: 2px;
      font-weight: 600;
    }
    .chapter-header h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--white);
    }
    
    .prose p {
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      font-size: 15px;
    }
    .prose h4 {
      font-family: 'Outfit', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--white);
      margin: 2rem 0 0.75rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .prose h4::before {
      content: '';
      width: 3px;
      height: 1em;
      background: var(--sky);
      border-radius: 2px;
    }
    
    .notes-list {
      margin-bottom: 1.5rem;
      padding-left: 1.25rem;
      color: var(--text-muted);
    }
    .notes-list li {
      margin-bottom: 0.5rem;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${title}</h1>
    <p class="hero-subtitle">Interactive Study Guide • ${subject}</p>
  </div>
  <div class="content">
    ${htmlBody}
  </div>
</body>
</html>
  `;
}
