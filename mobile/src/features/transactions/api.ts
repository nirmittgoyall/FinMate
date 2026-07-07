import type { TransactionFormValues } from "@/features/transactions/schemas";
import { apiRequest } from "@/lib/api/client";
import type { Transaction } from "@/types/transaction";

export type TransactionsResponse = {
  transactions: Transaction[];
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
      category: values.category.trim(),
      paymentMethod: values.paymentMethod.trim(),
      note: values.note.trim() || undefined,
      date: values.date.trim(),
      type: values.type,
    },
  });
}
