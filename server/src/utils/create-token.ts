import jwt from "jsonwebtoken";

import { env } from "../config/env";
import type { JwtUserPayload } from "../types/auth";

export function createToken(payload: JwtUserPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}