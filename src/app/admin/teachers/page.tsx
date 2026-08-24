"use client";

import { useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import { Teacher } from "@/types";
import { fileToBase64 } from "@/lib/utils";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  Phone,
  Send,
  Instagram,
  Award,
  Building2,
  X,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTeachersPage() {
  const teachers = useEduStore((state) => state.teachers);
  const centers = useEduStore((state) => state.centers);
  const currentAdmin = useEduStore((state) => state.currentAdmin);
  const addTeacher = useEduStore((state) => state.addTeacher);
  const updateTeacher = useEduStore((state) => state.updateTeacher);
  const deleteTeacher = useEduStore((state) => state.deleteTeacher);

  const isSuperAdmin = !currentAdmin || currentAdmin.role === "super_admin";
  const isManager = currentAdmin?.role === "manager";
  const allowedCenters = isSuperAdmin
    ? centers
    : isManager && currentAdmin.centerId
    ? centers.filter((c) => c.id === currentAdmin.centerId)
    : centers.filter((c) => c.createdBy === currentAdmin.id || (currentAdmin.centerId && c.id === currentAdmin.centerId));
  const allowedCenterIds = allowedCenters.map((c) => c.id);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "",
    experience: "3 yil",
    resultsText: "100+ shogirdlar",
    centerId: allowedCenters[0]?.id || "",
    phone: "+998 ",
    telegram: "@",
    instagram: "",
  });

  const handleOpenAddModal = () => {
    setEditingTeacher(null);
    setFormData({
      name: "",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "",
      experience: "3 yil",
      resultsText: "100+ shogirdlar, OTM talabalari",
      centerId: allowedCenters[0]?.id || "",
      phone: "+998 ",
      telegram: "@",
      instagram: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      photo: teacher.photo,
      bio: teacher.bio,
      experience: teacher.experience,
      resultsText: teacher.results.join(", "),
      centerId: teacher.centerId,
      phone: teacher.contact.phone,
      telegram: teacher.contact.telegram || "",
      instagram: teacher.contact.instagram || "",
    });
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData((prev) => ({ ...prev, photo: base64 }));
      } catch (err) {
        console.error("Base64 photo upload error", err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resultsArray = formData.resultsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      photo: formData.photo,
      bio: formData.bio,
      experience: formData.experience,
      results: resultsArray,
      centerId: formData.centerId,
      contact: {
        phone: formData.phone,
        telegram: formData.telegram,
        instagram: formData.instagram,
      },
    };

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, payload);
    } else {
      addTeacher(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Ushbu o'qituvchini o'chirmoqchimisiz?")) {
      deleteTeacher(id);
    }
  };

  const userTeachers = isSuperAdmin
    ? teachers
    : teachers.filter((t) => allowedCenterIds.includes(t.centerId));

  const filteredTeachers = userTeachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCenterName = (centerId: string) => {
    return centers.find((c) => c.id === centerId)?.name || "Noma'lum markaz";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Ustozlarni Boshqarish
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Qashqadaryodagi malakali o'qituvchilar profilini shakllantirish
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Ustoz Qo'shish</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ustoz ismi bo'yicha qidiruv..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-200 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {teacher.name}
                  </h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold rounded-md">
                    {teacher.experience} tajriba
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <Building2 className="w-3 h-3 text-brand-600 shrink-0" />
                    <span className="line-clamp-1">
                      {getCenterName(teacher.centerId)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {teacher.bio}
              </p>

              {teacher.results && teacher.results.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">
                    Erishgan natijalari:
                  </span>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                    {teacher.results.map((res, i) => (
                      <li key={i} className="line-clamp-1">
                        {res}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{teacher.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(teacher)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingTeacher ? "Ustozni Tahrirlash" : "Yangi Ustoz Qo'shish"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Ustoz F.I.Sh *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Masalan: Sardor Jalolov"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Biriktirilgan Markaz *
                    </label>
                    <select
                      value={formData.centerId}
                      onChange={(e) =>
                        setFormData({ ...formData, centerId: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                    >
                      {allowedCenters.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Tajriba (yil) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      placeholder="5 yil"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>

                {/* Base64 Photo Upload */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Rasm (Upload or URL) *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                    <input
                      type="text"
                      value={formData.photo}
                      onChange={(e) =>
                        setFormData({ ...formData, photo: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Biografiya / Malaka haqida
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Ustozning sohasi va ish tajribasi..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Erishgan natijalari va Shogirdlari (Vergul bilan ajrating)
                  </label>
                  <input
                    type="text"
                    value={formData.resultsText}
                    onChange={(e) =>
                      setFormData({ ...formData, resultsText: e.target.value })
                    }
                    placeholder="120+ shogirdlar dasturchi, Top startaplar muallifi"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Telefon *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+998 90 123 45 67"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Telegram Username
                    </label>
                    <input
                      type="text"
                      value={formData.telegram}
                      onChange={(e) =>
                        setFormData({ ...formData, telegram: e.target.value })
                      }
                      placeholder="@username"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  {editingTeacher ? "Saqlash" : "Qo'shish"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
