"use client";

import { useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import { Course, Direction } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Search,
  Clock,
  User,
  Building2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DIRECTIONS: Direction[] = [
  "IT",
  "Ingliz tili",
  "Matematika",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Ona tili",
  "Arab tili",
  "Rus tili",
  "Robototexnika",
];

const LEVELS: ("Boshlang'ich" | "O'rta" | "Yuqori" | "Barchaga mos")[] = [
  "Boshlang'ich",
  "O'rta",
  "Yuqori",
  "Barchaga mos",
];

export default function AdminCoursesPage() {
  const courses = useEduStore((state) => state.courses);
  const centers = useEduStore((state) => state.centers);
  const teachers = useEduStore((state) => state.teachers);
  const addCourse = useEduStore((state) => state.addCourse);
  const updateCourse = useEduStore((state) => state.updateCourse);
  const deleteCourse = useEduStore((state) => state.deleteCourse);

  const [search, setSearch] = useState("");
  const [selectedCenterId, setSelectedCenterId] = useState<string>("Barchasi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    centerId: centers[0]?.id || "",
    direction: "IT" as Direction,
    price: 500000,
    duration: "6 oy",
    teacherId: teachers[0]?.id || "",
    description: "",
    level: "Barchaga mos" as any,
  });

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormData({
      name: "",
      centerId: centers[0]?.id || "",
      direction: "IT",
      price: 500000,
      duration: "6 oy",
      teacherId: teachers[0]?.id || "",
      description: "",
      level: "Barchaga mos",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      centerId: course.centerId,
      direction: course.direction,
      price: course.price,
      duration: course.duration,
      teacherId: course.teacherId,
      description: course.description,
      level: course.level,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, formData);
    } else {
      addCourse(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Ushbu kursni o'chirmoqchimisiz?")) {
      deleteCourse(id);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesCenter =
      selectedCenterId === "Barchasi" || c.centerId === selectedCenterId;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.direction.toLowerCase().includes(search.toLowerCase());
    return matchesCenter && matchesSearch;
  });

  const getCenterName = (centerId: string) => {
    return centers.find((c) => c.id === centerId)?.name || "Noma'lum markaz";
  };

  const getTeacherName = (teacherId: string) => {
    return teachers.find((t) => t.id === teacherId)?.name || "Biriktirilmagan";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Kurslarni Boshqarish
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Barcha o'quv markazlarining kurslarini yaratish va tahrirlash
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kurs Qo'shish</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurs nomi yoki yo'nalishi bo'yicha..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={selectedCenterId}
          onChange={(e) => setSelectedCenterId(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="Barchasi">Barcha markazlar</option>
          {centers.map((center) => (
            <option key={center.id} value={center.id}>
              {center.name}
            </option>
          ))}
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-extrabold rounded-md">
                  {course.direction}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md">
                  {course.level}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-2">
                {course.name}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="font-semibold text-slate-700">
                    {getCenterName(course.centerId)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Ustoz: {getTeacherName(course.teacherId)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Davomiyligi: {course.duration}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="font-black text-brand-600 text-sm">
                {formatPrice(course.price)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(course)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
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
                  {editingCourse ? "Kursni Tahrirlash" : "Yangi Kurs Qo'shish"}
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
                    Kurs Nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Masalan: Fullstack Web Dasturlash"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      O'quv Markaz *
                    </label>
                    <select
                      value={formData.centerId}
                      onChange={(e) =>
                        setFormData({ ...formData, centerId: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Yo'nalish *
                    </label>
                    <select
                      value={formData.direction}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          direction: e.target.value as Direction,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                    >
                      {DIRECTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Narxi (so'm/oy) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Davomiyligi *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="6 oy"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Daraja *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value as any })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Dars beruvchi Ustoz
                  </label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) =>
                      setFormData({ ...formData, teacherId: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  >
                    <option value="">Biriktirilmagan</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.experience})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Kurs Tavsifi
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Kurs mazmuni va o'rganiladigan bilimlar..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  {editingCourse ? "Saqlash" : "Qo'shish"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
