import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  LearningCenter,
  Course,
  Teacher,
  Stats,
  District,
  Direction,
  Feedback,
} from "@/types";
import {
  initialCenters,
  initialCourses,
  initialTeachers,
  initialStats,
  initialFeedbacks,
} from "@/data/mockData";

interface EduState {
  centers: LearningCenter[];
  courses: Course[];
  teachers: Teacher[];
  feedbacks: Feedback[];
  stats: Stats;

  // Theme State
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Filter & Search States
  searchQuery: string;
  selectedDistrict: District | "Barchasi";
  selectedDirection: Direction | "Barchasi";

  // Auth State
  isAdminLoggedIn: boolean;

  // Actions - Theme
  setTheme: (theme: "light" | "dark") => void;

  // Actions - Filters
  setSearchQuery: (query: string) => void;
  setSelectedDistrict: (district: District | "Barchasi") => void;
  setSelectedDirection: (direction: Direction | "Barchasi") => void;
  resetFilters: () => void;

  // Actions - Tracking & Visitors
  trackSearch: (query: string) => void;
  incrementCenterView: (centerId: string) => void;
  trackDirectionView: (direction: string) => void;
  incrementTotalVisitors: () => void;

  // Actions - Feedback & Rating
  addFeedback: (
    feedback: Omit<Feedback, "id" | "createdAt">
  ) => void;
  deleteFeedback: (id: string) => void;

  // Actions - Admin Auth
  login: (username: string, pass: string) => boolean;
  logout: () => void;

  // Actions - CRUD Centers
  addCenter: (
    center: Omit<LearningCenter, "id" | "viewsCount" | "createdAt">
  ) => void;
  updateCenter: (id: string, data: Partial<LearningCenter>) => void;
  deleteCenter: (id: string) => void;

  // Actions - CRUD Courses
  addCourse: (course: Omit<Course, "id">) => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Actions - CRUD Teachers
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
}

export const useEduStore = create<EduState>()(
  persist(
    (set, get) => ({
      centers: initialCenters,
      courses: initialCourses,
      teachers: initialTeachers,
      feedbacks: initialFeedbacks,
      stats: initialStats,

      theme: "light",
      toggleTheme: () => {
        const nextTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: nextTheme });
      },
      setTheme: (theme) => set({ theme }),

      searchQuery: "",
      selectedDistrict: "Barchasi",
      selectedDirection: "Barchasi",

      isAdminLoggedIn: false,

      setSearchQuery: (query) => {
        set({ searchQuery: query });
        if (query.trim().length > 1) {
          get().trackSearch(query.trim());
        }
      },

      setSelectedDistrict: (district) => set({ selectedDistrict: district }),
      setSelectedDirection: (direction) => {
        set({ selectedDirection: direction });
        if (direction !== "Barchasi") {
          get().trackDirectionView(direction);
        }
      },

      resetFilters: () =>
        set({
          searchQuery: "",
          selectedDistrict: "Barchasi",
          selectedDirection: "Barchasi",
        }),

      trackSearch: (query) => {
        set((state) => {
          const lower = query.toLowerCase();
          const existingIndex = state.stats.searchLogs.findIndex(
            (log) => log.query.toLowerCase() === lower
          );
          const updatedLogs = [...state.stats.searchLogs];

          if (existingIndex >= 0) {
            updatedLogs[existingIndex] = {
              ...updatedLogs[existingIndex],
              count: updatedLogs[existingIndex].count + 1,
            };
          } else {
            updatedLogs.push({ query, count: 1 });
          }

          return {
            stats: {
              ...state.stats,
              searchLogs: updatedLogs,
            },
          };
        });
      },

      incrementCenterView: (centerId) => {
        set((state) => {
          const updatedCenters = state.centers.map((c) =>
            c.id === centerId ? { ...c, viewsCount: c.viewsCount + 1 } : c
          );

          const existingIndex = state.stats.centerViews.findIndex(
            (cv) => cv.centerId === centerId
          );
          const updatedCenterViews = [...state.stats.centerViews];

          if (existingIndex >= 0) {
            updatedCenterViews[existingIndex] = {
              ...updatedCenterViews[existingIndex],
              count: updatedCenterViews[existingIndex].count + 1,
            };
          } else {
            updatedCenterViews.push({ centerId, count: 1 });
          }

          return {
            centers: updatedCenters,
            stats: {
              ...state.stats,
              centerViews: updatedCenterViews,
            },
          };
        });
      },

      trackDirectionView: (direction) => {
        set((state) => {
          const existingIndex = state.stats.directionViews.findIndex(
            (dv) => dv.direction === direction
          );
          const updatedDirectionViews = [...state.stats.directionViews];

          if (existingIndex >= 0) {
            updatedDirectionViews[existingIndex] = {
              ...updatedDirectionViews[existingIndex],
              count: updatedDirectionViews[existingIndex].count + 1,
            };
          } else {
            updatedDirectionViews.push({ direction, count: 1 });
          }

          return {
            stats: {
              ...state.stats,
              directionViews: updatedDirectionViews,
            },
          };
        });
      },

      incrementTotalVisitors: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            totalVisitors: (state.stats.totalVisitors || 0) + 1,
          },
        }));
      },

      // Feedback & Rating Recalculation
      addFeedback: (fbData) => {
        const newFb: Feedback = {
          ...fbData,
          id: "fb-" + Date.now(),
          createdAt: new Date().toISOString().split("T")[0],
        };

        set((state) => {
          const newFeedbacks = [newFb, ...state.feedbacks];

          // Recalculate average rating for the target center
          const centerFeedbacks = newFeedbacks.filter(
            (f) => f.centerId === fbData.centerId
          );

          let newAvgRating = 4.8;
          if (centerFeedbacks.length > 0) {
            const sum = centerFeedbacks.reduce((acc, f) => acc + f.rating, 0);
            newAvgRating = parseFloat((sum / centerFeedbacks.length).toFixed(1));
          }

          const updatedCenters = state.centers.map((c) =>
            c.id === fbData.centerId ? { ...c, rating: newAvgRating } : c
          );

          return {
            feedbacks: newFeedbacks,
            centers: updatedCenters,
          };
        });
      },

      deleteFeedback: (id) => {
        set((state) => {
          const targetFb = state.feedbacks.find((f) => f.id === id);
          const newFeedbacks = state.feedbacks.filter((f) => f.id !== id);

          if (!targetFb) return { feedbacks: newFeedbacks };

          // Recalculate rating
          const centerFeedbacks = newFeedbacks.filter(
            (f) => f.centerId === targetFb.centerId
          );

          let newAvgRating = 4.8;
          if (centerFeedbacks.length > 0) {
            const sum = centerFeedbacks.reduce((acc, f) => acc + f.rating, 0);
            newAvgRating = parseFloat((sum / centerFeedbacks.length).toFixed(1));
          }

          const updatedCenters = state.centers.map((c) =>
            c.id === targetFb.centerId ? { ...c, rating: newAvgRating } : c
          );

          return {
            feedbacks: newFeedbacks,
            centers: updatedCenters,
          };
        });
      },

      login: (username, password) => {
        if (username === "admin" && password === "1234") {
          set({ isAdminLoggedIn: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAdminLoggedIn: false }),

      // CRUD Operations
      addCenter: (centerData) => {
        const newCenter: LearningCenter = {
          ...centerData,
          id: "center-" + Date.now(),
          viewsCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ centers: [newCenter, ...state.centers] }));
      },

      updateCenter: (id, data) => {
        set((state) => ({
          centers: state.centers.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCenter: (id) => {
        set((state) => ({
          centers: state.centers.filter((c) => c.id !== id),
          courses: state.courses.filter((c) => c.centerId !== id),
          teachers: state.teachers.filter((t) => t.centerId !== id),
          feedbacks: state.feedbacks.filter((f) => f.centerId !== id),
        }));
      },

      addCourse: (courseData) => {
        const newCourse: Course = {
          ...courseData,
          id: "course-" + Date.now(),
        };
        set((state) => ({ courses: [newCourse, ...state.courses] }));
      },

      updateCourse: (id, data) => {
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
        }));
      },

      addTeacher: (teacherData) => {
        const newTeacher: Teacher = {
          ...teacherData,
          id: "teacher-" + Date.now(),
        };
        set((state) => ({ teachers: [newTeacher, ...state.teachers] }));
      },

      updateTeacher: (id, data) => {
        set((state) => ({
          teachers: state.teachers.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }));
      },

      deleteTeacher: (id) => {
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
          courses: state.courses.map((c) =>
            c.teacherId === id ? { ...c, teacherId: "" } : c
          ),
        }));
      },
    }),
    {
      name: "eduqash_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
