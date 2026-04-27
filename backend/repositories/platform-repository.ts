import { mockDataset } from "@/backend/data/mock-data";
import { connectToDatabase } from "@/backend/db/connect";
import { ActivityLogModel } from "@/backend/models/activity-log";
import { CategoryModel } from "@/backend/models/category";
import { EnrollmentModel } from "@/backend/models/enrollment";
import { NotificationModel } from "@/backend/models/notification";
import { PaymentModel } from "@/backend/models/payment";
import { ScheduleModel } from "@/backend/models/schedule";
import { TrainingModel } from "@/backend/models/training";
import { UserModel } from "@/backend/models/user";
import type {
  ActivityLogRecord,
  EnrollmentRecord,
  NotificationRecord,
  OAuthProvider,
  PaymentRecord,
  PlatformDataset,
  Training,
  UserOAuthAccount,
  UserRecord,
} from "@/frontend/types";

function serialise<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function loadMongoDataset(): Promise<PlatformDataset | null> {
  const connection = await connectToDatabase();

  if (!connection) {
    return null;
  }

  try {
    const [categories, trainings, users, enrollments, payments, schedules, notifications, activityLogs] =
      await Promise.all([
        CategoryModel.find({}).lean(),
        TrainingModel.find({}).lean(),
        UserModel.find({}).lean(),
        EnrollmentModel.find({}).lean(),
        PaymentModel.find({}).lean(),
        ScheduleModel.find({}).lean(),
        NotificationModel.find({}).lean(),
        ActivityLogModel.find({}).lean(),
      ]);

    const hasAnyData = [
      categories,
      trainings,
      users,
      enrollments,
      payments,
      schedules,
      notifications,
      activityLogs,
    ].some((collection) => collection.length > 0);

    if (!hasAnyData) {
      return null;
    }

    return {
      categories: serialise(categories),
      trainings: serialise(trainings),
      testimonials: mockDataset.testimonials,
      users: serialise(users),
      enrollments: serialise(enrollments),
      payments: serialise(payments),
      schedules: serialise(schedules),
      notifications: serialise(notifications),
      activityLogs: serialise(activityLogs),
    };
  } catch {
    return null;
  }
}

async function findMongoUserById(userId: string) {
  const connection = await connectToDatabase();

  if (!connection) {
    return null;
  }

  const user = await UserModel.findOne({ id: userId }).lean();
  return user ? serialise(user as unknown as UserRecord) : null;
}

async function findMongoTrainingBySlug(slug: string) {
  const connection = await connectToDatabase();

  if (!connection) {
    return null;
  }

  const training = await TrainingModel.findOne({ slug }).lean();
  return training ? serialise(training as unknown as Training) : null;
}

export async function getPlatformDataset() {
  return (await loadMongoDataset()) ?? mockDataset;
}

export async function findUserByEmail(email: string) {
  const dataset = await getPlatformDataset();
  return dataset.users.find((user) => user.email.toLowerCase() === email) ?? null;
}

export async function findUserById(userId: string) {
  const mongoUser = await findMongoUserById(userId);

  if (mongoUser) {
    return mongoUser;
  }

  const dataset = await getPlatformDataset();
  return dataset.users.find((user) => user.id === userId) ?? null;
}

export async function findUserByOAuthAccount(
  provider: OAuthProvider,
  providerAccountId: string,
) {
  const connection = await connectToDatabase();

  if (connection) {
    const user = await UserModel.findOne({
      oauthAccounts: {
        $elemMatch: { provider, providerAccountId },
      },
    }).lean();

    if (user) {
      return serialise(user as unknown as UserRecord);
    }
  }

  const dataset = await getPlatformDataset();
  return (
    dataset.users.find((user) =>
      user.oauthAccounts?.some(
        (account) =>
          account.provider === provider &&
          account.providerAccountId === providerAccountId,
      ),
    ) ?? null
  );
}

export async function findTrainingBySlug(slug: string) {
  const mongoTraining = await findMongoTrainingBySlug(slug);

  if (mongoTraining) {
    return mongoTraining;
  }

  const dataset = await getPlatformDataset();
  return dataset.trainings.find((training) => training.slug === slug) ?? null;
}

export async function createUser(input: Omit<UserRecord, "id">) {
  const user: UserRecord = {
    id: `usr-${crypto.randomUUID().slice(0, 8)}`,
    ...input,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return user;
  }

  const created = await UserModel.create(user);
  return serialise(created.toObject());
}

export async function updateUserOnboarding(
  userId: string,
  input: Pick<UserRecord, "focusTracks"> & {
    onboardingCompleted: boolean;
    onboarding: NonNullable<UserRecord["onboarding"]>;
  },
) {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    return null;
  }

  const nextUser: UserRecord = {
    ...existingUser,
    ...input,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return nextUser;
  }

  const updated = await UserModel.findOneAndUpdate(
    { id: userId },
    {
      $set: {
        focusTracks: input.focusTracks,
        onboardingCompleted: input.onboardingCompleted,
        onboarding: input.onboarding,
      },
    },
    { new: true },
  ).lean();

  return updated ? serialise(updated) : nextUser;
}

export async function createEnrollmentRecord(input: Omit<EnrollmentRecord, "id">) {
  const enrollment: EnrollmentRecord = {
    id: `enr-${crypto.randomUUID().slice(0, 8)}`,
    ...input,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return enrollment;
  }

  const created = await EnrollmentModel.create(enrollment);
  return serialise(created.toObject());
}

export async function createPaymentRecord(
  input: Omit<PaymentRecord, "id" | "invoiceNumber"> &
    Partial<Pick<PaymentRecord, "invoiceNumber">>,
) {
  const payment: PaymentRecord = {
    id: `pay-${crypto.randomUUID().slice(0, 8)}`,
    invoiceNumber:
      input.invoiceNumber ??
      `ADV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
    ...input,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return payment;
  }

  const created = await PaymentModel.create(payment);
  return serialise(created.toObject());
}

export async function appendUserEnrollment(userId: string, trainingSlug: string) {
  const connection = await connectToDatabase();

  if (!connection) {
    return;
  }

  await UserModel.updateOne(
    { id: userId },
    { $addToSet: { enrolledTrainingSlugs: trainingSlug } },
  );
}

export async function updateUserProfile(
  userId: string,
  input: Partial<
    Pick<
      UserRecord,
      | "firstName"
      | "lastName"
      | "age"
      | "sex"
      | "phoneNumber"
      | "department"
      | "company"
      | "funnyAvatar"
      | "profilePicture"
      | "preferences"
      | "currentTrainingName"
      | "trainingStartDate"
      | "trainingEndDate"
    >
  >,
) {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    return null;
  }

  const nextUser: UserRecord = {
    ...existingUser,
    ...input,
    name:
      input.firstName || input.lastName
        ? `${input.firstName ?? existingUser.firstName} ${input.lastName ?? existingUser.lastName}`.trim()
        : existingUser.name,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return nextUser;
  }

  const updated = await UserModel.findOneAndUpdate(
    { id: userId },
    {
      $set: {
        ...input,
        name: nextUser.name,
      },
    },
    { new: true },
  ).lean();

  return updated ? serialise(updated) : nextUser;
}

export async function findUserByVerificationHash(verificationTokenHash: string) {
  const dataset = await getPlatformDataset();
  return (
    dataset.users.find(
      (user) => user.verificationTokenHash === verificationTokenHash,
    ) ?? null
  );
}

export async function setUserVerificationToken(
  userId: string,
  verificationTokenHash: string,
  verificationTokenExpiresAt: string,
) {
  const connection = await connectToDatabase();
  if (!connection) {
    return null;
  }

  const updated = await UserModel.findOneAndUpdate(
    { id: userId },
    {
      $set: {
        verificationTokenHash,
        verificationTokenExpiresAt,
        emailVerified: false,
      },
    },
    { new: true },
  ).lean();

  return updated ? serialise(updated) : null;
}

export async function markUserEmailVerified(userId: string) {
  const connection = await connectToDatabase();
  if (!connection) {
    return null;
  }

  const updated = await UserModel.findOneAndUpdate(
    { id: userId },
    {
      $set: { emailVerified: true },
      $unset: { verificationTokenHash: "", verificationTokenExpiresAt: "" },
    },
    { new: true },
  ).lean();

  return updated ? serialise(updated) : null;
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  const connection = await connectToDatabase();
  if (!connection) {
    return null;
  }

  const updated = await UserModel.findOneAndUpdate(
    { id: userId },
    { $set: { passwordHash } },
    { new: true },
  ).lean();

  return updated ? serialise(updated) : null;
}

export async function updateUserLastLogin(userId: string, timestamp: string) {
  const connection = await connectToDatabase();
  if (!connection) {
    return null;
  }

  const updated = await UserModel.findOneAndUpdate(
    { id: userId },
    { $set: { lastLoginAt: timestamp } },
    { new: true },
  ).lean();

  return updated ? serialise(updated) : null;
}

export async function linkOAuthAccountToUser(
  userId: string,
  account: UserOAuthAccount,
  input?: {
    authProvider?: UserRecord["authProvider"];
    emailVerified?: boolean;
    profilePicture?: string;
  },
) {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    return null;
  }

  const oauthAccounts = [
    ...(existingUser.oauthAccounts ?? []).filter(
      (entry) =>
        !(
          entry.provider === account.provider &&
          entry.providerAccountId === account.providerAccountId
        ),
    ),
    account,
  ];

  const nextUser: UserRecord = {
    ...existingUser,
    authProvider: existingUser.authProvider ?? input?.authProvider ?? "local",
    oauthAccounts,
    emailVerified: input?.emailVerified ?? existingUser.emailVerified,
    profilePicture: existingUser.profilePicture ?? input?.profilePicture,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return nextUser;
  }

  const updated = await UserModel.findOneAndUpdate(
    { id: userId },
    {
      $set: {
        authProvider: nextUser.authProvider,
        oauthAccounts: nextUser.oauthAccounts,
        emailVerified: nextUser.emailVerified,
        profilePicture: nextUser.profilePicture,
      },
    },
    { new: true },
  ).lean();

  return updated ? serialise(updated as unknown as UserRecord) : nextUser;
}

export async function createNotificationRecord(input: Omit<NotificationRecord, "id">) {
  const notification: NotificationRecord = {
    id: `not-${crypto.randomUUID().slice(0, 8)}`,
    ...input,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return notification;
  }

  const created = await NotificationModel.create(notification);
  return serialise(created.toObject());
}

export async function markNotificationsReadForUser(
  userId: string,
  notificationIds?: string[],
) {
  const connection = await connectToDatabase();
  if (!connection) {
    return;
  }

  const filter = notificationIds?.length
    ? { id: { $in: notificationIds } }
    : {};

  await NotificationModel.updateMany(filter, {
    $addToSet: { readBy: userId },
  });
}

export async function createActivityLogRecord(input: Omit<ActivityLogRecord, "id">) {
  const activity: ActivityLogRecord = {
    id: `act-${crypto.randomUUID().slice(0, 8)}`,
    ...input,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return activity;
  }

  const created = await ActivityLogModel.create(activity);
  return serialise(created.toObject());
}

export async function updateUserById(
  userId: string,
  input: Partial<
    Pick<
      UserRecord,
      | "firstName"
      | "lastName"
      | "name"
      | "email"
      | "phoneNumber"
      | "company"
      | "department"
      | "status"
      | "role"
      | "age"
      | "sex"
      | "state"
      | "funnyAvatar"
      | "profilePicture"
      | "preferences"
      | "currentTrainingName"
      | "trainingStartDate"
      | "trainingEndDate"
    >
  >,
) {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    return null;
  }

  const nextUser: UserRecord = {
    ...existingUser,
    ...input,
    name:
      input.name ??
      (input.firstName || input.lastName
        ? `${input.firstName ?? existingUser.firstName} ${input.lastName ?? existingUser.lastName}`.trim()
        : existingUser.name),
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return nextUser;
  }

  const updated = await UserModel.findOneAndUpdate(
    { id: userId },
    { $set: { ...input, name: nextUser.name } },
    { new: true },
  ).lean();

  return updated ? serialise(updated) : nextUser;
}

export async function deleteUserById(userId: string) {
  const connection = await connectToDatabase();
  if (!connection) {
    return false;
  }

  const deleted = await UserModel.findOneAndDelete({ id: userId }).lean();
  return Boolean(deleted);
}

export async function createTrainingRecord(input: Omit<Training, "id">) {
  const training: Training = {
    id: `trn-${crypto.randomUUID().slice(0, 8)}`,
    ...input,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return training;
  }

  const created = await TrainingModel.create(training);
  return serialise(created.toObject());
}

export async function updateTrainingBySlug(
  slug: string,
  input: Partial<Training>,
) {
  const existingTraining = await findTrainingBySlug(slug);

  if (!existingTraining) {
    return null;
  }

  const nextTraining: Training = {
    ...existingTraining,
    ...input,
  };

  const connection = await connectToDatabase();
  if (!connection) {
    return nextTraining;
  }

  const updated = await TrainingModel.findOneAndUpdate(
    { slug },
    { $set: input },
    { new: true },
  ).lean();

  return updated ? serialise(updated) : nextTraining;
}

export async function deleteTrainingBySlug(slug: string) {
  const connection = await connectToDatabase();
  if (!connection) {
    return false;
  }

  const deleted = await TrainingModel.findOneAndDelete({ slug }).lean();
  return Boolean(deleted);
}
