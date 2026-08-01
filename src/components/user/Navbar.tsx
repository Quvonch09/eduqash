"use client";

import Link from "next/link";
import { GraduationCap, Sun, Moon, BookOpen, ShieldCheck } from "lucide-react";
import { useEduStore } from "@/store/useEduStore";

export default function Navbar() {
  const centersCount = useEduStore((state) => state.centers.length);
  const coursesCount = useEduStore((state) => state.courses.length);
  const theme = useEduStore((state) => state.theme);
  const toggleTheme = useEduStore((state) => state.toggleTheme);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                Edu<span className="text-brand-600 dark:text-brand-400">qash</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-700">
                Qashqadaryo
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              O'quv markazlar qidiruv platformasi
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-4 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{centersCount} markaz</span>
            </div>
            <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{coursesCount} kurs</span>
            </div>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* Admin Panel Link Button */}
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Admin panel</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
