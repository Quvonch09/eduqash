"use client";

import { useState, useMemo, useEffect } from "react";
import { useEduStore } from "@/store/useEduStore";
import { LearningCenter, District, Direction } from "@/types";
import Navbar from "@/components/user/Navbar";
import CenterCard from "@/components/user/CenterCard";
import CenterDetailModal from "@/components/user/CenterDetailModal";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Sparkles,
  LayoutGrid,
  Map as MapIcon,
  SlidersHorizontal,
  X,
  Building2,
  Users,
  Award,
  GraduationCap,
  MessageSquare,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

// Dynamic import for Leaflet map component to prevent SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/user/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">
        <MapPin className="w-8 h-8 mr-2 text-brand-600 animate-bounce" />
        <span className="font-semibold text-xs sm:text-sm">Xarita yuklanmoqda...</span>
      </div>
    ),
  }
);

const DISTRICTS: (District | "Barchasi")[] = [
  "Barchasi",
  "Qarshi",
  "Shahrisabz",
  "Kitob",
  "Koson",
  "Yakkabog'",
  "Chiroqchi",
];

const POPULAR_TAGS: Direction[] = [
  "IT",
  "Ingliz tili",
  "Matematika",
  "Robototexnika",
  "Biologiya",
  "Fizika",
  "Rus tili",
  "Arab tili",
];

export default function LandingPage() {
  const centers = useEduStore((state) => state.centers);
  const courses = useEduStore((state) => state.courses);
  const feedbacks = useEduStore((state) => state.feedbacks);
  const stats = useEduStore((state) => state.stats);
  const searchQuery = useEduStore((state) => state.searchQuery);
  const setSearchQuery = useEduStore((state) => state.setSearchQuery);
  const selectedDistrict = useEduStore((state) => state.selectedDistrict);
  const setSelectedDistrict = useEduStore((state) => state.setSelectedDistrict);
  const incrementCenterView = useEduStore((state) => state.incrementCenterView);
  const trackDirectionView = useEduStore((state) => state.trackDirectionView);
  const trackSearch = useEduStore((state) => state.trackSearch);
  const incrementTotalVisitors = useEduStore((state) => state.incrementTotalVisitors);

  const [selectedCenter, setSelectedCenter] = useState<LearningCenter | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "map" | "split">("split");

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local search when global searchQuery changes (e.g. tag clicked or filters cleared)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search query updates to the global store
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, setSearchQuery]);

  // Track site visitor session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("eduqash_visited");
      if (!hasVisited) {
        sessionStorage.setItem("eduqash_visited", "true");
        incrementTotalVisitors();
      }
    }
  }, [incrementTotalVisitors]);

  // Pre-calculate courses data and counts per center for lightning-fast search lookup
  const coursesDataByCenterMap = useMemo(() => {
    const searchMap = new Map<string, string[]>();
    const countMap = new Map<string, number>();

    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];

      const existingSearch = searchMap.get(c.centerId) || [];
      existingSearch.push(`${c.name.toLowerCase()} ${c.direction.toLowerCase()} ${c.level.toLowerCase()}`);
      searchMap.set(c.centerId, existingSearch);

      const currentCount = countMap.get(c.centerId) || 0;
      countMap.set(c.centerId, currentCount + 1);
    }
    return { searchMap, countMap };
  }, [courses]);

  const coursesByCenterMap = coursesDataByCenterMap.searchMap;
  const coursesCountMap = coursesDataByCenterMap.countMap;

  // Real-time filtering based on searchQuery, district & course directions
  const filteredCenters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return centers.filter((center) => {
      const matchesDistrict =
        selectedDistrict === "Barchasi" || center.district === selectedDistrict;

      if (!matchesDistrict) return false;
      if (!q) return true;

      const nameMatch = center.name.toLowerCase().includes(q);
      const addressMatch = center.address.toLowerCase().includes(q);
      const districtMatch = center.district.toLowerCase().includes(q);
      if (nameMatch || addressMatch || districtMatch) return true;

      const centerCoursesText = coursesByCenterMap.get(center.id);
      if (centerCoursesText) {
        for (let i = 0; i < centerCoursesText.length; i++) {
          if (centerCoursesText[i].includes(q)) return true;
        }
      }

      return false;
    });
  }, [centers, coursesByCenterMap, searchQuery, selectedDistrict]);

  const handleSelectCenter = (center: LearningCenter) => {
    incrementCenterView(center.id);
    setSelectedCenter(center);
  };

  const handleTagClick = (tag: Direction) => {
    setLocalSearch(tag);
    setSearchQuery(tag);
    trackSearch(tag);
    trackDirectionView(tag);
  };

  const totalVisitors = stats.totalVisitors || 1420;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://eduqash.uz/#website",
        "url": "https://eduqash.uz",
        "name": "Eduqash.uz — Qashqadaryo O'quv Markazlari Qidiruv Platformasi",
        "description": "Qashqadaryo viloyati o'quv markazlari, IT, IELTS va maktab fanlari kurslari qidiruv xizmati.",
        "inLanguage": "uz-UZ",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://eduqash.uz/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://eduqash.uz/#organization",
        "name": "Eduqash Platformasi",
        "url": "https://eduqash.uz",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Qarshi",
          "addressRegion": "Qashqadaryo",
          "addressCountry": "UZ",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-blue-900 text-white pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 border border-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Qashqadaryo viloyati bo'yicha yagona ta'lim platformasi</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
          >
            Qashqadaryoda o'z <span className="text-amber-400">yo'nalishingizni</span> toping
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed px-2"
          >
            Qarshi, Shahrisabz, Kitob, Koson va boshqa tumanlardagi eng nufuzli o'quv markazlari hamda malakali ustozlarni oson toping.
          </motion.p>

          {/* Dynamic Platform Counter Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-200 pt-2"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{totalVisitors} ta tashrif buyuruvchi</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>{feedbacks.length} ta izoh va fikr-mulohaza</span>
            </div>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mt-6 sm:mt-8"
          >
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-2 sm:p-3 shadow-2xl border border-white/20 dark:border-slate-800 flex items-center gap-2">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 dark:text-brand-400 ml-2 sm:ml-3 shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Yo'nalish kiriting, masalan: IT, Ingliz tili, Matematika..."
                className="w-full bg-transparent text-slate-900 dark:text-white font-medium placeholder-slate-400 text-xs sm:text-base focus:outline-none px-1 sm:px-2 py-1"
              />
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch("");
                    setSearchQuery("");
                  }}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <div className="hidden sm:block">
                <button
                  onClick={() => {
                    if (localSearch.trim()) {
                      setSearchQuery(localSearch);
                      trackSearch(localSearch.trim());
                    }
                  }}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-brand-600/30"
                >
                  Qidirish
                </button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 text-xs font-semibold text-slate-200">
              <span className="text-amber-300 font-bold text-[11px] sm:text-xs">Ommabop yo'nalishlar:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] sm:text-xs transition ${
                    searchQuery.toLowerCase() === tag.toLowerCase()
                      ? "bg-amber-400 text-slate-950 border-amber-400 font-bold"
                      : "bg-white/10 hover:bg-white/20 text-white border-white/15"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full space-y-6 sm:space-y-8">
        {/* District Filter & View Options Header */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
          {/* District Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Tuman:
            </span>
            {DISTRICTS.map((district) => (
              <button
                key={district}
                onClick={() => setSelectedDistrict(district)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedDistrict === district
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {district}
              </button>
            ))}
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Karta</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "split"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Aralash</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "map"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Xarita</span>
            </button>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">
          <div>
            Topilgan markazlar:{" "}
            <span className="text-brand-600 dark:text-brand-400 font-extrabold">
              {filteredCenters.length} ta
            </span>
          </div>
          {(searchQuery || selectedDistrict !== "Barchasi") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDistrict("Barchasi");
              }}
              className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Filtrlarni tozalash
            </button>
          )}
        </div>

        {/* Content Layout according to View Mode */}
        {filteredCenters.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-xl mx-auto shadow-sm transition-colors">
            <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Ushbu qidiruv bo'yicha o'quv markaz topilmadi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Iltimos, boshqa kalit so'z yoki barcha tumanlar bo'yicha qayta qidirib ko'ring.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDistrict("Barchasi");
              }}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Barcha markazlarni ko'rish
            </button>
          </div>
        ) : (
          <>
            {/* GRID ONLY VIEW */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCenters.map((center) => (
                  <CenterCard
                    key={center.id}
                    center={center}
                    coursesCount={coursesCountMap.get(center.id) || 0}
                    onSelect={handleSelectCenter}
                  />
                ))}
              </div>
            )}

            {/* MAP ONLY VIEW */}
            {viewMode === "map" && (
              <div className="h-[500px] sm:h-[600px] w-full">
                <InteractiveMap
                  centers={filteredCenters}
                  onSelectCenter={handleSelectCenter}
                />
              </div>
            )}

            {/* SPLIT VIEW (Cards + Map side by side) */}
            {viewMode === "split" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredCenters.map((center) => (
                    <CenterCard
                      key={center.id}
                      center={center}
                      coursesCount={coursesCountMap.get(center.id) || 0}
                      onSelect={handleSelectCenter}
                    />
                  ))}
                </div>
                <div className="hidden lg:block lg:col-span-5 sticky top-28 h-[580px]">
                  <InteractiveMap
                    centers={filteredCenters}
                    onSelectCenter={handleSelectCenter}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Feature Highlights Section */}
        <section className="mt-12 sm:mt-16 bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-3xl p-6 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-left">
            <div className="space-y-2 sm:space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mx-auto md:mx-0 shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-base sm:text-lg font-bold">Tekshirilgan O'quv Markazlari</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Qashqadaryodagi nufuzli va barcha qulayliklarga ega o'quv markazlari katalogi.
              </p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold mx-auto md:mx-0 shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base sm:text-lg font-bold">Tajribali O'qituvchilar</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Xalqaro sertifikatlarga va yillik tajribaga ega ustozlarning natijalari bilan tanishing.
              </p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold mx-auto md:mx-0 shadow-lg">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base sm:text-lg font-bold">To'g'ridan-to'g me Bog'lanish</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Telefon va Telegram orqali o'quv markaz hamda ustozlar bilan bevosita muloqot qiling.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 sm:mt-20 py-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Eduqash Platformasi © 2026
            </span>
          </div>
          <span>Qashqadaryo viloyati o'quv markazlari qidiruv xizmati</span>
        </div>
      </footer>

      {/* Center Detail Modal */}
      {selectedCenter && (
        <CenterDetailModal
          center={selectedCenter}
          onClose={() => setSelectedCenter(null)}
        />
      )}
    </div>
  );
}
