"use client";

import { LearningCenter, Course, Teacher } from "@/types";
import { useEduStore } from "@/store/useEduStore";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import {
  X,
  MapPin,
  Phone,
  Star,
  Eye,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import CourseTeacherModal from "./CourseTeacherModal";

interface CenterDetailModalProps {
  center: LearningCenter | null;
  onClose: () => void;
}

export default function CenterDetailModal({
  center,
  onClose,
}: CenterDetailModalProps) {
  const courses = useEduStore((state) => state.courses);
  const teachers = useEduStore((state) => state.teachers);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  if (!center) return null;

  const centerCourses = courses.filter((c) => c.centerId === center.id);

  const getTeacher = (teacherId: string): Teacher | undefined => {
    return teachers.find((t) => t.id === teacherId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col transition-colors border border-slate-200 dark:border-slate-800"
        >
          {/* Header Banner */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-900 shrink-0">
            <img
              src={center.image}
              alt={center.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Header Info */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-full">
                  {center.district} tumani
                </span>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{center.rating} reyting</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-300 font-medium px-2 py-1 bg-black/40 rounded-full backdrop-blur-md">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{center.viewsCount} ko'rishlar</span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">{center.name}</h2>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm mt-1">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{center.address}</span>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
            {/* Description & Quick Call */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="md:col-span-2">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                  O'quv markaz haqida
                </h4>
                <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                  {center.description}
                </p>
              </div>
              <div className="flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-4 md:pt-0 md:pl-6">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">
                    Bog'lanish uchun:
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {center.phone}
                  </span>
                </div>
                <a
                  href={`tel:${center.phone.replace(/\s+/g, "")}`}
                  className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 transition"
                >
                  <Phone className="w-4 h-4" />
                  Qo'ng'iroq qilish
                </a>
              </div>
            </div>

            {/* Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    <span>Mavjud kurslar</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    O'zingizga mos yo'nalishdagi kurs va o'qituvchi bilan tanishing
                  </p>
                </div>
                <span className="px-3 py-1 bg-brand-100 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300 text-xs font-bold rounded-full">
                  {centerCourses.length} ta kurs
                </span>
              </div>

              {centerCourses.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Hozircha bu markazda kurslar kiritilmagan.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {centerCourses.map((course) => {
                    const teacher = getTeacher(course.teacherId);

                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className="group cursor-pointer bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 hover:shadow-lg transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-[11px] font-extrabold rounded-md">
                              {course.direction}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                              {course.level}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-base mb-2">
                            {course.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                            {course.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {teacher && (
                              <img
                                src={teacher.photo}
                                alt={teacher.name}
                                className="w-7 h-7 rounded-full object-cover border border-brand-200 dark:border-slate-600"
                              />
                            )}
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">
                                Ustoz:
                              </span>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {teacher ? teacher.name : "Biriktirilmagan"}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">
                              Davomiyligi: {course.duration}
                            </span>
                            <span className="text-xs font-black text-brand-600 dark:text-brand-400">
                              {formatPrice(course.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Course & Teacher Profile Detail Modal */}
        {selectedCourse && (
          <CourseTeacherModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
          />
        )}
      </div>
    </AnimatePresence>
  );
}
