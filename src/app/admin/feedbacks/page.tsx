"use client";

import { useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import {
  MessageSquare,
  Trash2,
  Search,
  Star,
  Building2,
  User,
  Calendar,
} from "lucide-react";

export default function AdminFeedbacksPage() {
  const feedbacks = useEduStore((state) => state.feedbacks);
  const centers = useEduStore((state) => state.centers);
  const currentAdmin = useEduStore((state) => state.currentAdmin);
  const deleteFeedback = useEduStore((state) => state.deleteFeedback);

  const isSuperAdmin = !currentAdmin || currentAdmin.role === "super_admin";
  const isManager = currentAdmin?.role === "manager";

  if (isManager) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Ruxsat berilmagan!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fikr-mulohazalarni boshqarish bo'limi faqat Administratorlar uchun mo'ljallangan.
          </p>
        </div>
      </div>
    );
  }

  const allowedCenters = isSuperAdmin
    ? centers
    : centers.filter((c) => c.createdBy === currentAdmin.id);
  const allowedCenterIds = allowedCenters.map((c) => c.id);

  const [search, setSearch] = useState("");
  const [selectedCenterId, setSelectedCenterId] = useState<string>("Barchasi");

  const getCenterName = (centerId: string) => {
    return centers.find((c) => c.id === centerId)?.name || "Noma'lum markaz";
  };

  const handleDelete = (id: string) => {
    if (confirm("Ushbu fikr-mulohazani o'chirmoqchimisiz?")) {
      deleteFeedback(id);
    }
  };

  const userFeedbacks = isSuperAdmin
    ? feedbacks
    : feedbacks.filter((fb) => allowedCenterIds.includes(fb.centerId));

  const filteredFeedbacks = userFeedbacks.filter((fb) => {
    const matchesCenter =
      selectedCenterId === "Barchasi" || fb.centerId === selectedCenterId;
    const matchesSearch =
      fb.userName.toLowerCase().includes(search.toLowerCase()) ||
      fb.comment.toLowerCase().includes(search.toLowerCase());
    return matchesCenter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Fikr-mulohazalar (Izohlar) Boshqaruvi
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Foydalanuvchilar tomonidan o'quv markazlarga qoldirilgan izoh va baholarni ko'rish va boshqarish
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4 transition-colors">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Foydalanuvchi ismi yoki izoh matni bo'yicha..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={selectedCenterId}
          onChange={(e) => setSelectedCenterId(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none w-full sm:w-auto"
        >
          <option value="Barchasi">Barcha markazlar</option>
          {allowedCenters.map((center) => (
            <option key={center.id} value={center.id}>
              {center.name}
            </option>
          ))}
        </select>
      </div>

      {/* Feedbacks Grid */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
            Hozircha hech qanday izohlar mavjud emas.
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    {fb.userName}
                  </span>
                  <span className="px-2.5 py-0.5 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold rounded-md flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {getCenterName(fb.centerId)}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < fb.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{fb.comment}"
                </p>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Calendar className="w-3 h-3" />
                  <span>{fb.createdAt}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(fb.id)}
                className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:bg-rose-100 transition self-end sm:self-auto shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
