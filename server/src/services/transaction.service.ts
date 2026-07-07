import type { SortOrder } from "mongoose";

import { Transaction, type TransactionDocument, type TransactionHydratedDocument } from "../models/transaction.model";
import type { AuthenticatedUser } from "../types/auth";
import type {
  SerializedTransaction,
  TransactionResponse,
  TransactionsResponse,
  TransactionSort,
} from "../types/transaction";
import { AppError } from "../utils/app-error";
import type {
  CreateTransactionInput,
  TransactionQueryInput,
  UpdateTransactionInput,
} from "../validators/transaction.schema";

export async function createTransactionForUser(
  user: AuthenticatedUser,
  input: CreateTransactionInput
): Promise<TransactionResponse> {
  const transaction = await Transaction.create({
    userId: user.id,
    title: input.title,
    amount: input.amount,
    category: input.category,
    paymentMethod: input.paymentMethod,
    note: normalizeOptionalString(input.note),
    date: input.date,
    receiptImageUrl: normalizeOptionalString(input.receiptImageUrl),
    type: input.type,
  });

  return {
    transaction: serializeTransaction(transaction),
  };
}

export async function listTransactionsForUser(
  user: AuthenticatedUser,
  query: TransactionQueryInput
): Promise<TransactionsResponse> {
  const filters = buildTransactionFilters(user.id, query);
  const sort = buildTransactionSort(query.sort);
  const skip = (query.page - 1) * query.limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(filters).sort(sort).skip(skip).limit(query.limit).exec(),
    Transaction.countDocuments(filters).exec(),
  ]);

  return {
    transactions: transactions.map(serializeTransaction),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / query.limit),
    },
  };
}

export async function getTransactionByIdForUser(
  user: AuthenticatedUser,
  transactionId: string
): Promise<TransactionResponse> {
  const transaction = await findTransactionForUser(user.id, transactionId);

  return {
    transaction: serializeTransaction(transaction),
  };
}

export async function updateTransactionForUser(
  user: AuthenticatedUser,
  transactionId: string,
  input: UpdateTransactionInput
): Promise<TransactionResponse> {
  const update = buildTransactionUpdate(input);

  const transaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, userId: user.id },
    update,
    {
      new: true,
      runValidators: true,
    }
  ).exec();

  if (!transaction) {
    throw new AppError("Transaction not found.", 404);
  }

  return {
    transaction: serializeTransaction(transaction),
  };
}

export async function deleteTransactionForUser(
  user: AuthenticatedUser,
  transactionId: string
): Promise<void> {
  const transaction = await Transaction.findOneAndDelete({
    _id: transactionId,
    userId: user.id,
  }).exec();

  if (!transaction) {
    throw new AppError("Transaction not found.", 404);
  }
}

async function findTransactionForUser(userId: string, transactionId: string) {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId,
  }).exec();

  if (!transaction) {
    throw new AppError("Transaction not found.", 404);
  }

  return transaction;
}

function buildTransactionFilters(
  userId: string,
  query: TransactionQueryInput
): Record<string, unknown> {
  const filters: Record<string, unknown> = {
    userId,
  };

  if (query.category) {
    filters.category = createExactMatchRegex(query.category);
  }

  if (query.type) {
    filters.type = query.type;
  }

  if (query.paymentMethod) {
    filters.paymentMethod = createExactMatchRegex(query.paymentMethod);
  }

  const dateExpressions: Record<string, unknown>[] = [];

  if (query.month) {
    dateExpressions.push({
      $eq: [{ $month: "$date" }, query.month],
    });
  }

  if (query.year) {
    dateExpressions.push({
      $eq: [{ $year: "$date" }, query.year],
    });
  }

  if (dateExpressions.length === 1) {
    filters.$expr = dateExpressions[0];
  } else if (dateExpressions.length > 1) {
    filters.$expr = { $and: dateExpressions };
  }

  if (query.search) {
    const regex = createContainsRegex(query.search);
    filters.$or = [{ title: regex }, { note: regex }];
  }

  return filters;
}

function buildTransactionSort(sort: TransactionSort): Record<string, SortOrder> {
  switch (sort) {
    case "oldest":
      return { date: 1, createdAt: 1 };
    case "amount":
      return { amount: -1, date: -1, createdAt: -1 };
    case "newest":
    default:
      return { date: -1, createdAt: -1 };
  }
}

function buildTransactionUpdate(input: UpdateTransactionInput) {
  const update: Partial<TransactionDocument> = {};

  if (input.title !== undefined) {
    update.title = input.title;
  }

  if (input.amount !== undefined) {
    update.amount = input.amount;
  }

  if (input.category !== undefined) {
    update.category = input.category;
  }

  if (input.paymentMethod !== undefined) {
    update.paymentMethod = input.paymentMethod;
  }

  if (input.note !== undefined) {
    update.note = normalizeOptionalString(input.note);
  }

  if (input.date !== undefined) {
    update.date = input.date;
  }

  if (input.receiptImageUrl !== undefined) {
    update.receiptImageUrl = normalizeOptionalString(input.receiptImageUrl);
  }

  if (input.type !== undefined) {
    update.type = input.type;
  }

  return update;
}

export function serializeTransaction(
  transaction: TransactionHydratedDocument
): SerializedTransaction {
  return {
    id: transaction.id,
    title: transaction.title,
    amount: transaction.amount,
    category: transaction.category,
    paymentMethod: transaction.paymentMethod,
    note: transaction.note,
    date: transaction.date.toISOString(),
    receiptImageUrl: transaction.receiptImageUrl,
    type: transaction.type,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}

function normalizeOptionalString(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function createExactMatchRegex(value: string) {
  return new RegExp(`^${escapeRegex(value)}$`, "i");
}

function createContainsRegex(value: string) {
  return new RegExp(escapeRegex(value), "i");
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
