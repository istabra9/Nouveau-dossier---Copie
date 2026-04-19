import { InferSchemaType, Schema, model, models } from "mongoose";

const ScheduleSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    trainingSlug: { type: String, required: true },
    city: { type: String, required: true },
    venue: { type: String, required: true },
    instructor: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    seatsAvailable: { type: Number, required: true },
    format: { type: String, required: true },
  },
  { timestamps: true },
);

export type ScheduleDocument = InferSchemaType<typeof ScheduleSchema>;

export const ScheduleModel =
  models.Schedule || model("Schedule", ScheduleSchema);
