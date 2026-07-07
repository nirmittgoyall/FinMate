import { create } from "zustand";

import {
  getCurrentUser,
  signIn as signInRequest,
  signUp as signUpRequest,
} from "@/features/auth/api";
import type {
  SignInFormValues,
  SignUpFormValues,
} from "@/features/auth/schemas";
import type { SessionUser } from "@/features/auth/types";
import { ApiClientError, setApiClientAccessToken } from "@/lib/api/client";
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  setStoredAccessToken,
} from "@/lib/auth/token-storage";

type AuthState = {
  user: SessionUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isHydrating: boolean;
  isLoading: boolean;
  hydrateSession: () => Promise<void>;
  signIn: (values: SignInFormValues) => Promise<void>;
  signUp: (values: SignUpFormValues) => Promise<void>;
  signOut: () => Promise<void>;
};

const unauthenticatedState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...unauthenticatedState,
  isHydrated: false,
  isHydrating: false,
  isLoading: false,
  hydrateSession: async () => {
    if (get().isHydrating || get().isHydrated) {
      return;
    }

    set({ isHydrating: true });

    try {
      const storedToken = await getStoredAccessToken();

      if (!storedToken) {
        setApiClientAccessToken(null);
        set({
          ...unauthenticatedState,
          isHydrated: true,
          isHydrating: false,
          isLoading: false,
        });
        return;
      }

      setApiClientAccessToken(storedToken);
      const session = await getCurrentUser();

      set({
        user: session.user,
        accessToken: storedToken,
        isAuthenticated: true,
        isHydrated: true,
        isHydrating: false,
        isLoading: false,
      });
    } catch (error) {
      setApiClientAccessToken(null);

      if (shouldClearStoredSession(error)) {
        await clearStoredAccessToken();
      }

      set({
        ...unauthenticatedState,
        isHydrated: true,
        isHydrating: false,
        isLoading: false,
      });
    }
  },
  signIn: async (values) => {
    set({ isLoading: true });

    try {
      const session = await signInRequest(values);

      setApiClientAccessToken(session.accessToken);
      await setStoredAccessToken(session.accessToken);

      set({
        user: session.user,
        accessToken: session.accessToken,
        isAuthenticated: true,
        isHydrated: true,
        isHydrating: false,
        isLoading: false,
      });
    } catch (error) {
      setApiClientAccessToken(null);
      set({ isLoading: false });
      throw error;
    }
  },
  signUp: async (values) => {
    set({ isLoading: true });

    try {
      const session = await signUpRequest(values);

      setApiClientAccessToken(session.accessToken);
      await setStoredAccessToken(session.accessToken);

      set({
        user: session.user,
        accessToken: session.accessToken,
        isAuthenticated: true,
        isHydrated: true,
        isHydrating: false,
        isLoading: false,
      });
    } catch (error) {
      setApiClientAccessToken(null);
      set({ isLoading: false });
      throw error;
    }
  },
  signOut: async () => {
    set({ isLoading: true });

    try {
      await clearStoredAccessToken();
    } finally {
      setApiClientAccessToken(null);
      set({
        ...unauthenticatedState,
        isHydrated: true,
        isHydrating: false,
        isLoading: false,
      });
    }
  },
}));

function shouldClearStoredSession(error: unknown) {
  return (
    error instanceof ApiClientError &&
    (error.status === 401 || error.status === 403)
  );
}
