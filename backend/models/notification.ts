import { InferSchemaType, Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: { type: String, required: true },
    userId: { type: String },
    type: { type: String, required: true },
    status: { type: String, required: true, default: "unread" },
    createdAt: { type: String, required: true },
    link: { type: String },
  },
  { timestamps: true },
);

export type NotificationDocument = InferSchemaType<typeof NotificationSchema>;

export const NotificationModel =
  models.Notification || model("Notification", NotificationSchema);
