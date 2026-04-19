import { InferSchemaType, Schema, model, models } from "mongoose";

const EnrollmentRequestSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    trainingSlug: { type: String, required: true, index: true },
    scheduleId: { type: String },
    status: { type: String, required: true, default: "pending" },
    reason: { type: String },
    requestedAt: { type: String, required: true },
    decidedAt: { type: String },
    decidedBy: { type: String },
  },
  { timestamps: true },
);

export type EnrollmentRequestDocument = InferSchemaType<typeof EnrollmentRequestSchema>;

export const EnrollmentRequestModel =
  models.EnrollmentRequest ||
  model("EnrollmentRequest", EnrollmentRequestSchema);
