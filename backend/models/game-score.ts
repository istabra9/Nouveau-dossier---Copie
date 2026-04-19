import { InferSchemaType, Schema, model, models } from "mongoose";

const GameScoreSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, index: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    gameType: { type: String, required: true, default: "memory-match" },
    score: { type: Number, required: true },
    moves: { type: Number, required: true },
    durationSeconds: { type: Number, required: true },
    playedAt: { type: String, required: true },
  },
  { timestamps: true },
);

export type GameScoreDocument = InferSchemaType<typeof GameScoreSchema>;

export const GameScoreModel =
  models.GameScore || model("GameScore", GameScoreSchema);
