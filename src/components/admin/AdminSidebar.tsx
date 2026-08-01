"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEduStore } from "@/store/useEduStore";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  MessageSquare,
  BarChart3,
  LogOut,
  GraduationCap,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useEduStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "O'quv markazlar",
      href: "/admin/centers",
      icon: Building2,
    },
    {
      name: "Kurslar",
      href: "/admin/courses",
      icon: BookOpen,
    },
    {
      name: "Ustozlar",
      href: "/admin/teachers",
      icon: Users,
    },
    {
      name: "Izohlar va Reyting",
      href: "/admin/feedbacks",
      icon: MessageSquare,
    },
    {
      name: "Statistika",
      href: "/admin/statistics",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800">
      {/* Top Header */}
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-black text-white tracking-tight">
              Edu<span className="text-brand-500">qash</span> Admin
            </span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Boshqaruv Paneli
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "hover:bg-slate-800 hover:text-white text-slate-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <span>Platformaga o'tish</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition border border-rose-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Tizimdan chiqish</span>
        </button>
      </div>
    </aside>
  );
}
