import { Schema, model, type HydratedDocument } from "mongoose";

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  monthlyBudget: number;
  currency: string;
  createdAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    monthlyBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
  }
);

export type UserHydratedDocument = HydratedDocument<UserDocument>;

export const User = model<UserDocument>("User", userSchema);


