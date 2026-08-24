"use client";

import { useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import { LearningCenter, District } from "@/types";
import { fileToBase64 } from "@/lib/utils";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  MapPin,
  X,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DISTRICTS: District[] = [
  "Qarshi",
  "Shahrisabz",
  "Kitob",
  "Koson",
  "Yakkabog'",
  "Chiroqchi",
];

export default function AdminCentersPage() {
  const centers = useEduStore((state) => state.centers);
  const currentAdmin = useEduStore((state) => state.currentAdmin);
  const addCenter = useEduStore((state) => state.addCenter);
  const updateCenter = useEduStore((state) => state.updateCenter);
  const deleteCenter = useEduStore((state) => state.deleteCenter);

  const isSuperAdmin = !currentAdmin || currentAdmin.role === "super_admin";
  const isManager = currentAdmin?.role === "manager";

  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Barchasi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<LearningCenter | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "Qarshi" as District,
    phone: "",
    image: "",
    description: "",
    rating: 4.8,
    lat: "38.8605",
    lng: "65.7891",
  });

  const handleOpenAddModal = () => {
    setEditingCenter(null);
    setFormData({
      name: "",
      address: "",
      district: "Qarshi",
      phone: "+998 ",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      description: "",
      rating: 4.8,
      lat: "38.8605",
      lng: "65.7891",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (center: LearningCenter) => {
    setEditingCenter(center);
    setFormData({
      name: center.name,
      address: center.address,
      district: center.district,
      phone: center.phone,
      image: center.image,
      description: center.description,
      rating: center.rating,
      lat: String(center.lat),
      lng: String(center.lng),
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData((prev) => ({ ...prev, image: base64 }));
      } catch (err) {
        console.error("Base64 error", err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLat = parseFloat(formData.lat);
    const parsedLng = parseFloat(formData.lng);
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      alert("Latitude va Longitude to'g'ri son bo'lishi kerak!");
      return;
    }
    const submitData = {
      ...formData,
      lat: parsedLat,
      lng: parsedLng,
    };
    if (editingCenter) {
      updateCenter(editingCenter.id, submitData);
    } else {
      addCenter({
        ...submitData,
        createdBy: currentAdmin?.id,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (isManager) {
      alert("Menejerlar o'quv markazni o'chira olmaydi!");
      return;
    }
    if (confirm("Haqiqatan ham ushbu markazni o'chirmoqchimisiz?")) {
      deleteCenter(id);
    }
  };

  const userCenters = isSuperAdmin
    ? centers
    : isManager && currentAdmin.centerId
    ? centers.filter((c) => c.id === currentAdmin.centerId)
    : centers.filter((c) => c.createdBy === currentAdmin.id || (currentAdmin.centerId && c.id === currentAdmin.centerId));

  const filteredCenters = userCenters.filter((c) => {
    const matchesDistrict =
      selectedDistrict === "Barchasi" || c.district === selectedDistrict;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {isManager ? "Mening O'quv Markazim" : "O'quv Markazlarni Boshqarish"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isManager
              ? "O'quv markazingiz ma'lumotlari, manzili va tavsifini tahrirlang"
              : "Qashqadaryodagi ta'lim maskanlarini qo'shish, tahrirlash va o'chirish"}
          </p>
        </div>
        {!isManager && (
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Markaz Qo'shish</span>
          </button>
        )}
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4 transition-colors">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Markaz nomi yoki manzil bo'yicha..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none w-full sm:w-auto"
        >
          <option value="Barchasi">Barcha tumanlar</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Center Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.map((center) => (
          <div
            key={center.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="h-44 w-full relative bg-slate-100 dark:bg-slate-800">
                <img
                  src={center.image}
                  alt={center.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-brand-700 dark:text-brand-300 font-extrabold text-[11px] rounded-lg shadow-sm">
                  {center.district}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-xs rounded-md shadow-sm">
                  ★ {center.rating}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {center.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span className="line-clamp-1">{center.address}</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {center.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{center.phone}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {center.viewsCount} ko'rilgan
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(center)}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(center.id)}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Center Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold">
                  {editingCenter
                    ? "Markazni tahrirlash"
                    : "Yangi O'quv Markaz Qo'shish"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Markaz Nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Masalan: Sfera Academy"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Tuman *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          district: e.target.value as District,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none"
                    >
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Telefon raqami *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+998 90 123 45 67"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Aniq Manzil *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Qarshi shahar, Mustaqillik ko'chasi 45-uy"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Base64 Image Upload / Preview */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Rasm (Upload or URL) *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 dark:file:bg-slate-800 file:text-brand-700 dark:file:text-brand-300"
                    />
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-[11px]"
                    />
                    {formData.image && (
                      <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Batafsil Tavsif
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Markaz haqida umumiy ma'lumot..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Latitude
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.lat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lat: e.target.value,
                        })
                      }
                      placeholder="38.8605"
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Longitude
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.lng}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lng: e.target.value,
                        })
                      }
                      placeholder="65.7891"
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Reyting - faqat super_admin uchun */}
                {isSuperAdmin && (
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Reyting (1–5)
                      <span className="ml-2 text-[10px] font-normal text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Faqat Super Admin</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: parseFloat(e.target.value) || formData.rating,
                        })
                      }
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Odatda reyting foydalanuvchi sharhlari asosida avtomatik hisoblanadi.</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  {editingCenter ? "Saqlash" : "Qo'shish"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
