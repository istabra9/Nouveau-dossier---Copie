import { InferSchemaType, Schema, model, models } from "mongoose";

const TrainingSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    badge: { type: String, required: true },
    categorySlug: { type: String, required: true },
    level: { type: String, required: true },
    format: { type: String, required: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    totalHours: { type: Number, required: true },
    seats: { type: Number, required: true },
    rating: { type: Number, required: true },
    rankingScore: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    accent: { type: String, required: true },
    coverPalette: [{ type: String }],
    visualFamily: { type: String, required: true },
    heroKicker: { type: String, required: true },
    nextSession: { type: String, required: true },
    imageUrl: { type: String },
    trainerName: { type: String, required: true },
    trainerEmail: { type: String, required: true },
    trainerExpertise: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, required: true },
    enrolledUsersCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    engagementLevel: { type: String, default: "medium" },
    tags: [{ type: String }],
    audience: [{ type: String }],
    outcomes: [{ type: String }],
    modules: [{ type: String }],
  },
  { timestamps: true },
);

export type TrainingDocument = InferSchemaType<typeof TrainingSchema>;

export const TrainingModel =
  models.Training || model("Training", TrainingSchema);
