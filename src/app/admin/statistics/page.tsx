"use client";

import { useEffect, useState, useMemo } from "react";
import { useEduStore } from "@/store/useEduStore";
import {
  Building2,
  BookOpen,
  Search,
  TrendingUp,
  Eye,
  Award,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#6366F1"];

export default function AdminStatisticsPage() {
  const centers = useEduStore((state) => state.centers);
  const courses = useEduStore((state) => state.courses);
  const stats = useEduStore((state) => state.stats);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Total Searches Count
  const totalSearches = useMemo(() => {
    return stats.searchLogs.reduce((sum, item) => sum + item.count, 0);
  }, [stats.searchLogs]);

  // Top 5 Most Searched Directions
  const topSearchedData = useMemo(() => {
    const sorted = [...stats.searchLogs].sort((a, b) => b.count - a.count);
    return sorted.slice(0, 5);
  }, [stats.searchLogs]);

  // Most Searched Direction Name
  const mostSearchedDirection = useMemo(() => {
    if (topSearchedData.length === 0) return "IT";
    return topSearchedData[0].query;
  }, [topSearchedData]);

  // Centers distribution by district (Pie Chart)
  const districtDistributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    centers.forEach((c) => {
      counts[c.district] = (counts[c.district] || 0) + 1;
    });

    return Object.keys(counts).map((district) => ({
      name: district,
      value: counts[district],
    }));
  }, [centers]);

  // Top 5 Most Viewed Centers
  const topViewedCenters = useMemo(() => {
    const sorted = [...centers].sort((a, b) => b.viewsCount - a.viewsCount);
    return sorted.slice(0, 5);
  }, [centers]);

  if (!isMounted) {
    return (
      <div className="p-8 text-center text-slate-400 font-semibold animate-pulse">
        Statistika grafigi yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Tahlil va Statistika
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Foydalanuvchilarning real vaqtdagi qidiruv va ko'rish ko'rsatkichlari
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Jami Markazlar
            </span>
            <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
              {centers.length}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">
              Barcha tumanlarda
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Mavjud Kurslar
            </span>
            <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
              {courses.length}
            </span>
            <span className="text-[11px] text-brand-600 dark:text-brand-400 font-bold mt-1 inline-block">
              Faol o'quv dasturlari
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
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
              Saytdagi faollik
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Eng ko'p qidirilgan
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block truncate max-w-[140px]">
              {mostSearchedDirection}
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1 inline-block">
              Top #1 Talab yuqori
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bar Chart: Eng ko'p qidirilgan 5 yo'nalish */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>Eng ko'p qidirilgan Top 5 ta yo'nalish</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Foydalanuvchilar qidiruv so'rovlarining chastotasi
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSearchedData}>
                <XAxis dataKey="query" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    color: "#ffffff",
                    borderRadius: "12px",
                    padding: "8px 12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  }}
                  itemStyle={{ color: "#ffffff", fontWeight: "bold" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Tumanlar bo'yicha markazlar taqsimoti */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-amber-500" />
                <span>Tumanlar bo'yicha markazlar</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Qashqadaryo tumanlaridagi markazlar ulushi
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={districtDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {districtDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    color: "#ffffff",
                    borderRadius: "12px",
                    padding: "8px 12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  }}
                  itemStyle={{ color: "#ffffff", fontWeight: "bold" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* List: Top 5 Eng ko'p ko'rilgan o'quv markazlar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Eng ko'p ko'rilgan Top 5 ta o'quv markaz</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sayt tashrif buyuruvchilari tomonidan eng ko'p qiziqish bildirilgan maskanlar
          </p>
        </div>

        <div className="space-y-4">
          {topViewedCenters.map((center, index) => (
            <div
              key={center.id}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-brand-300 transition"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    index === 0
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : index === 1
                      ? "bg-slate-300 text-slate-900"
                      : index === 2
                      ? "bg-amber-700 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  #{index + 1}
                </div>
                <img
                  src={center.image}
                  alt={center.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {center.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold rounded-md">
                      {center.district}
                    </span>
                    <span>★ {center.rating}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">
                  Jami ko'rishlar
                </span>
                <span className="text-lg font-black text-brand-600 dark:text-brand-400 flex items-center justify-end gap-1">
                  <Eye className="w-4 h-4" />
                  {center.viewsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
