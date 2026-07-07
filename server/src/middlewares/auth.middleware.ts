import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { getUserById, serializeUser } from "../services/auth.service";
import type { JwtUserPayload } from "../types/auth";

export async function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return response.status(401).json({
      message: "Authentication token is missing.",
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
    const user = await getUserById(payload.sub);

    if (!user) {
      return response.status(401).json({
        message: "Authentication token is invalid.",
      });
    }

    request.user = serializeUser(user);
    return next();
  } catch {
    return response.status(401).json({
      message: "Authentication token is invalid.",
    });
  }
}
