import { InferSchemaType, Schema, model, models } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String },
    actorName: { type: String, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String },
    message: { type: String, required: true },
    severity: { type: String, required: true, default: "info" },
    createdAt: { type: String, required: true },
  },
  { timestamps: true },
);

export type ActivityLogDocument = InferSchemaType<typeof ActivityLogSchema>;

export const ActivityLogModel =
  models.ActivityLog || model("ActivityLog", ActivityLogSchema);
