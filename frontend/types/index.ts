export type Role = "super_admin" | "admin" | "user";
export type AppLocale = "en" | "fr" | "ar";
export type ThemePreference = "light" | "dark";
export type UserSex = "female" | "male" | "other" | "prefer_not_to_say";
export type OAuthProvider = "google" | "facebook" | "yahoo";

export type TrainingLevel =
  | "Foundation"
  | "Intermediate"
  | "Advanced"
  | "Executive";

export type TrainingFormat = "Virtual" | "Hybrid" | "In person";

export type EnrollmentStatus =
  | "confirmed"
  | "upcoming"
  | "in_progress"
  | "completed";

export type EnrollmentRequestStatus = "pending" | "accepted" | "rejected";

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type CheckoutPaymentMethod = "card" | "bank_transfer" | "on_site";
export type TrainingStatus = "upcoming" | "ongoing" | "completed" | "delayed";
export type NotificationAudience = Role | "all";
export type NotificationStatus = "unread" | "read";
export type NotificationType =
  | "system"
  | "enrollment"
  | "security"
  | "training"
  | "payment";
export type ActivitySeverity = "info" | "warning" | "success" | "critical";

export type ReportType =
  | "users"
  | "trainings"
  | "enrollments"
  | "revenue"
  | "durations"
  | "all";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  headline: string;
  accent: string;
  icon: string;
}

export interface Training {
  id: string;
  slug: string;
  code: string;
  title: string;
  summary: string;
  description: string;
  badge: string;
  categorySlug: string;
  level: TrainingLevel;
  format: TrainingFormat;
  price: number;
  durationDays: number;
  totalHours: number;
  seats: number;
  rating: number;
  rankingScore: number;
  featured: boolean;
  accent: string;
  coverPalette: [string, string, string];
  visualFamily: string;
  heroKicker: string;
  nextSession: string;
  imageUrl?: string;
  trainerName: string;
  trainerEmail: string;
  trainerExpertise: string;
  startDate: string;
  endDate: string;
  status: TrainingStatus;
  enrolledUsersCount: number;
  completionRate: number;
  engagementLevel: "low" | "medium" | "high";
  tags: string[];
  audience: string[];
  outcomes: string[];
  modules: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  result: string;
}

export interface UserOnboarding {
  domain: string;
  managesPeople: boolean | null;
  skills: string[];
  certifications: string[];
  goals?: string[];
  careerDirection?: string;
  preferredAvatar?: string;
  submittedAt?: string;
}

export interface UserOAuthAccount {
  provider: OAuthProvider;
  providerAccountId: string;
  email?: string;
  linkedAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  age?: number;
  sex?: UserSex;
  state?: string;
  uniqueId: string;
  role: Role;
  department: string;
  company: string;
  status: "active" | "pending";
  emailVerified?: boolean;
  verificationTokenHash?: string;
  verificationTokenExpiresAt?: string;
  authProvider?: "local" | OAuthProvider;
  oauthAccounts?: UserOAuthAccount[];
  joinedAt: string;
  avatar: string;
  funnyAvatar?: string;
  profilePicture?: string;
  focusTracks: string[];
  enrolledTrainingSlugs: string[];
  passwordHash?: string;
  preferences?: {
    language: AppLocale;
    theme: ThemePreference;
  };
  currentTrainingName?: string;
  trainingStartDate?: string;
  trainingEndDate?: string;
  currentTrainerName?: string;
  currentTrainingDurationDays?: number;
  currentTrainingDurationHours?: number;
  lastLoginAt?: string;
  onboardingCompleted?: boolean;
  onboarding?: UserOnboarding;
}

export interface EnrollmentRecord {
  id: string;
  userId: string;
  trainingSlug: string;
  status: EnrollmentStatus;
  progress: number;
  startedAt: string;
  nextSession: string;
  completedAt?: string;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  trainingSlug: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  method: string;
  paidAt: string;
  invoiceNumber: string;
}

export interface ScheduleRecord {
  id: string;
  trainingSlug: string;
  city: string;
  venue: string;
  instructor: string;
  startDate: string;
  endDate: string;
  seatsAvailable: number;
  format: TrainingFormat;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  at: string;
  tone: "brand" | "success" | "neutral";
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  description: string;
  tone: "brand" | "success" | "neutral";
}

export interface TrendPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface DistributionPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface PopularTrainingRow {
  name: string;
  category: string;
  trainerName: string;
  enrollments: number;
  duration: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  company: string;
  department: string;
  avatar: string;
  focusTracks: string[];
  emailVerified?: boolean;
}

export interface ChatbotReply {
  answer: string;
  suggestions: string[];
  recommendedTrainingSlugs: string[];
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  audience: NotificationAudience;
  userId?: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
  link?: string;
  readBy?: string[];
}

export interface ActivityLogRecord {
  id: string;
  userId?: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entityType: "user" | "training" | "auth" | "payment" | "notification" | "system";
  entityId?: string;
  message: string;
  severity: ActivitySeverity;
  createdAt: string;
}

export interface EnrollmentRequestRecord {
  id: string;
  userId: string;
  trainingSlug: string;
  scheduleId?: string;
  status: EnrollmentRequestStatus;
  reason?: string;
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
}

export interface SentEmailRecord {
  id: string;
  to: string;
  subject: string;
  body: string;
  template: string;
  meta?: Record<string, string>;
  sentAt: string;
}

export interface PlatformDataset {
  categories: Category[];
  trainings: Training[];
  testimonials: Testimonial[];
  users: UserRecord[];
  enrollments: EnrollmentRecord[];
  payments: PaymentRecord[];
  schedules: ScheduleRecord[];
  notifications: NotificationRecord[];
  activityLogs: ActivityLogRecord[];
}
