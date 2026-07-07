import type { SignInFormValues, SignUpFormValues } from "@/features/auth/schemas";
import type {
  AuthSessionResponse,
  AuthUserResponse,
} from "@/features/auth/types";
import { apiRequest } from "@/lib/api/client";

export function signIn(values: SignInFormValues) {
  return apiRequest<AuthSessionResponse>({
    url: "/auth/login",
    method: "POST",
    data: {
      email: values.email.trim().toLowerCase(),
      password: values.password,
    },
  });
}

export function signUp(values: SignUpFormValues) {
  return apiRequest<AuthSessionResponse>({
    url: "/auth/register",
    method: "POST",
    data: {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      monthlyBudget: Number(values.monthlyBudget),
      currency: values.currency.trim().toUpperCase(),
    },
  });
}

export function getCurrentUser() {
  return apiRequest<AuthUserResponse>({
    url: "/auth/me",
    method: "GET",
  });
}
