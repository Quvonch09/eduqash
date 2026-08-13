"use client";

import { useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import { AdminUser, AdminRole } from "@/types";
import {
  ShieldCheck,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  X,
  Lock,
  User,
  ShieldAlert,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminsManagementPage() {
  const currentAdmin = useEduStore((state) => state.currentAdmin);
  const admins = useEduStore((state) => state.admins);
  const addAdmin = useEduStore((state) => state.addAdmin);
  const updateAdmin = useEduStore((state) => state.updateAdmin);
  const deleteAdmin = useEduStore((state) => state.deleteAdmin);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"Barchasi" | AdminRole>("Barchasi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "admin" as AdminRole,
  });

  const [formError, setFormError] = useState("");

  const isSuperAdmin = !currentAdmin || currentAdmin.role === "super_admin";

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Ruxsat berilmagan!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adminlarni boshqarish bo'limiga faqat <strong>Super Admin</strong> kirish huquqiga ega.
          </p>
        </div>
      </div>
    );
  }

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "Barchasi" || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAddModal = () => {
    setEditingAdmin(null);
    setFormData({
      name: "",
      username: "",
      password: "",
      role: "admin",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      username: admin.username,
      password: "",
      role: admin.role,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.username.trim()) {
      setFormError("Barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    // Check username uniqueness if adding new or changing username
    const existing = admins.find(
      (a) =>
        a.username.toLowerCase() === formData.username.trim().toLowerCase() &&
        a.id !== editingAdmin?.id
    );

    if (existing) {
      setFormError("Ushbu login band, boshqa login tanlang.");
      return;
    }

    if (editingAdmin) {
      updateAdmin(editingAdmin.id, {
        name: formData.name.trim(),
        username: formData.username.trim(),
        role: formData.role,
        ...(formData.password.trim() ? { password: formData.password.trim() } : {}),
      });
    } else {
      if (!formData.password.trim()) {
        setFormError("Yangi admin uchun parol kiritish shart.");
        return;
      }

      addAdmin({
        name: formData.name.trim(),
        username: formData.username.trim(),
        password: formData.password.trim(),
        role: formData.role,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (admins.length <= 1) {
      alert("Oxirgi adminni o'chirish mumkin emas!");
      return;
    }
    if (confirm(`Haqiqatan ham "${name}" adminini o'chirmoqchimisiz?`)) {
      deleteAdmin(id);
    }
  };

  const superAdminsCount = admins.filter((a) => a.role === "super_admin").length;
  const regularAdminsCount = admins.filter((a) => a.role === "admin").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Boshqaruv Rolls Tizimi
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Adminlarni Boshqarish
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tizimdagi Super Admin va Markaz Adminlarini boshqaring, yangi adminlar qo'shing
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Yangi Admin Qo'shish</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {admins.length}
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Jami Adminlar
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {superAdminsCount}
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Super Adminlar
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {regularAdminsCount}
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Markaz Adminlari
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ismi yoki logini bo'yicha qidiruv..."
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["Barchasi", "super_admin", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                roleFilter === r
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {r === "Barchasi"
                ? "Barcha rollar"
                : r === "super_admin"
                ? "Super Admin"
                : "Admin"}
            </button>
          ))}
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-3.5 px-6">Admin</th>
                <th className="py-3.5 px-4">Login</th>
                <th className="py-3.5 px-4">Roli</th>
                <th className="py-3.5 px-4">Yaratilgan sana</th>
                <th className="py-3.5 px-6 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-xs">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Adminlar topilmadi.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl font-bold text-white flex items-center justify-center text-xs shadow-sm ${
                            admin.role === "super_admin"
                              ? "bg-amber-600"
                              : "bg-brand-600"
                          }`}
                        >
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {admin.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            ID: {admin.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      @{admin.username}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          admin.role === "super_admin"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                            : "bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30"
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{admin.createdAt}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(admin)}
                          title="Tahrirlash"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id, admin.name)}
                          title="O'chirish"
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Add/Edit Admin */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {editingAdmin ? "Adminni Tahrirlash" : "Yangi Admin Qo'shish"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tizim admini ma'lumotlarini kiriting
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    To'liq ismi
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Masalan: Sardor Olimov"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Login (Username)
                  </label>
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-2.5">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="username"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    {editingAdmin ? "Yangi Parol (ixtiyoriy)" : "Parol"}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder={editingAdmin ? "O'zgartirmaslik uchun bo'sh qoldiring" : "••••••••"}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Foydalanuvchi Roli
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "admin" })}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        formData.role === "admin"
                          ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-bold"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-xs font-extrabold block">Admin</span>
                      <span className="text-[10px] opacity-80 font-normal mt-1 block">
                        O'quv markazlar, kurslar va ustozlarni nazorat qiladi.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "super_admin" })}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        formData.role === "super_admin"
                          ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-xs font-extrabold block">Super Admin</span>
                      <span className="text-[10px] opacity-80 font-normal mt-1 block">
                        Cheksiz huquqlar + Adminlarni boshqarish.
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                  >
                    Bekor qilish
                  </button>

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saqlash</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
