import { InferSchemaType, Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    sex: { type: String },
    uniqueId: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    company: { type: String, required: true },
    status: { type: String, required: true },
    joinedAt: { type: String, required: true },
    avatar: { type: String, required: true },
    funnyAvatar: { type: String },
    profilePicture: { type: String },
    focusTracks: [{ type: String }],
    enrolledTrainingSlugs: [{ type: String }],
    passwordHash: { type: String, required: true },
    preferences: {
      language: { type: String, default: "en" },
      theme: { type: String, default: "light" },
    },
    currentTrainingName: { type: String },
    trainingStartDate: { type: String },
    trainingEndDate: { type: String },
    lastLoginAt: { type: String },
    onboardingCompleted: { type: Boolean, default: true },
    onboarding: {
      domain: { type: String },
      managesPeople: { type: Boolean, default: null },
      skills: [{ type: String }],
      certifications: [{ type: String }],
      goals: [{ type: String }],
      careerDirection: { type: String },
      preferredAvatar: { type: String },
      submittedAt: { type: String },
    },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

export const UserModel = models.User || model("User", UserSchema);
