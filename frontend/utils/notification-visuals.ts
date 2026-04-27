import type { NotificationType } from "@/frontend/types";

export const notificationEmoji: Record<NotificationType, string> = {
  system: "⚙️",
  enrollment: "🎓",
  security: "🔐",
  training: "📚",
  payment: "💳",
};

export const notificationTone: Record<NotificationType, string> = {
  system: "bg-slate-50 text-slate-700 ring-slate-100",
  enrollment: "bg-sky-50 text-sky-700 ring-sky-100",
  security: "bg-brand-50 text-brand-700 ring-brand-100",
  training: "bg-violet-50 text-violet-700 ring-violet-100",
  payment: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

export const notificationLabel: Record<NotificationType, string> = {
  system: "System",
  enrollment: "Enrollment",
  security: "Security",
  training: "Training",
  payment: "Payment",
};
