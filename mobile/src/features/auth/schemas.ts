import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or less."),
});

export const signUpSchema = signInSchema.extend({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or less."),
  monthlyBudget: z
    .string()
    .trim()
    .min(1, "Monthly budget is required.")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Monthly budget must be a valid number.",
    })
    .refine((value) => Number(value) >= 0, {
      message: "Monthly budget cannot be negative.",
    }),
  currency: z
    .string()
    .trim()
    .length(3, "Currency must be a 3-letter code.")
    .refine((value) => /^[A-Za-z]{3}$/.test(value), {
      message: "Currency must contain only letters.",
    }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
