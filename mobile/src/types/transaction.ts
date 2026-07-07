export const transactionTypes = ["expense", "income"] as const;

export type TransactionType = (typeof transactionTypes)[number];

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  paymentMethod: string;
  note?: string;
  date: string;
  type: TransactionType;
  createdAt: string;
};
