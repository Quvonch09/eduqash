"use client";

import { useEffect, useState } from "react";
import { useEduStore } from "@/store/useEduStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useEduStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  if (!mounted) {
    return <div className="bg-slate-50 text-slate-900 min-h-screen">{children}</div>;
  }

  return <>{children}</>;
}
