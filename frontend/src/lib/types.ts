export type Role = "student" | "teacher" | "user";

export interface Teacher {
  id: number;
  full_name: string;
  headline: string;
  short_bio: string;
  specialization: string | null;
  languages: string[];
  rating: number;
  reviews_count: number;
  lessons_count: number;
  hourly_rate: number;
  is_pro: boolean;
  avatar_color: string;
}

export interface UserAccount {
  id: number;
  email: string;
  role: Role;
  full_name: string;
  is_email_verified: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface SignupResult {
  user: UserAccount;
  token: Token;
  verification_token: string | null;
}

export interface UpcomingClass {
  id: number;
  title: string;
  start_time: string;
  duration_minutes: number;
  level_label: string;
  teacher_name: string;
  teacher_avatar_color: string;
}

export interface DashboardStats {
  profile_completion: number;
  streak_days: number;
  lessons_done: number;
  next_class_label: string;
  messages_count: number;
}

export interface Recommendation {
  title: string;
  body: string;
}

export interface Dashboard {
  student_name: string;
  stats: DashboardStats;
  upcoming_classes: UpcomingClass[];
  recommendation: Recommendation | null;
  matched_teacher: Teacher | null;
}

export type TeacherSort = "top_rated" | "price_low" | "price_high";
