"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Code } from "lucide-react";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth then redirect
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-[var(--background)] overflow-hidden">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-indigo-900 to-violet-900 text-white items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/30 blur-[120px] rounded-full animate-blob" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-violet-500/30 blur-[120px] rounded-full animate-blob animation-delay-2000" />
        
        <div className="relative z-10 p-16 max-w-xl">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-3xl tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              StudyForge
            </span>
          </Link>
          <h1 className="text-5xl font-bold leading-tight mb-6" style={{ fontFamily: "var(--font-outfit)" }}>
            Forge Knowledge.<br />Master Anything.
          </h1>
          <p className="text-lg text-indigo-100/80 leading-relaxed">
            Welcome back to your personalized learning ecosystem. AI-powered tools designed to help you study smarter, not harder.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
              Welcome back
            </h2>
            <p style={{ color: "var(--foreground-muted)" }}>
              Sign in to continue your learning journey
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: "var(--foreground-muted)" }} />
                </div>
                <input 
                  type="email" 
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-transparent focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Password</label>
                <a href="#" className="text-sm font-medium hover:underline" style={{ color: "var(--forge-indigo)" }}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: "var(--foreground-muted)" }} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border bg-transparent focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: "var(--foreground-muted)" }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: "var(--foreground-muted)" }} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="ml-2 block text-sm" style={{ color: "var(--foreground-secondary)" }}>
                Remember me
              </label>
            </div>

            <button 
              className="w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 shadow-md transition-opacity"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "var(--border)" }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--background)]" style={{ color: "var(--foreground-muted)" }}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border rounded-xl hover:bg-[var(--surface-hover)] transition-colors" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border rounded-xl hover:bg-[var(--surface-hover)] transition-colors" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                <Code className="w-5 h-5" />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm" style={{ color: "var(--foreground-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold hover:underline" style={{ color: "var(--forge-indigo)" }}>
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
