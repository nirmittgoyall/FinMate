import bcrypt from "bcryptjs";

import { User, type UserHydratedDocument } from "../models/user.model";
import type { AuthResponse, AuthenticatedUser } from "../types/auth";
import { AppError } from "../utils/app-error";
import { createToken } from "../utils/create-token";
import type { LoginInput, RegisterInput } from "../validators/auth.schema";

const PASSWORD_SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const existingUser = await User.findOne({ email: input.email }).lean().exec();

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const password = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password,
    monthlyBudget: input.monthlyBudget,
    currency: input.currency,
  });

  return buildAuthResponse(user);
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const user = await User.findOne({ email: input.email }).select("+password").exec();

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  return buildAuthResponse(user);
}

export async function getUserById(userId: string) {
  return User.findById(userId).exec();
}

function buildAuthResponse(user: UserHydratedDocument): AuthResponse {
  const serializedUser = serializeUser(user);

  return {
    accessToken: createToken({
      sub: serializedUser.id,
      email: serializedUser.email,
    }),
    user: serializedUser,
  };
}

export function serializeUser(user: UserHydratedDocument): AuthenticatedUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    monthlyBudget: user.monthlyBudget,
    currency: user.currency,
    createdAt: user.createdAt.toISOString(),
  };
}
