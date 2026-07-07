import type { Request, Response } from "express";

import { AppError } from "../utils/app-error";
import {
  loginUser,
  registerUser,
} from "../services/auth.service";
import { loginSchema, registerSchema } from "../validators/auth.schema";

export async function register(request: Request, response: Response) {
  const input = registerSchema.parse(request.body);
  const result = await registerUser(input);

  response.status(201).json(result);
}

export async function login(request: Request, response: Response) {
  const input = loginSchema.parse(request.body);
  const result = await loginUser(input);

  response.status(200).json(result);
}

export function getCurrentUser(request: Request, response: Response) {
  if (!request.user) {
    throw new AppError("Authentication is required.", 401);
  }

  response.status(200).json({
    user: request.user,
  });
}
