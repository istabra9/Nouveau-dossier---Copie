import {
  appendUserEnrollment,
  createActivityLogRecord,
  createEnrollmentRecord,
  createNotificationRecord,
  createPaymentRecord,
  findTrainingBySlug,
  getPlatformDataset,
  updateUserById,
} from "@/backend/repositories/platform-repository";
import type { CheckoutPaymentMethod, SessionUser } from "@/frontend/types";

const paymentMethodLabels: Record<CheckoutPaymentMethod, string> = {
  card: "Card",
  bank_transfer: "Bank transfer",
  on_site: "Pay on site",
};

export async function processMockCheckout(
  trainingSlug: string,
  user: SessionUser,
  paymentMethod: CheckoutPaymentMethod,
) {
  const training = await findTrainingBySlug(trainingSlug);

  if (!training) {
    return {
      ok: false,
      message: "Training not found.",
    };
  }

  const dataset = await getPlatformDataset();
  const alreadyEnrolled = dataset.enrollments.some(
    (enrollment) =>
      enrollment.trainingSlug === trainingSlug && enrollment.userId === user.id,
  );

  if (alreadyEnrolled) {
    return {
      ok: false,
      message: "You are already enrolled in this training.",
    };
  }

  const paymentStatus = paymentMethod === "card" ? "paid" : "pending";
  const enrollmentStatus = paymentStatus === "paid" ? "confirmed" : "upcoming";

  const payment = await createPaymentRecord({
    userId: user.id,
    trainingSlug,
    amount: training.price,
    currency: process.env.DEFAULT_CURRENCY ?? "TND",
    status: paymentStatus,
    provider: process.env.PAYMENT_PROVIDER ?? "mock",
    method: paymentMethodLabels[paymentMethod],
    paidAt: new Date().toISOString().slice(0, 10),
  });

  await createEnrollmentRecord({
    userId: user.id,
    trainingSlug,
    status: enrollmentStatus,
    progress: 0,
    startedAt: new Date().toISOString().slice(0, 10),
    nextSession: training.nextSession,
    amount: training.price,
  });

  await appendUserEnrollment(user.id, trainingSlug);
  await updateUserById(user.id, {
    currentTrainingName: training.title,
    trainingStartDate: training.startDate,
    trainingEndDate: training.endDate,
  });
  await createNotificationRecord({
    title: paymentStatus === "paid" ? "Enrollment confirmed" : "Enrollment pending",
    message:
      paymentStatus === "paid"
        ? `${training.title} is now in your profile.`
        : `${training.title} will be confirmed after payment validation.`,
    audience: "user",
    userId: user.id,
    type: "enrollment",
    status: "unread",
    createdAt: new Date().toISOString(),
    link: `/trainings/${training.slug}`,
  });
  await createActivityLogRecord({
    userId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: paymentStatus === "paid" ? "enrollment-confirmed" : "enrollment-requested",
    entityType: "training",
    entityId: training.id,
    message:
      paymentStatus === "paid"
        ? `Enrolled in ${training.title}.`
        : `Requested enrollment in ${training.title}.`,
    severity: paymentStatus === "paid" ? "success" : "info",
    createdAt: new Date().toISOString(),
  });

  return {
    ok: true,
    message:
      paymentStatus === "paid"
        ? `Enrollment confirmed for ${training.title}.`
        : `Enrollment request created for ${training.title}. We will confirm your seat after payment validation.`,
    invoiceNumber: payment.invoiceNumber,
    paymentStatus: payment.status,
    paymentMethod: payment.method,
  };
}
