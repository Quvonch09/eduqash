export type District =
  | "Qarshi"
  | "Shahrisabz"
  | "Kitob"
  | "Koson"
  | "Yakkabog'"
  | "Chiroqchi";

export type Direction =
  | "IT"
  | "Ingliz tili"
  | "Matematika"
  | "Fizika"
  | "Kimyo"
  | "Biologiya"
  | "Ona tili"
  | "Arab tili"
  | "Rus tili"
  | "Robototexnika";

export interface LearningCenter {
  id: string;
  name: string;
  address: string;
  district: District;
  phone: string;
  image: string;
  description: string;
  rating: number;
  viewsCount: number;
  lat: number;
  lng: number;
  createdAt: string;
  createdBy?: string;
}

export interface Course {
  id: string;
  centerId: string;
  direction: Direction;
  name: string;
  price: number;
  duration: string;
  teacherId: string;
  description: string;
  level: "Boshlang'ich" | "O'rta" | "Yuqori" | "Barchaga mos";
}

export interface Teacher {
  id: string;
  name: string;
  photo: string;
  bio: string;
  experience: string;
  results: string[];
  contact: {
    phone: string;
    telegram?: string;
    instagram?: string;
  };
  centerId: string;
}

export interface Feedback {
  id: string;
  centerId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SearchLog {
  query: string;
  count: number;
}

export interface CenterViewLog {
  centerId: string;
  count: number;
}

export interface DirectionViewLog {
  direction: string;
  count: number;
}

export interface Stats {
  searchLogs: SearchLog[];
  centerViews: CenterViewLog[];
  directionViews: DirectionViewLog[];
  totalVisitors: number;
}

export type AdminRole = "super_admin" | "admin" | "manager";

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: AdminRole;
  centerId?: string;
  createdAt: string;
}
