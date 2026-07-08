import type { TransactionFormValues } from "@/features/transactions/schemas";
import { apiRequest } from "@/lib/api/client";
import type { Transaction } from "@/types/transaction";

export type TransactionsResponse = {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TransactionResponse = {
  transaction: Transaction;
};

export function listTransactions() {
  return apiRequest<TransactionsResponse>({
    url: "/transactions",
    method: "GET",
  });
}

export function createTransaction(values: TransactionFormValues) {
  return apiRequest<TransactionResponse>({
    url: "/transactions",
    method: "POST",
    data: {
      title: values.title.trim(),
      amount: Number(values.amount),
      category: values.category,
      paymentMethod: values.paymentMethod,
      note: values.note.trim() || undefined,
      date: values.date.trim(),
      type: values.type,
    },
  });
}

export function deleteTransaction(transactionId: string) {
  return apiRequest<void>({
    url: `/transactions/${transactionId}`,
    method: "DELETE",
  });
}
