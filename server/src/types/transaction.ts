export const transactionTypes = ["expense", "income"] as const;
export const transactionSorts = ["newest", "oldest", "amount"] as const;

export type TransactionType = (typeof transactionTypes)[number];
export type TransactionSort = (typeof transactionSorts)[number];

export type SerializedTransaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  paymentMethod: string;
  note?: string;
  date: string;
  receiptImageUrl?: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
};

export type TransactionPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TransactionsResponse = {
  transactions: SerializedTransaction[];
  pagination: TransactionPagination;
};

export type TransactionResponse = {
  transaction: SerializedTransaction;
};
