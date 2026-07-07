import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be 80 characters or less"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Valid email is required")
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or less"),
  monthlyBudget: z
    .coerce
    .number()
    .finite("Monthly budget must be a valid number")
    .min(0, "Monthly budget cannot be negative"),
  currency: z
    .string()
    .trim()
    .length(3, "Currency must be a 3-letter ISO code")
    .transform((value) => value.toUpperCase()),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Valid email is required")
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or less"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
