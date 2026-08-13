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
  AdminUser,
} from "@/types";
import {
  initialCenters,
  initialCourses,
  initialTeachers,
  initialStats,
  initialFeedbacks,
  initialAdmins,
} from "@/data/mockData";
import { supabase } from "@/lib/supabaseClient";

interface EduState {
  centers: LearningCenter[];
  courses: Course[];
  teachers: Teacher[];
  feedbacks: Feedback[];
  stats: Stats;
  admins: AdminUser[];
  currentAdmin: AdminUser | null;

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
  trackSearch: (query: string) => Promise<void>;
  incrementCenterView: (centerId: string) => Promise<void>;
  trackDirectionView: (direction: string) => Promise<void>;
  incrementTotalVisitors: () => Promise<void>;

  // Actions - Feedback & Rating
  addFeedback: (
    feedback: Omit<Feedback, "id" | "createdAt">
  ) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;

  // Actions - Admin Auth & Roles
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;

  // Actions - CRUD Admins
  addAdmin: (admin: Omit<AdminUser, "id" | "createdAt">) => Promise<void>;
  updateAdmin: (id: string, data: Partial<AdminUser>) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;

  // Actions - CRUD Centers
  addCenter: (
    center: Omit<LearningCenter, "id" | "viewsCount" | "createdAt">
  ) => Promise<void>;
  updateCenter: (id: string, data: Partial<LearningCenter>) => Promise<void>;
  deleteCenter: (id: string) => Promise<void>;

  // Actions - CRUD Courses
  addCourse: (course: Omit<Course, "id">) => Promise<void>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  // Actions - CRUD Teachers
  addTeacher: (teacher: Omit<Teacher, "id">) => Promise<void>;
  updateTeacher: (id: string, data: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;

  // Actions - Fetch Data from Supabase
  fetchData: () => Promise<void>;
}

export const useEduStore = create<EduState>()(
  persist(
    (set, get) => ({
      centers: initialCenters,
      courses: initialCourses,
      teachers: initialTeachers,
      feedbacks: initialFeedbacks,
      stats: initialStats,
      admins: initialAdmins,
      currentAdmin: null,

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

      setSearchQuery: (query) => set({ searchQuery: query }),

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

      fetchData: async () => {
        try {
          const [
            { data: centers },
            { data: courses },
            { data: teachers },
            { data: feedbacks },
            { data: admins },
            { data: searchLogs },
            { data: centerViews },
            { data: directionViews },
            { data: statsGeneral },
          ] = await Promise.all([
            supabase.from("learning_centers").select("*"),
            supabase.from("courses").select("*"),
            supabase.from("teachers").select("*"),
            supabase.from("feedbacks").select("*"),
            supabase.from("admins").select("*"),
            supabase.from("search_logs").select("*"),
            supabase.from("center_views").select("*"),
            supabase.from("direction_views").select("*"),
            supabase.from("stats_general").select("*"),
          ]);

          const totalVisitorsLog = statsGeneral?.find(
            (s) => s.key === "total_visitors"
          );

          set({
            centers: (centers || []).map((c) => ({
              id: c.id,
              name: c.name,
              address: c.address,
              district: c.district as District,
              phone: c.phone,
              image: c.image,
              description: c.description,
              rating: Number(c.rating),
              viewsCount: c.views_count || 0,
              lat: c.lat,
              lng: c.lng,
              createdAt: c.created_at,
              createdBy: c.created_by,
            })),
            courses: (courses || []).map((c) => ({
              id: c.id,
              centerId: c.center_id,
              direction: c.direction as Direction,
              name: c.name,
              price: Number(c.price),
              duration: c.duration,
              teacherId: c.teacher_id,
              description: c.description,
              level: c.level as any,
            })),
            teachers: (teachers || []).map((t) => ({
              id: t.id,
              centerId: t.center_id,
              name: t.name,
              photo: t.photo,
              bio: t.bio,
              experience: t.experience,
              results: t.results || [],
              contact: {
                phone: t.phone,
                telegram: t.telegram,
                instagram: t.instagram,
              },
            })),
            feedbacks: (feedbacks || []).map((f) => ({
              id: f.id,
              centerId: f.center_id,
              userName: f.user_name,
              rating: f.rating,
              comment: f.comment,
              createdAt: f.created_at,
            })),
            admins: (admins || []).map((a) => ({
              id: a.id,
              username: a.username,
              password: a.password,
              name: a.name,
              role: a.role as any,
              createdAt: a.created_at,
            })),
            stats: {
              searchLogs: (searchLogs || []).map((s) => ({
                query: s.query,
                count: s.count || 0,
              })),
              centerViews: (centerViews || []).map((c) => ({
                centerId: c.center_id,
                count: c.count || 0,
              })),
              directionViews: (directionViews || []).map((d) => ({
                direction: d.direction,
                count: d.count || 0,
              })),
              totalVisitors: totalVisitorsLog ? totalVisitorsLog.value : 1420,
            },
          });
        } catch (error) {
          console.error("Error fetching data from Supabase:", error);
        }
      },

      trackSearch: async (query) => {
        const cleanQuery = query.trim();
        if (!cleanQuery) return;

        set((state) => {
          const lower = cleanQuery.toLowerCase();
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
            updatedLogs.push({ query: cleanQuery, count: 1 });
          }

          return {
            stats: {
              ...state.stats,
              searchLogs: updatedLogs,
            },
          };
        });

        try {
          const { data: log } = await supabase
            .from("search_logs")
            .select("count")
            .eq("query", cleanQuery)
            .maybeSingle();

          if (log) {
            await supabase
              .from("search_logs")
              .update({ count: log.count + 1 })
              .eq("query", cleanQuery);
          } else {
            await supabase
              .from("search_logs")
              .insert({ query: cleanQuery, count: 1 });
          }
        } catch (error) {
          console.error("Error tracking search in Supabase:", error);
        }
      },

      incrementCenterView: async (centerId) => {
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

        try {
          const { data: center } = await supabase
            .from("learning_centers")
            .select("views_count")
            .eq("id", centerId)
            .single();

          if (center) {
            const newViews = (center.views_count || 0) + 1;
            await supabase
              .from("learning_centers")
              .update({ views_count: newViews })
              .eq("id", centerId);

            const { data: currentView } = await supabase
              .from("center_views")
              .select("count")
              .eq("center_id", centerId)
              .maybeSingle();

            if (currentView) {
              await supabase
                .from("center_views")
                .update({ count: currentView.count + 1 })
                .eq("center_id", centerId);
            } else {
              await supabase
                .from("center_views")
                .insert({ center_id: centerId, count: 1 });
            }
          }
        } catch (error) {
          console.error("Error incrementing center view in Supabase:", error);
        }
      },

      trackDirectionView: async (direction) => {
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

        try {
          const { data: view } = await supabase
            .from("direction_views")
            .select("count")
            .eq("direction", direction)
            .maybeSingle();

          if (view) {
            await supabase
              .from("direction_views")
              .update({ count: view.count + 1 })
              .eq("direction", direction);
          } else {
            await supabase
              .from("direction_views")
              .insert({ direction, count: 1 });
          }
        } catch (error) {
          console.error("Error tracking direction view in Supabase:", error);
        }
      },

      incrementTotalVisitors: async () => {
        set((state) => ({
          stats: {
            ...state.stats,
            totalVisitors: (state.stats.totalVisitors || 0) + 1,
          },
        }));

        try {
          const { data: stat } = await supabase
            .from("stats_general")
            .select("value")
            .eq("key", "total_visitors")
            .maybeSingle();

          if (stat) {
            await supabase
              .from("stats_general")
              .update({ value: stat.value + 1 })
              .eq("key", "total_visitors");
          } else {
            await supabase
              .from("stats_general")
              .insert({ key: "total_visitors", value: 1421 });
          }
        } catch (error) {
          console.error("Error incrementing total visitors in Supabase:", error);
        }
      },

      addFeedback: async (fbData) => {
        const newFbId = "fb-" + Date.now();
        const createdAtDate = new Date().toISOString().split("T")[0];

        try {
          const { error } = await supabase.from("feedbacks").insert({
            id: newFbId,
            center_id: fbData.centerId,
            user_name: fbData.userName,
            rating: fbData.rating,
            comment: fbData.comment,
            created_at: createdAtDate,
          });

          if (error) {
            console.error("Error inserting feedback in Supabase:", error);
            return;
          }

          set((state) => {
            const newFb: Feedback = {
              ...fbData,
              id: newFbId,
              createdAt: createdAtDate,
            };
            const newFeedbacks = [newFb, ...state.feedbacks];

            const centerFeedbacks = newFeedbacks.filter(
              (f) => f.centerId === fbData.centerId
            );

            let newAvgRating = 4.8;
            if (centerFeedbacks.length > 0) {
              const sum = centerFeedbacks.reduce((acc, f) => acc + f.rating, 0);
              newAvgRating = parseFloat((sum / centerFeedbacks.length).toFixed(1));
            }

            // Sync rating update to Supabase
            supabase
              .from("learning_centers")
              .update({ rating: newAvgRating })
              .eq("id", fbData.centerId)
              .then(({ error: ratingError }) => {
                if (ratingError)
                  console.error("Error updating center rating:", ratingError);
              });

            const updatedCenters = state.centers.map((c) =>
              c.id === fbData.centerId ? { ...c, rating: newAvgRating } : c
            );

            return {
              feedbacks: newFeedbacks,
              centers: updatedCenters,
            };
          });
        } catch (error) {
          console.error("Error adding feedback:", error);
        }
      },

      deleteFeedback: async (id) => {
        const targetFb = get().feedbacks.find((f) => f.id === id);
        if (!targetFb) return;

        try {
          const { error } = await supabase
            .from("feedbacks")
            .delete()
            .eq("id", id);
          if (error) {
            console.error("Error deleting feedback from Supabase:", error);
            return;
          }

          set((state) => {
            const newFeedbacks = state.feedbacks.filter((f) => f.id !== id);
            const centerFeedbacks = newFeedbacks.filter(
              (f) => f.centerId === targetFb.centerId
            );

            let newAvgRating = 4.8;
            if (centerFeedbacks.length > 0) {
              const sum = centerFeedbacks.reduce((acc, f) => acc + f.rating, 0);
              newAvgRating = parseFloat((sum / centerFeedbacks.length).toFixed(1));
            }

            // Sync rating update to Supabase
            supabase
              .from("learning_centers")
              .update({ rating: newAvgRating })
              .eq("id", targetFb.centerId)
              .then(({ error: ratingError }) => {
                if (ratingError)
                  console.error("Error updating center rating:", ratingError);
              });

            const updatedCenters = state.centers.map((c) =>
              c.id === targetFb.centerId ? { ...c, rating: newAvgRating } : c
            );

            return {
              feedbacks: newFeedbacks,
              centers: updatedCenters,
            };
          });
        } catch (error) {
          console.error("Error deleting feedback:", error);
        }
      },

      login: async (username, password) => {
        const cleanUser = username.trim().toLowerCase();
        const cleanPass = password.trim();

        try {
          const { data: foundAdmin, error } = await supabase
            .from("admins")
            .select("*")
            .eq("username", cleanUser)
            .eq("password", cleanPass)
            .maybeSingle();

          if (error) {
            console.error("Error querying admin from Supabase:", error);
          }

          if (foundAdmin) {
            const adminUser: AdminUser = {
              id: foundAdmin.id,
              username: foundAdmin.username,
              name: foundAdmin.name,
              role: foundAdmin.role as any,
              createdAt: foundAdmin.created_at,
            };
            set({ currentAdmin: adminUser, isAdminLoggedIn: true });
            return true;
          }
        } catch (error) {
          console.error("Login request failed:", error);
        }

        return false;
      },

      logout: () => set({ currentAdmin: null, isAdminLoggedIn: false }),

      addAdmin: async (adminData) => {
        const newAdmin = {
          id: "admin-" + Date.now(),
          username: adminData.username,
          password: adminData.password || "",
          name: adminData.name,
          role: adminData.role,
          created_at: new Date().toISOString().split("T")[0],
        };

        try {
          const { error } = await supabase.from("admins").insert(newAdmin);
          if (error) {
            console.error("Error inserting admin in Supabase:", error);
            return;
          }

          set((state) => ({
            admins: [
              {
                id: newAdmin.id,
                username: adminData.username,
                password: adminData.password,
                name: adminData.name,
                role: adminData.role,
                createdAt: newAdmin.created_at,
              },
              ...state.admins,
            ],
          }));
        } catch (error) {
          console.error("Error adding admin:", error);
        }
      },

      updateAdmin: async (id, data) => {
        const mappedData: any = {};
        if (data.username !== undefined) mappedData.username = data.username;
        if (data.password !== undefined) mappedData.password = data.password;
        if (data.name !== undefined) mappedData.name = data.name;
        if (data.role !== undefined) mappedData.role = data.role;

        try {
          const { error } = await supabase
            .from("admins")
            .update(mappedData)
            .eq("id", id);

          if (error) {
            console.error("Error updating admin in Supabase:", error);
            return;
          }

          set((state) => ({
            admins: state.admins.map((a) => (a.id === id ? { ...a, ...data } : a)),
            currentAdmin:
              state.currentAdmin?.id === id
                ? { ...state.currentAdmin, ...data }
                : state.currentAdmin,
          }));
        } catch (error) {
          console.error("Error updating admin:", error);
        }
      },

      deleteAdmin: async (id) => {
        try {
          const { error } = await supabase.from("admins").delete().eq("id", id);
          if (error) {
            console.error("Error deleting admin from Supabase:", error);
            return;
          }

          set((state) => ({
            admins: state.admins.filter((a) => a.id !== id),
          }));
        } catch (error) {
          console.error("Error deleting admin:", error);
        }
      },

      addCenter: async (centerData) => {
        const currentAdmin = get().currentAdmin;
        const newCenterId = "center-" + Date.now();
        const createdAtDate = new Date().toISOString().split("T")[0];

        const newCenterDb = {
          id: newCenterId,
          name: centerData.name,
          address: centerData.address,
          district: centerData.district,
          phone: centerData.phone,
          image: centerData.image,
          description: centerData.description,
          rating: 5.0,
          views_count: 0,
          lat: centerData.lat,
          lng: centerData.lng,
          created_at: createdAtDate,
          created_by: currentAdmin?.id || "admin-super-1",
        };

        try {
          const { error } = await supabase
            .from("learning_centers")
            .insert(newCenterDb);
          if (error) {
            console.error("Error adding center in Supabase:", error);
            return;
          }

          set((state) => ({
            centers: [
              {
                ...centerData,
                id: newCenterId,
                rating: 5.0,
                viewsCount: 0,
                createdAt: createdAtDate,
                createdBy: newCenterDb.created_by,
              },
              ...state.centers,
            ],
          }));
        } catch (error) {
          console.error("Error adding center:", error);
        }
      },

      updateCenter: async (id, data) => {
        const mappedData: any = {};
        if (data.name !== undefined) mappedData.name = data.name;
        if (data.address !== undefined) mappedData.address = data.address;
        if (data.district !== undefined) mappedData.district = data.district;
        if (data.phone !== undefined) mappedData.phone = data.phone;
        if (data.image !== undefined) mappedData.image = data.image;
        if (data.description !== undefined)
          mappedData.description = data.description;
        if (data.rating !== undefined) mappedData.rating = data.rating;
        if (data.viewsCount !== undefined)
          mappedData.views_count = data.viewsCount;
        if (data.lat !== undefined) mappedData.lat = data.lat;
        if (data.lng !== undefined) mappedData.lng = data.lng;

        try {
          const { error } = await supabase
            .from("learning_centers")
            .update(mappedData)
            .eq("id", id);

          if (error) {
            console.error("Error updating center in Supabase:", error);
            return;
          }

          set((state) => ({
            centers: state.centers.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          }));
        } catch (error) {
          console.error("Error updating center:", error);
        }
      },

      deleteCenter: async (id) => {
        try {
          const { error } = await supabase
            .from("learning_centers")
            .delete()
            .eq("id", id);
          if (error) {
            console.error("Error deleting center from Supabase:", error);
            return;
          }

          set((state) => ({
            centers: state.centers.filter((c) => c.id !== id),
            courses: state.courses.filter((c) => c.centerId !== id),
            teachers: state.teachers.filter((t) => t.centerId !== id),
            feedbacks: state.feedbacks.filter((f) => f.centerId !== id),
          }));
        } catch (error) {
          console.error("Error deleting center:", error);
        }
      },

      addCourse: async (courseData) => {
        const newCourseId = "course-" + Date.now();
        const newCourseDb = {
          id: newCourseId,
          center_id: courseData.centerId,
          direction: courseData.direction,
          name: courseData.name,
          price: courseData.price,
          duration: courseData.duration,
          teacher_id: courseData.teacherId || null,
          description: courseData.description,
          level: courseData.level,
        };

        try {
          const { error } = await supabase.from("courses").insert(newCourseDb);
          if (error) {
            console.error("Error adding course in Supabase:", error);
            return;
          }

          set((state) => ({
            courses: [
              {
                ...courseData,
                id: newCourseId,
              },
              ...state.courses,
            ],
          }));
        } catch (error) {
          console.error("Error adding course:", error);
        }
      },

      updateCourse: async (id, data) => {
        const mappedData: any = {};
        if (data.centerId !== undefined) mappedData.center_id = data.centerId;
        if (data.direction !== undefined) mappedData.direction = data.direction;
        if (data.name !== undefined) mappedData.name = data.name;
        if (data.price !== undefined) mappedData.price = data.price;
        if (data.duration !== undefined) mappedData.duration = data.duration;
        if (data.teacherId !== undefined) mappedData.teacher_id = data.teacherId;
        if (data.description !== undefined)
          mappedData.description = data.description;
        if (data.level !== undefined) mappedData.level = data.level;

        try {
          const { error } = await supabase
            .from("courses")
            .update(mappedData)
            .eq("id", id);

          if (error) {
            console.error("Error updating course in Supabase:", error);
            return;
          }

          set((state) => ({
            courses: state.courses.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          }));
        } catch (error) {
          console.error("Error updating course:", error);
        }
      },

      deleteCourse: async (id) => {
        try {
          const { error } = await supabase.from("courses").delete().eq("id", id);
          if (error) {
            console.error("Error deleting course from Supabase:", error);
            return;
          }

          set((state) => ({
            courses: state.courses.filter((c) => c.id !== id),
          }));
        } catch (error) {
          console.error("Error deleting course:", error);
        }
      },

      addTeacher: async (teacherData) => {
        const newTeacherId = "teacher-" + Date.now();
        const newTeacherDb = {
          id: newTeacherId,
          center_id: teacherData.centerId,
          name: teacherData.name,
          photo: teacherData.photo,
          bio: teacherData.bio,
          experience: teacherData.experience,
          results: teacherData.results || [],
          phone: teacherData.contact.phone,
          telegram: teacherData.contact.telegram || null,
          instagram: teacherData.contact.instagram || null,
        };

        try {
          const { error } = await supabase.from("teachers").insert(newTeacherDb);
          if (error) {
            console.error("Error adding teacher in Supabase:", error);
            return;
          }

          set((state) => ({
            teachers: [
              {
                ...teacherData,
                id: newTeacherId,
              },
              ...state.teachers,
            ],
          }));
        } catch (error) {
          console.error("Error adding teacher:", error);
        }
      },

      updateTeacher: async (id, data) => {
        const mappedData: any = {};
        if (data.centerId !== undefined) mappedData.center_id = data.centerId;
        if (data.name !== undefined) mappedData.name = data.name;
        if (data.photo !== undefined) mappedData.photo = data.photo;
        if (data.bio !== undefined) mappedData.bio = data.bio;
        if (data.experience !== undefined)
          mappedData.experience = data.experience;
        if (data.results !== undefined) mappedData.results = data.results;
        if (data.contact?.phone !== undefined)
          mappedData.phone = data.contact.phone;
        if (data.contact?.telegram !== undefined)
          mappedData.telegram = data.contact.telegram;
        if (data.contact?.instagram !== undefined)
          mappedData.instagram = data.contact.instagram;

        try {
          const { error } = await supabase
            .from("teachers")
            .update(mappedData)
            .eq("id", id);

          if (error) {
            console.error("Error updating teacher in Supabase:", error);
            return;
          }

          set((state) => ({
            teachers: state.teachers.map((t) =>
              t.id === id ? { ...t, ...data } : t
            ),
          }));
        } catch (error) {
          console.error("Error updating teacher:", error);
        }
      },

      deleteTeacher: async (id) => {
        try {
          const { error } = await supabase.from("teachers").delete().eq("id", id);
          if (error) {
            console.error("Error deleting teacher from Supabase:", error);
            return;
          }

          set((state) => ({
            teachers: state.teachers.filter((t) => t.id !== id),
            courses: state.courses.map((c) =>
              c.teacherId === id ? { ...c, teacherId: "" } : c
            ),
          }));
        } catch (error) {
          console.error("Error deleting teacher:", error);
        }
      },
    }),
    {
      name: "eduqash_storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist auth and theme states to prevent local storage overwriting server state
      partialize: (state) => ({
        theme: state.theme,
        isAdminLoggedIn: state.isAdminLoggedIn,
        currentAdmin: state.currentAdmin,
      }),
    }
  )
);
