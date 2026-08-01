"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEduStore } from "@/store/useEduStore";
import { GraduationCap, Lock, User, AlertCircle, ArrowRight, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useEduStore((state) => state.login);
  const theme = useEduStore((state) => state.theme);
  const toggleTheme = useEduStore((state) => state.toggleTheme);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(username, password);

    if (success) {
      router.push("/admin");
    } else {
      setError("Login yoki parol noto'g'ri.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-300" />
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black text-white">Eduqash Admin</h2>
          <p className="text-xs text-slate-400 font-medium">
            Boshqaruv paneliga kirish uchun ma'lumotlarni kiriting
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Foydalanuvchi nomi
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Foydalanuvchi nomi"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Parol
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2"
          >
            <span>Tizimga kirish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
