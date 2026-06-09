'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Layers,
  FileQuestion,
  FileText,
  BarChart3,
  CalendarDays,
  Upload,
  Cpu,
  Rocket,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  BookOpen,
  ThumbsUp,
} from 'lucide-react';

/* ───────────────────── animation helpers ───────────────────── */

const easeOutQuart = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: easeOutQuart },
  }),
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ───────────────────── data ───────────────────── */

const features = [
  {
    icon: Brain,
    title: 'Smart Notes Generator',
    description:
      'Upload any material and our AI distills it into beautifully structured, concept-linked notes you can actually remember.',
  },
  {
    icon: Layers,
    title: 'Flashcard Engine',
    description:
      'Automatically generate spaced-repetition flashcards from your notes with smart scheduling for optimal retention.',
  },
  {
    icon: FileQuestion,
    title: 'Quiz Generator',
    description:
      'Create adaptive quizzes that target your weak spots. Multiple choice, fill-in-the-blank, and free response supported.',
  },
  {
    icon: FileText,
    title: 'PDF Analysis',
    description:
      'Drop in textbooks, research papers, or lecture slides — our AI reads, highlights, and summarises the key takeaways.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description:
      'Visualise your learning journey with detailed analytics on retention rates, study streaks, and mastery levels.',
  },
  {
    icon: CalendarDays,
    title: 'Study Planner',
    description:
      'AI-optimised study schedules that adapt to your deadlines, energy levels, and the topics that need the most work.',
  },
];

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload Your Materials',
    description:
      'Drag and drop your PDFs, lecture slides, textbook chapters, or even paste raw text. We handle every format.',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'AI Processes & Generates',
    description:
      'Our models analyse structure, extract key concepts, and generate notes, flashcards, and quizzes in seconds.',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Study Smarter',
    description:
      'Review with spaced repetition, test yourself with adaptive quizzes, and track your progress toward mastery.',
  },
];

const testimonials = [
  {
    quote:
      'StudyForge turned my 200-page biology textbook into a set of gorgeous notes and flashcards in under two minutes. My GPA went from 3.2 to 3.8 in one semester.',
    name: 'Priya Sharma',
    university: 'Stanford University',
    rating: 5,
  },
  {
    quote:
      "I used to spend hours making Anki decks by hand. Now I just upload my lecture PDF and StudyForge does it all — better than I ever could. It's honestly a cheat code.",
    name: 'Marcus Chen',
    university: 'MIT',
    rating: 5,
  },
  {
    quote:
      'The quiz generator is insane. It figured out exactly which pharmacology concepts I was weakest on and drilled me until I nailed them. Passed my boards on the first try.',
    name: 'Aaliya Johnson',
    university: 'Johns Hopkins University',
    rating: 5,
  },
];

const stats = [
  { label: 'Students', value: '50K+', icon: Users },
  { label: 'Notes Generated', value: '2M+', icon: BookOpen },
  { label: 'Satisfaction', value: '98%', icon: ThumbsUp },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ─────────────── HERO ─────────────── */}
      <section className="relative flex min-h-screen items-center justify-center px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        {/* background blobs */}
        <div
          aria-hidden
          className="animate-blob pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: 'var(--gradient-primary)' }}
        />
        <div
          aria-hidden
          className="animate-blob pointer-events-none absolute -right-24 top-1/4 h-[340px] w-[340px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)', animationDelay: '2s' }}
        />
        <div
          aria-hidden
          className="animate-blob pointer-events-none absolute bottom-12 left-1/3 h-[300px] w-[300px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'linear-gradient(135deg, #9333EA 0%, #3B82F6 100%)', animationDelay: '4s' }}
        />

        {/* radial glow behind text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--gradient-glow)' }}
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center"
          >
            {/* badge */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
              style={{ color: 'var(--forge-violet)' }}
            >
              <Sparkles size={14} />
              Powered by AI
            </motion.div>

            {/* heading */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              <span className="gradient-text">Forge Knowledge.</span>
              <br />
              <span className="gradient-text">Master Anything.</span>
            </motion.h1>

            {/* subtitle */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              AI-powered learning platform that transforms your study materials into interactive notes,
              flashcards, quizzes, and more.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Start Learning Free
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#how-it-works"
                className="glass inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold transition-all hover:scale-[1.03] active:scale-[0.98]"
                style={{ color: 'var(--foreground)' }}
              >
                See How It Works
                <Zap size={18} style={{ color: 'var(--forge-violet)' }} />
              </Link>
            </motion.div>

            {/* stats bar */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="glass mt-16 flex flex-wrap items-center justify-center gap-6 rounded-2xl px-8 py-5 sm:gap-12"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: 'var(--gradient-subtle)' }}
                    >
                      <Icon size={20} style={{ color: 'var(--forge-indigo)' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {stat.value}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── FEATURES ─────────────── */}
      <section id="features" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--forge-violet)' }}
            >
              Features
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Everything You Need to{' '}
              <span className="gradient-text">Excel</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-4 max-w-2xl text-lg"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              Six powerful AI-driven tools, one seamless platform — designed so you can focus on learning,
              not logistics.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  custom={i}
                  className="card-lift glass group rounded-2xl p-7"
                >
                  <div
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
                    style={{ background: 'var(--gradient-subtle)' }}
                  >
                    <Icon size={24} style={{ color: 'var(--forge-indigo)' }} />
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{ fontFamily: 'var(--font-outfit)', color: 'var(--foreground)' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─────────────── HOW IT WORKS ─────────────── */}
      <section id="how-it-works" className="relative px-4 py-24 sm:px-6 lg:px-8">
        {/* subtle glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--gradient-glow)' }}
        />

        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--forge-violet)' }}
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Three Steps to{' '}
              <span className="gradient-text">Smarter Study</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid gap-10 md:grid-cols-3 md:gap-6"
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.number} variants={fadeUp} custom={i} className="relative flex flex-col items-center text-center">
                  {/* connecting line (hidden on last + mobile) */}
                  {i < steps.length - 1 && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute top-10 left-[calc(50%+40px)] hidden h-[2px] w-[calc(100%-80px)] md:block"
                      style={{ background: 'var(--border-strong)', opacity: 0.5 }}
                    />
                  )}

                  {/* numbered circle */}
                  <div
                    className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    <Icon size={32} className="text-white" />
                    <span
                      className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: 'var(--forge-violet)' }}
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3
                    className="mb-2 text-xl font-semibold"
                    style={{ fontFamily: 'var(--font-outfit)', color: 'var(--foreground)' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="max-w-xs text-sm leading-relaxed"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─────────────── TESTIMONIALS ─────────────── */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--forge-violet)' }}
            >
              Testimonials
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Loved by{' '}
              <span className="gradient-text">Students Everywhere</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-3"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="card-lift glass flex flex-col rounded-2xl p-7"
              >
                {/* stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star
                      key={s}
                      size={16}
                      fill="var(--forge-violet)"
                      stroke="none"
                    />
                  ))}
                </div>

                <p
                  className="mb-6 flex-1 text-sm leading-relaxed italic"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  {/* avatar placeholder */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      {t.university}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────── FINAL CTA ─────────────── */}
      <section className="relative px-4 py-28 sm:px-6 lg:px-8">
        {/* gradient bg */}
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8"
          style={{ background: 'var(--gradient-primary)' }}
        >
          {/* decorative blobs inside */}
          <div
            className="animate-blob absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-20 blur-2xl"
            style={{ background: '#fff' }}
          />
          <div
            className="animate-blob absolute -bottom-16 -left-16 h-64 w-64 rounded-full opacity-20 blur-2xl"
            style={{ background: '#fff', animationDelay: '3s' }}
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Ready to Transform Your Study&nbsp;Game?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-5 max-w-xl text-lg leading-relaxed text-indigo-100"
          >
            Join thousands of students who are learning faster, retaining more, and stressing less
            with StudyForge.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              href="/signup"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold transition-all hover:scale-[1.04] hover:shadow-xl active:scale-[0.98]"
              style={{ color: 'var(--forge-indigo)' }}
            >
              Get Started for Free
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
