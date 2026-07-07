import { create } from "zustand";

import { getErrorMessage } from "@/features/auth/form-errors";
import {
  createTransaction as createTransactionRequest,
  listTransactions,
} from "@/features/transactions/api";
import type { TransactionFormValues } from "@/features/transactions/schemas";
import { useAuthStore } from "@/store/auth-store";
import type { Transaction } from "@/types/transaction";

type TransactionState = {
  transactions: Transaction[];
  error: string | null;
  sessionUserId: string | null;
  isLoaded: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  isCreating: boolean;
  fetchTransactions: (options?: { force?: boolean }) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  createTransaction: (values: TransactionFormValues) => Promise<Transaction>;
  reset: () => void;
};

const initialState = {
  transactions: [],
  error: null,
  sessionUserId: null,
  isLoaded: false,
  isLoading: false,
  isRefreshing: false,
  isCreating: false,
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
  ...initialState,
  fetchTransactions: async (options) => {
    syncSessionState(set, get);
    const { force = false } = options ?? {};

    if (get().isLoading || get().isRefreshing) {
      return;
    }

    if (get().isLoaded && !force) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await listTransactions();

      set({
        transactions: sortTransactions(response.transactions),
        error: null,
        sessionUserId: getActiveUserId(),
        isLoaded: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(
          error,
          "Unable to load transactions. Please try again."
        ),
        sessionUserId: getActiveUserId(),
        isLoaded: true,
        isLoading: false,
      });
      throw error;
    }
  },
  refreshTransactions: async () => {
    syncSessionState(set, get);

    if (get().isLoading || get().isRefreshing) {
      return;
    }

    set({ isRefreshing: true, error: null });

    try {
      const response = await listTransactions();

      set({
        transactions: sortTransactions(response.transactions),
        error: null,
        sessionUserId: getActiveUserId(),
        isLoaded: true,
        isRefreshing: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(
          error,
          "Unable to refresh transactions. Please try again."
        ),
        sessionUserId: getActiveUserId(),
        isLoaded: true,
        isRefreshing: false,
      });
      throw error;
    }
  },
  createTransaction: async (values) => {
    syncSessionState(set, get);
    set({ isCreating: true });

    try {
      const response = await createTransactionRequest(values);
      const nextTransactions = sortTransactions([
        response.transaction,
        ...get().transactions.filter(
          (transaction) => transaction.id !== response.transaction.id
        ),
      ]);

      set({
        transactions: nextTransactions,
        error: null,
        sessionUserId: getActiveUserId(),
        isLoaded: true,
        isCreating: false,
      });

      return response.transaction;
    } catch (error) {
      set({ isCreating: false });
      throw error;
    }
  },
  reset: () => set(initialState),
}));

export function resetTransactionStore() {
  useTransactionStore.getState().reset();
}

function getActiveUserId() {
  return useAuthStore.getState().user?.id ?? null;
}

function syncSessionState(
  set: (partial: Partial<TransactionState>) => void,
  get: () => TransactionState
) {
  const activeUserId = getActiveUserId();

  if (get().sessionUserId === activeUserId) {
    return;
  }

  set({
    ...initialState,
    sessionUserId: activeUserId,
  });
}

function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}
