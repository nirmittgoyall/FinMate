import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

import { ApiClientError } from "@/lib/api/client";

export function applyServerFieldErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>
) {
  if (!(error instanceof ApiClientError) || !error.details) {
    return false;
  }

  let appliedCount = 0;

  for (const [field, messages] of Object.entries(error.details)) {
    if (field === "form") {
      continue;
    }

    const message = messages[0];

    if (!message) {
      continue;
    }

    setError(field as FieldPath<TFieldValues>, {
      type: "server",
      message,
    });
    appliedCount += 1;
  }

  return appliedCount > 0;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
) {
  if (error instanceof ApiClientError && error.details?.form?.[0]) {
    return error.details.form[0];
  }

  return error instanceof Error ? error.message : fallback;
}
