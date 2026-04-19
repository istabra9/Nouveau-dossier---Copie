import { InferSchemaType, Schema, model, models } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    trainingSlug: { type: String, required: true },
    status: { type: String, required: true },
    progress: { type: Number, required: true },
    startedAt: { type: String, required: true },
    nextSession: { type: String, required: true },
    completedAt: { type: String },
    amount: { type: Number, required: true },
  },
  { timestamps: true },
);

export type EnrollmentDocument = InferSchemaType<typeof EnrollmentSchema>;

export const EnrollmentModel =
  models.Enrollment || model("Enrollment", EnrollmentSchema);
