import type { Request, Response } from "express";

import { AppError } from "../utils/app-error";
import {
  createTransactionForUser,
  deleteTransactionForUser,
  getTransactionByIdForUser,
  listTransactionsForUser,
  updateTransactionForUser,
} from "../services/transaction.service";
import {
  createTransactionSchema,
  transactionParamsSchema,
  transactionQuerySchema,
  updateTransactionSchema,
} from "../validators/transaction.schema";

export async function createTransaction(request: Request, response: Response) {
  const user = requireAuthenticatedUser(request);
  const input = createTransactionSchema.parse(request.body);
  const result = await createTransactionForUser(user, input);

  response.status(201).json(result);
}

export async function listTransactions(request: Request, response: Response) {
  const user = requireAuthenticatedUser(request);
  const query = transactionQuerySchema.parse(request.query);
  const result = await listTransactionsForUser(user, query);

  response.status(200).json(result);
}

export async function getTransaction(request: Request, response: Response) {
  const user = requireAuthenticatedUser(request);
  const params = transactionParamsSchema.parse(request.params);
  const result = await getTransactionByIdForUser(user, params.id);

  response.status(200).json(result);
}

export async function updateTransaction(request: Request, response: Response) {
  const user = requireAuthenticatedUser(request);
  const params = transactionParamsSchema.parse(request.params);
  const input = updateTransactionSchema.parse(request.body);
  const result = await updateTransactionForUser(user, params.id, input);

  response.status(200).json(result);
}

export async function deleteTransaction(request: Request, response: Response) {
  const user = requireAuthenticatedUser(request);
  const params = transactionParamsSchema.parse(request.params);
  await deleteTransactionForUser(user, params.id);

  response.status(204).send();
}

function requireAuthenticatedUser(request: Request) {
  if (!request.user) {
    throw new AppError("Authentication is required.", 401);
  }

  return request.user;
}
