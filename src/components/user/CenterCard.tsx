"use client";

import { memo } from "react";
import { LearningCenter } from "@/types";
import { useEduStore } from "@/store/useEduStore";
import { motion } from "framer-motion";
import { MapPin, Star, Eye, BookOpen, ChevronRight } from "lucide-react";

interface CenterCardProps {
  center: LearningCenter;
  onSelect: (center: LearningCenter) => void;
}

const CenterCard = memo(function CenterCard({ center, onSelect }: CenterCardProps) {
  const coursesCount = useEduStore(
    (state) => state.courses.filter((c) => c.centerId === center.id).length
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelect(center)}
      className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-500 transition-all flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={center.image}
          alt={center.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-brand-700 dark:text-brand-300 shadow-sm border border-brand-100 dark:border-slate-700">
            {center.district}
          </span>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-md">
            <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>{center.rating}</span>
          </div>
        </div>

        {/* Bottom Views */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-white/90 font-medium">
          <Eye className="w-3.5 h-3.5 text-white" />
          <span>{center.viewsCount} ko'rilgan</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug mb-2">
            {center.name}
          </h3>
          <div className="flex items-start text-slate-500 dark:text-slate-400 text-xs gap-1.5 mb-3">
            <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">{center.address}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 mb-4">
            {center.description}
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-lg">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kurslar soni: {coursesCount} ta</span>
          </div>
          <div className="flex items-center text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
            <span>Batafsil</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default CenterCard;
