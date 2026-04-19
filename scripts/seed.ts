import { existsSync } from "node:fs";

if (existsSync(".env.local")) {
  process.loadEnvFile?.(".env.local");
}

if (existsSync(".env")) {
  process.loadEnvFile?.(".env");
}

import mongoose from "mongoose";

import { mockDataset } from "@/backend/data/mock-data";
import { connectToDatabase } from "@/backend/db/connect";
import { ActivityLogModel } from "@/backend/models/activity-log";
import { CategoryModel } from "@/backend/models/category";
import { EnrollmentModel } from "@/backend/models/enrollment";
import { EnrollmentRequestModel } from "@/backend/models/enrollment-request";
import { GameScoreModel } from "@/backend/models/game-score";
import { NotificationModel } from "@/backend/models/notification";
import { PaymentModel } from "@/backend/models/payment";
import { ScheduleModel } from "@/backend/models/schedule";
import { TrainingModel } from "@/backend/models/training";
import { UserModel } from "@/backend/models/user";

async function seed() {
  const connection = await connectToDatabase();

  if (!connection) {
    throw new Error("MONGODB_URI is missing. Add it before running the seed.");
  }

  await Promise.all([
    CategoryModel.deleteMany({}),
    TrainingModel.deleteMany({}),
    UserModel.deleteMany({}),
    EnrollmentModel.deleteMany({}),
    EnrollmentRequestModel.deleteMany({}),
    GameScoreModel.deleteMany({}),
    PaymentModel.deleteMany({}),
    ScheduleModel.deleteMany({}),
    NotificationModel.deleteMany({}),
    ActivityLogModel.deleteMany({}),
  ]);

  await Promise.all([
    CategoryModel.insertMany(mockDataset.categories),
    TrainingModel.insertMany(mockDataset.trainings),
    UserModel.insertMany(mockDataset.users),
    EnrollmentModel.insertMany(mockDataset.enrollments),
    PaymentModel.insertMany(mockDataset.payments),
    ScheduleModel.insertMany(mockDataset.schedules),
    NotificationModel.insertMany(mockDataset.notifications),
    ActivityLogModel.insertMany(mockDataset.activityLogs),
  ]);

  // Demo enrollment requests (so the super-admin queue has something to decide).
  const firstTraining = mockDataset.trainings[0];
  const secondTraining = mockDataset.trainings[1] ?? mockDataset.trainings[0];
  const learner = mockDataset.users.find((entry) => entry.id === "usr-user");
  const altLearner = mockDataset.users.find((entry) => entry.id === "usr-ops");

  if (firstTraining && learner) {
    await EnrollmentRequestModel.create({
      id: `req-${Date.now().toString(36)}-a`,
      userId: learner.id,
      trainingSlug: firstTraining.slug,
      status: "pending",
      requestedAt: new Date().toISOString(),
    });
  }

  if (secondTraining && altLearner) {
    await EnrollmentRequestModel.create({
      id: `req-${Date.now().toString(36)}-b`,
      userId: altLearner.id,
      trainingSlug: secondTraining.slug,
      status: "pending",
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    });
  }

  // Demo game scores for the leaderboard.
  const leaderboardSeeds = [
    { user: "usr-user", moves: 18, durationSeconds: 42 },
    { user: "usr-ops", moves: 22, durationSeconds: 56 },
    { user: "usr-data", moves: 20, durationSeconds: 48 },
    { user: "usr-lead", moves: 25, durationSeconds: 64 },
    { user: "usr-finance", moves: 28, durationSeconds: 71 },
  ];

  await Promise.all(
    leaderboardSeeds.map((seed, index) => {
      const participant = mockDataset.users.find(
        (entry) => entry.id === seed.user,
      );
      if (!participant) return Promise.resolve();
      const score = Math.max(0, 1000 - seed.moves * 10 - seed.durationSeconds);
      return GameScoreModel.create({
        id: `gs-seed-${index}`,
        userId: participant.id,
        userName: participant.name,
        userAvatar: participant.funnyAvatar ?? participant.avatar,
        gameType: "memory-match",
        score,
        moves: seed.moves,
        durationSeconds: seed.durationSeconds,
        playedAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * (index + 1),
        ).toISOString(),
      });
    }),
  );

  console.log("Seed completed successfully.");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
