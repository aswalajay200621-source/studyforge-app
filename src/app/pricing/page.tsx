"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, X, Sparkles, Zap, Crown, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  description: string;
  features: PlanFeature[];
  cta: string;
  ctaHref: string;
  featured: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    icon: <Zap className="w-5 h-5" />,
    monthlyPrice: 0,
    description: "Perfect for getting started and exploring AI-powered study tools.",
    features: [
      { text: "5 PDF uploads / month", included: true },
      { text: "Basic notes generation", included: true },
      { text: "50 flashcards", included: true },
      { text: "10 quizzes / month", included: true },
      { text: "Basic progress tracking", included: true },
      { text: "Advanced AI analysis", included: false },
      { text: "Unlimited uploads", included: false },
      { text: "Study planner", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started",
    ctaHref: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    icon: <Sparkles className="w-5 h-5" />,
    monthlyPrice: 12,
    description: "For serious learners who want the full power of StudyForge.",
    features: [
      { text: "Unlimited PDF uploads", included: true },
      { text: "Advanced AI notes", included: true },
      { text: "Unlimited flashcards & quizzes", included: true },
      { text: "Study planner", included: true },
      { text: "Pomodoro timer", included: true },
      { text: "Priority support", included: true },
      { text: "Advanced progress analytics", included: true },
      { text: "All Free features included", included: true },
    ],
    cta: "Start Pro Trial",
    ctaHref: "/signup?plan=pro",
    featured: true,
  },
  {
    name: "Team",
    icon: <Crown className="w-5 h-5" />,
    monthlyPrice: 29,
    description: "Built for study groups, classrooms, and organizations.",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Collaborative notes", included: true },
      { text: "Study groups", included: true },
      { text: "Leaderboards", included: true },
      { text: "Admin dashboard", included: true },
      { text: "Custom branding", included: true },
      { text: "Dedicated support", included: true },
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
    featured: false,
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes! Every new account gets a 14-day free trial of the Pro plan with full access to all features. No credit card required. After the trial you'll automatically move to the Free plan unless you upgrade.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. There are no long-term contracts. You can cancel your subscription at any time from your account settings, and you'll continue to have access to paid features until the end of your current billing cycle.",
  },
  {
    question: "Do you offer a student discount?",
    answer:
      "We do! Verified students with a valid .edu email receive 30% off any paid plan. After sign-up, go to Settings → Billing and verify your student status to unlock the discount.",
  },
  {
    question: "How is my data kept private?",
    answer:
      "Your data is encrypted at rest and in transit using AES-256 and TLS 1.3. We never sell or share your data with third parties. All uploaded documents are stored securely and can be permanently deleted from your account at any time.",
  },
  {
    question: "Is there a limit on team size?",
    answer:
      "The Team plan supports up to 50 members by default. If you need a larger team, contact our sales team for a custom Enterprise plan with unlimited seats, SSO, and dedicated infrastructure.",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function BillingToggle({
  yearly,
  onChange,
}: {
  yearly: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <span
        className={`text-sm font-medium transition-colors duration-200 ${
          !yearly
            ? "text-[var(--foreground)]"
            : "text-[var(--foreground-muted)]"
        }`}
      >
        Monthly
      </span>

      <button
        onClick={() => onChange(!yearly)}
        className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none"
        style={{
          background: yearly
            ? "linear-gradient(135deg, #4F46E5, #7C3AED)"
            : "var(--border)",
        }}
        aria-label="Toggle billing period"
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
          style={{ left: yearly ? "calc(100% - 1.625rem)" : "0.125rem" }}
        />
      </button>

      <span
        className={`text-sm font-medium transition-colors duration-200 ${
          yearly
            ? "text-[var(--foreground)]"
            : "text-[var(--foreground-muted)]"
        }`}
      >
        Yearly
      </span>

      {yearly && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"
        >
          Save 20%
        </motion.span>
      )}
    </div>
  );
}

function PricingCard({
  plan,
  yearly,
}: {
  plan: Plan;
  yearly: boolean;
}) {
  const price =
    plan.monthlyPrice === 0
      ? 0
      : yearly
      ? +(plan.monthlyPrice * 0.8).toFixed(2)
      : plan.monthlyPrice;

  return (
    <motion.div
      variants={cardVariants}
      className={`relative flex flex-col rounded-2xl p-[1px] h-full ${
        plan.featured
          ? "bg-gradient-to-b from-indigo-500 via-violet-500 to-purple-600"
          : ""
      }`}
    >
      {/* "Most Popular" badge */}
      {plan.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      <div
        className={`relative flex flex-col h-full rounded-2xl p-6 sm:p-8 ${
          plan.featured ? "bg-[var(--background)]" : "glass"
        }`}
        style={
          plan.featured
            ? { boxShadow: "0 0 60px rgba(124, 58, 237, 0.18)" }
            : undefined
        }
      >
        {/* Plan header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              plan.featured
                ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                : "bg-[var(--surface)] text-[var(--forge-indigo)] border border-[var(--border)]"
            }`}
          >
            {plan.icon}
          </div>
          <h3
            className="text-lg font-bold text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {plan.name}
          </h3>
        </div>

        <p className="text-sm text-[var(--foreground-muted)] mb-6 leading-relaxed">
          {plan.description}
        </p>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-end gap-1">
            <span
              className={`text-4xl font-extrabold tracking-tight ${
                plan.featured ? "gradient-text" : "text-[var(--foreground)]"
              }`}
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              ${price}
            </span>
            <span className="text-sm text-[var(--foreground-muted)] mb-1">
              / month
            </span>
          </div>
          {yearly && plan.monthlyPrice > 0 && (
            <p className="text-xs text-[var(--foreground-muted)] mt-1">
              Billed as ${(price * 12).toFixed(0)} / year
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((f) => (
            <li key={f.text} className="flex items-start gap-2.5">
              {f.included ? (
                <Check className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
              ) : (
                <X className="w-4 h-4 mt-0.5 text-[var(--foreground-muted)] shrink-0" />
              )}
              <span
                className={`text-sm leading-snug ${
                  f.included
                    ? "text-[var(--foreground-secondary)]"
                    : "text-[var(--foreground-muted)]"
                }`}
              >
                {f.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={plan.ctaHref}
          className={`block w-full text-center py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
            plan.featured
              ? "text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 shadow-lg hover:shadow-violet-500/30"
              : "text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-[var(--surface-hover)] hover:border-[var(--forge-indigo)]"
          }`}
        >
          {plan.cta}
        </Link>
      </div>
    </motion.div>
  );
}

function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[var(--surface-hover)] transition-colors duration-200"
      >
        <span className="text-sm sm:text-base font-medium text-[var(--foreground)]">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-sm text-[var(--foreground-secondary)] leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <Navbar />

      {/* ---- decorative blobs ---- */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />
      <div className="absolute top-60 -left-40 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl animate-blob pointer-events-none -z-10" />
      <div className="absolute top-96 -right-32 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl animate-blob pointer-events-none -z-10" style={{ animationDelay: "2s" }} />

      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Simple, Transparent
            <br />
            <span className="gradient-text">Pricing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base sm:text-lg text-[var(--foreground-secondary)] max-w-xl mx-auto"
          >
            Start free. Upgrade when you need more power.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <BillingToggle yearly={yearly} onChange={setYearly} />
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Pricing Cards                                               */}
      {/* ============================================================ */}
      <section className="pb-20 sm:pb-28 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} yearly={yearly} />
          ))}
        </motion.div>

        {/* trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-[var(--foreground-muted)] mt-8"
        >
          All plans include a 14-day money-back guarantee. No questions asked.
        </motion.p>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                         */}
      {/* ============================================================ */}
      <section className="pb-24 sm:pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="mt-3 text-sm text-[var(--foreground-muted)]">
              Everything you need to know about StudyForge pricing.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-3"
          >
            {faqs.map((faq) => (
              <motion.div key={faq.question} variants={cardVariants}>
                <FaqAccordion item={faq} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
