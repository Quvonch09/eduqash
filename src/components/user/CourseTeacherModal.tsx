"use client";

import { Course, Teacher } from "@/types";
import { useEduStore } from "@/store/useEduStore";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Phone,
  Send,
  Award,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface CourseTeacherModalProps {
  course: Course;
  onClose: () => void;
}

export default function CourseTeacherModal({
  course,
  onClose,
}: CourseTeacherModalProps) {
  const teachers = useEduStore((state) => state.teachers);
  const teacher = teachers.find((t) => t.id === course.teacherId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden z-20 my-8 border border-slate-200 dark:border-slate-800 transition-colors"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-blue-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-xs font-black rounded-md">
                {course.direction}
              </span>
              <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-md backdrop-blur-sm">
                {course.level} daraja
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black">{course.name}</h3>
            <div className="flex items-center gap-4 mt-3 text-xs sm:text-sm font-medium text-blue-100">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Davomiyligi: {course.duration}</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-amber-300">
                <span>{formatPrice(course.price)}</span>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Course Description */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                Kurs tavsifi
              </h4>
              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                {course.description}
              </p>
            </div>

            {/* Teacher Profile Section */}
            {teacher ? (
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/80 dark:to-slate-800/40 p-6 rounded-2xl border border-brand-100 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Dars beruvchi ustoz</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-400 shadow-md shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {teacher.name}
                      </h4>
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-extrabold rounded-md">
                        {teacher.experience} tajriba
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                      {teacher.bio}
                    </p>
                  </div>
                </div>

                {/* Achievements List */}
                {teacher.results && teacher.results.length > 0 && (
                  <div className="pt-2">
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Erishgan natijalari va shogirdlari:</span>
                    </h5>
                    <div className="space-y-1.5">
                      {teacher.results.map((res, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Action Buttons */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center gap-3">
                  {teacher.contact.phone && (
                    <a
                      href={`tel:${teacher.contact.phone.replace(/\s+/g, "")}`}
                      className="flex-1 min-w-[140px] py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Phone className="w-4 h-4" />
                      Qo'ng'iroq qilish
                    </a>
                  )}

                  {teacher.contact.telegram && (
                    <a
                      href={`https://t.me/${teacher.contact.telegram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[140px] py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      Telegram orqali yozish
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium">
                Ushbu kursga hali tayinlangan ustoz biriktirilmagan.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
