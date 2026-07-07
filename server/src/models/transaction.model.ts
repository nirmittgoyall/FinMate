import { Schema, model, type HydratedDocument, type Types } from "mongoose";

import { transactionTypes, type TransactionType } from "../types/transaction";

export type TransactionDocument = {
  userId: Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  paymentMethod: string;
  note?: string;
  date: Date;
  receiptImageUrl?: string;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
};

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 240,
    },
    date: {
      type: Date,
      required: true,
    },
    receiptImageUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
    },
    type: {
      type: String,
      required: true,
      enum: transactionTypes,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

transactionSchema.index({ userId: 1, date: -1, createdAt: -1 });

export type TransactionHydratedDocument = HydratedDocument<TransactionDocument>;

export const Transaction = model<TransactionDocument>(
  "Transaction",
  transactionSchema
);
