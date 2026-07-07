export type JwtUserPayload = {
  sub: string;
  email: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  monthlyBudget: number;
  currency: string;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthenticatedUser;
};
