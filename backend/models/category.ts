import { InferSchemaType, Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    headline: { type: String, required: true },
    accent: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { timestamps: true },
);

export type CategoryDocument = InferSchemaType<typeof CategorySchema>;

export const CategoryModel =
  models.Category || model("Category", CategorySchema);
