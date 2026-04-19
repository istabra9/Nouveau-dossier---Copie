import { InferSchemaType, Schema, model, models } from "mongoose";

const PaymentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    trainingSlug: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    provider: { type: String, required: true },
    method: { type: String, required: true },
    paidAt: { type: String, required: true },
    invoiceNumber: { type: String, required: true },
  },
  { timestamps: true },
);

export type PaymentDocument = InferSchemaType<typeof PaymentSchema>;

export const PaymentModel = models.Payment || model("Payment", PaymentSchema);
