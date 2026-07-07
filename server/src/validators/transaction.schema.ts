import { z } from "zod";

import { transactionSorts, transactionTypes } from "../types/transaction";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const titleSchema = z
  .string()
  .trim()
  .min(2, "Title must be at least 2 characters")
  .max(120, "Title must be 120 characters or less");

const amountSchema = z.coerce
  .number()
  .finite("Amount must be a valid number")
  .positive("Amount must be greater than zero");

const categorySchema = z
  .string()
  .trim()
  .min(2, "Category must be at least 2 characters")
  .max(60, "Category must be 60 characters or less");

const paymentMethodSchema = z
  .string()
  .trim()
  .min(2, "Payment method must be at least 2 characters")
  .max(60, "Payment method must be 60 characters or less");

const noteSchema = z
  .string()
  .trim()
  .max(240, "Note must be 240 characters or less")
  .optional()
  .or(z.literal(""));

const receiptImageUrlSchema = z
  .string()
  .trim()
  .url("Receipt image URL must be a valid URL")
  .optional()
  .or(z.literal(""));

const dateSchema = z.coerce.date({
  error: "Date must be a valid date",
});

export const createTransactionSchema = z.object({
  title: titleSchema,
  amount: amountSchema,
  category: categorySchema,
  paymentMethod: paymentMethodSchema,
  note: noteSchema,
  date: dateSchema,
  receiptImageUrl: receiptImageUrlSchema,
  type: z.enum(transactionTypes),
});

export const updateTransactionSchema = createTransactionSchema
  .partial()
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one field must be provided.",
  });

export const transactionParamsSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(objectIdPattern, "Invalid transaction id."),
});

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(1900).max(9999).optional(),
  category: z.string().trim().min(1).optional(),
  type: z.enum(transactionTypes).optional(),
  paymentMethod: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  sort: z.enum(transactionSorts).default("newest"),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionParamsInput = z.infer<typeof transactionParamsSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
