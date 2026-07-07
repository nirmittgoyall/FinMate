import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../utils/app-error";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return response.status(422).json({
      message: "Validation failed",
      issues: error.flatten(),
    });
  }

  if (isMongoDuplicateKeyError(error)) {
    return response.status(409).json({
      message: "An account with this email already exists.",
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error("Unhandled server error", error);

  return response.status(500).json({
    message: "Internal server error",
  });
}

function isMongoDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}
