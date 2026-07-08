import { z } from "zod";

import {
  expenseCategories,
  incomeCategories,
  paymentMethodOptions,
} from "@/constants/finance";
import { transactionTypes } from "@/types/transaction";

const transactionCategories = [...expenseCategories, ...incomeCategories] as const;

export const transactionSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required.")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Amount must be a valid number.",
    })
    .refine((value) => Number(value) > 0, {
      message: "Amount must be greater than zero.",
    }),
  category: z.enum(transactionCategories, {
    error: "Select a category.",
  }),
  paymentMethod: z.enum(paymentMethodOptions, {
    error: "Select a payment method.",
  }),
  note: z.string().trim().max(240, "Note must be 240 characters or less."),
  date: z
    .string()
    .trim()
    .min(1, "Date is required.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Date must be valid.",
    }),
  type: z.enum(transactionTypes),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
