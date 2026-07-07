import axios, { AxiosHeaders } from "axios";
import type { AxiosRequestConfig } from "axios";
import { Platform } from "react-native";

import type {
  ApiErrorDetails,
  ApiErrorResponse,
  ApiValidationIssues,
} from "@/features/auth/types";

const defaultApiUrl =
  Platform.OS === "android"
    ? "http://10.0.2.2:4000/api"
    : "http://localhost:4000/api";

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl;

let accessToken: string | null = null;

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: ApiErrorDetails
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  } else {
    headers.delete("Authorization");
  }

  config.headers = headers;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error))
);

export function setApiClientAccessToken(token: string | null) {
  accessToken = token;
}

export async function apiRequest<T>(config: AxiosRequestConfig) {
  const response = await apiClient.request<T>(config);
  return response.data;
}

function normalizeApiError(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return new ApiClientError(
      "Something went wrong. Please try again.",
      0,
      "UNKNOWN_ERROR"
    );
  }

  if (!error.response) {
    return new ApiClientError(
      "Unable to reach the server. Check your API URL and network connection.",
      0,
      "NETWORK_ERROR"
    );
  }

  const { data, status } = error.response;
  const details = normalizeValidationDetails(data?.issues);
  const message =
    data?.issues?.formErrors?.[0] ??
    data?.message ??
    error.message ??
    "The request could not be completed.";

  return new ApiClientError(message, status, `HTTP_${status}`, details);
}

function normalizeValidationDetails(issues?: ApiValidationIssues) {
  const details: ApiErrorDetails = {};

  if (issues?.formErrors?.length) {
    details.form = issues.formErrors;
  }

  if (issues?.fieldErrors) {
    for (const [field, messages] of Object.entries(issues.fieldErrors)) {
      const normalizedMessages = messages?.filter(Boolean);

      if (normalizedMessages?.length) {
        details[field] = normalizedMessages;
      }
    }
  }

  return Object.keys(details).length ? details : undefined;
}
