"use client";

import Link from "next/link";
import { useEduStore } from "@/store/useEduStore";
import {
  Building2,
  BookOpen,
  Users,
  Search,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Globe,
} from "lucide-react";

export default function AdminDashboardPage() {
  const centers = useEduStore((state) => state.centers);
  const courses = useEduStore((state) => state.courses);
  const teachers = useEduStore((state) => state.teachers);
  const feedbacks = useEduStore((state) => state.feedbacks);
  const stats = useEduStore((state) => state.stats);
  const currentAdmin = useEduStore((state) => state.currentAdmin);

  const isSuperAdmin = !currentAdmin || currentAdmin.role === "super_admin";
  const isManager = currentAdmin?.role === "manager";

  const userCenters = isSuperAdmin
    ? centers
    : isManager && currentAdmin.centerId
    ? centers.filter((c) => c.id === currentAdmin.centerId)
    : centers.filter((c) => c.createdBy === currentAdmin.id || (currentAdmin.centerId && c.id === currentAdmin.centerId));

  const allowedCenterIds = userCenters.map((c) => c.id);

  const userCourses = isSuperAdmin
    ? courses
    : courses.filter((c) => allowedCenterIds.includes(c.centerId));

  const userTeachers = isSuperAdmin
    ? teachers
    : teachers.filter((t) => allowedCenterIds.includes(t.centerId));

  const userFeedbacks = isSuperAdmin
    ? feedbacks
    : feedbacks.filter((f) => allowedCenterIds.includes(f.centerId));

  const totalSearches = stats.searchLogs.reduce(
    (acc, item) => acc + item.count,
    0
  );

  const totalViews = userCenters.reduce((acc, c) => acc + c.viewsCount, 0);
  const totalVisitors = stats.totalVisitors || 1420;

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {isManager ? "Menejer Boshqaruv Paneli" : "Dashboard — Boshqaruv statistikasi"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isManager
            ? "O'quv markazingiz kurslari va ustozlarini boshqaring"
            : "Qashqadaryo ta'lim platformasining umumiy holati va tezkor harakatlar"}
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isManager ? (
          <>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Markaz Kurslari
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  {userCourses.length}
                </span>
                <span className="text-[11px] text-brand-600 dark:text-brand-400 font-bold mt-1 inline-block">
                  Faol yo'nalishlar
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Ustozlar Soni
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  {userTeachers.length}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">
                  Biriktirilgan ustozlar
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Markaz Ko'rishlari
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  {totalViews}
                </span>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-1 inline-block">
                  Tashriflar qiziqishi
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Markaz Reytingi
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  ★ {userCenters[0]?.rating || 4.8}
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1 inline-block">
                  {userFeedbacks.length} ta izohlar
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Sayt Tashrifchilari
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  {totalVisitors}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Real vaqtdagi tashriflar
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  O'quv Markazlar
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  {userCenters.length}
                </span>
                <span className="text-[11px] text-brand-600 dark:text-brand-400 font-bold mt-1 inline-block">
                  {isSuperAdmin ? "Qashqadaryo tumanlarida" : "Sizning markazlaringiz"}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Fikr-mulohazalar
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  {userFeedbacks.length}
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1 inline-block">
                  Foydalanuvchilar izohlari
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Jami Qidiruvlar
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  {totalSearches}
                </span>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-1 inline-block">
                  {totalViews} marta ko'rilgan
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-gradient-to-r from-brand-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Tezkor harakatlar
          </div>
          <h3 className="text-xl font-bold">
            {isManager ? "Markazingiz ma'lumotlarini boshqaring" : "Yangi ta'lim ma'lumotlarini qo'shing"}
          </h3>
          <p className="text-xs text-slate-300">
            {isManager
              ? "Yangi kurslar va ustozlarni kiritish, markaz sahifasini yangilash"
              : "Tizimga yangi o'quv markazlar, yo'nalishlar va ustozlarni kiritish"}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isManager ? (
            <>
              <Link
                href="/admin/courses"
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition"
              >
                <Plus className="w-4 h-4" /> Kurs qo'shish
              </Link>
              <Link
                href="/admin/teachers"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition"
              >
                <Plus className="w-4 h-4" /> Ustoz qo'shish
              </Link>
              <Link
                href="/admin/centers"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition border border-white/20"
              >
                <Building2 className="w-4 h-4" /> Markaz ma'lumotlari
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/admin/centers"
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition"
              >
                <Plus className="w-4 h-4" /> Markaz qo'shish
              </Link>
              <Link
                href="/admin/feedbacks"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition border border-white/20"
              >
                <MessageSquare className="w-4 h-4" /> Izohlarni ko'rish
              </Link>
              <Link
                href="/admin/statistics"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition"
              >
                <span>Tahlil paneli</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Recent Centers List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              O'quv markazlar ro'yxati
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Qashqadaryo hududlaridagi barcha markazlar va ko'rishlar soni
            </p>
          </div>
          <Link
            href="/admin/centers"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Barchasini boshqarish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Markaz nomi</th>
                <th className="py-3.5 px-6">Tuman</th>
                <th className="py-3.5 px-6">Telefon</th>
                <th className="py-3.5 px-6">Reyting</th>
                <th className="py-3.5 px-6">Ko'rishlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {userCenters.slice(0, 5).map((center) => (
                <tr key={center.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                  <td className="py-4 px-6 flex items-center gap-3 font-bold text-slate-900 dark:text-white">
                    <img
                      src={center.image}
                      alt={center.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <span>{center.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold rounded-md">
                      {center.district}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs">{center.phone}</td>
                  <td className="py-4 px-6 font-bold text-amber-600 dark:text-amber-400">
                    ★ {center.rating}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-1 text-xs">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{center.viewsCount}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
