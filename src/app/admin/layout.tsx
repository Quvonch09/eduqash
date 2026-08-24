"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEduStore } from "@/store/useEduStore";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Sun, Moon, Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminLoggedIn = useEduStore((state) => state.isAdminLoggedIn);
  const currentAdmin = useEduStore((state) => state.currentAdmin);
  const theme = useEduStore((state) => state.theme);
  const toggleTheme = useEduStore((state) => state.toggleTheme);
  const [isClient, setIsClient] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAdminLoggedIn && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isClient, isAdminLoggedIn, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isClient || !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-pulse font-semibold text-slate-400">
          Tekshirilmoqda...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />
          <div className="relative z-10 w-64">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-bold px-2.5 py-1 bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 rounded-md">
              Qashqadaryo Boshqaruv Tizimi
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
              <div className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-sm ${
                currentAdmin?.role === "super_admin"
                  ? "bg-amber-600"
                  : currentAdmin?.role === "manager"
                  ? "bg-emerald-600"
                  : "bg-brand-600"
              }`}>
                {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                    {currentAdmin?.name || "Administrator"}
                  </span>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    currentAdmin?.role === "super_admin"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      : currentAdmin?.role === "manager"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30"
                  }`}>
                    {currentAdmin?.role === "super_admin"
                      ? "Super Admin"
                      : currentAdmin?.role === "manager"
                      ? "Menejer"
                      : "Admin"}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  @{currentAdmin?.username || "admin"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
