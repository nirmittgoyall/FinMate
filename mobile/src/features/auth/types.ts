import type { SupportedCurrency } from "@/constants/finance";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  monthlyBudget: number;
  currency: SupportedCurrency;
  createdAt: string;
};

export type AuthSessionResponse = {
  accessToken: string;
  user: SessionUser;
};

export type AuthUserResponse = {
  user: SessionUser;
};

export type ApiErrorDetails = Record<string, string[]>;

export type ApiValidationIssues = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[] | undefined>;
};

export type ApiErrorResponse = {
  message: string;
  issues?: ApiValidationIssues;
};
