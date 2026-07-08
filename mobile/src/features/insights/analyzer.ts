import { formatCurrency } from "@/lib/utils/format-currency";
import type { Transaction } from "@/types/transaction";

export type AnalysisEngine = "local" | "gemini";

export type AiAnalysis = {
  engine: "local";
  summary: string;
  monthAnalysis: string;
  topCategory: { label: string; amount: number } | null;
  topCategoryShare: number;
  budgetUsage: number;
  budgetHealthLabel: string;
  budgetWarning: string;
  suggestions: string[];
  recentPatterns: string[];
};

type AnalyzeTransactionsInput = {
  transactions: Transaction[];
  monthlyBudget: number;
  currency: string;
  engine?: AnalysisEngine;
  geminiConfigured?: boolean;
};

export function analyzeTransactions({
  transactions,
  monthlyBudget,
  currency,
  engine = "local",
  geminiConfigured = false,
}: AnalyzeTransactionsInput): AiAnalysis {
  if (engine === "gemini" && geminiConfigured) {
    return buildLocalAnalysis(transactions, monthlyBudget, currency);
  }

  return buildLocalAnalysis(transactions, monthlyBudget, currency);
}

function buildLocalAnalysis(
  transactions: Transaction[],
  monthlyBudget: number,
  currency: string
): AiAnalysis {
  const currentMonthTransactions = transactions.filter((transaction) =>
    isCurrentMonth(transaction.date)
  );
  const scopedTransactions = currentMonthTransactions.length
    ? currentMonthTransactions
    : transactions;

  const income = sumTransactions(scopedTransactions, "income");
  const expenses = sumTransactions(scopedTransactions, "expense");
  const expenseTransactions = scopedTransactions.filter(
    (transaction) => transaction.type === "expense"
  );
  const topCategory = getTopExpenseCategory(scopedTransactions);
  const topCategoryShare =
    topCategory && expenses > 0 ? topCategory.amount / expenses : 0;
  const budgetUsage = monthlyBudget > 0 ? expenses / monthlyBudget : 0;
  const budgetUsagePercent = Math.round(budgetUsage * 100);
  const remainingBudget = Math.max(monthlyBudget - expenses, 0);
  const topPaymentMethod = getTopPaymentMethod(scopedTransactions);
  const averageExpense = expenseTransactions.length ? expenses / expenseTransactions.length : 0;

  let summary = "Your spending is currently under control and within a healthy range.";

  if (expenses > income && expenses > 0) {
    summary =
      "Expenses are higher than income in your latest activity, so cash flow needs attention.";
  } else if (monthlyBudget > 0 && budgetUsage >= 0.8) {
    summary =
      "You are getting close to your monthly budget limit, so non-essential spending should be reviewed.";
  } else if (expenses === 0 && income > 0) {
    summary =
      "You have only logged income in the latest period, so there is no expense pressure yet.";
  }

  const monthPrefix = currentMonthTransactions.length
    ? "This month"
    : "No transactions were recorded this month, so this uses your latest activity";

  const monthAnalysis = `${monthPrefix}: income is ${formatCurrency(
    income,
    currency
  )} and expenses are ${formatCurrency(expenses, currency)}.`;

  let budgetWarning = "No monthly budget is set yet. Add one in Profile for budget alerts.";
  let budgetHealthLabel = "Budget needed";

  if (monthlyBudget > 0 && budgetUsage >= 1) {
    budgetHealthLabel = "Over limit";
    budgetWarning = `You have used ${budgetUsagePercent}% of your budget and are over by ${formatCurrency(
      expenses - monthlyBudget,
      currency
    )}.`;
  } else if (monthlyBudget > 0 && budgetUsage >= 0.8) {
    budgetHealthLabel = "Watch closely";
    budgetWarning = `You have used ${budgetUsagePercent}% of your budget. Only ${formatCurrency(
      remainingBudget,
      currency
    )} is left for the month.`;
  } else if (monthlyBudget > 0) {
    budgetHealthLabel = "Healthy";
    budgetWarning = `You have used ${budgetUsagePercent}% of your budget and still have ${formatCurrency(
      remainingBudget,
      currency
    )} remaining.`;
  }

  const suggestions: string[] = [];

  if (expenses > income && expenses > 0) {
    suggestions.push(
      "Reduce a few flexible expenses until income is back ahead of spending."
    );
  }

  if (topCategory?.label === "Food") {
    suggestions.push(
      "Food is your top category, so meal planning or fewer delivery orders could help."
    );
  }

  if (topCategory?.label === "Shopping") {
    suggestions.push(
      "Shopping is your biggest spend, so delaying non-essential purchases would lower pressure quickly."
    );
  }

  if (monthlyBudget > 0 && budgetUsage >= 0.8) {
    suggestions.push(
      "Pause discretionary spending until next month or raise the budget if this level is expected."
    );
  }

  if (!suggestions.length) {
    suggestions.push(
      "Spending looks balanced right now. Keep logging transactions to maintain the trend."
    );
  }

  const recentPatterns: string[] = [];

  if (topPaymentMethod) {
    recentPatterns.push(`${topPaymentMethod} is the most used payment method right now.`);
  }

  if (expenseTransactions.length) {
    recentPatterns.push(
      `Average expense size is ${formatCurrency(averageExpense, currency)} in the active period.`
    );
  }

  if (topCategory) {
    recentPatterns.push(
      `${topCategory.label} accounts for ${Math.round(
        topCategoryShare * 100
      )}% of tracked spending in this view.`
    );
  }

  if (!recentPatterns.length) {
    recentPatterns.push("Add a few transactions and recent behavior patterns will start to appear.");
  }

  return {
    engine: "local",
    summary,
    monthAnalysis,
    topCategory,
    topCategoryShare,
    budgetUsage,
    budgetHealthLabel,
    budgetWarning,
    suggestions,
    recentPatterns,
  };
}

function sumTransactions(
  transactions: Transaction[],
  type: Transaction["type"]
) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

function getTopExpenseCategory(transactions: Transaction[]) {
  const totals = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    totals.set(
      transaction.category,
      (totals.get(transaction.category) ?? 0) + transaction.amount
    );
  }

  let topCategory: { label: string; amount: number } | null = null;

  for (const [label, amount] of totals.entries()) {
    if (!topCategory || amount > topCategory.amount) {
      topCategory = { label, amount };
    }
  }

  return topCategory;
}

function getTopPaymentMethod(transactions: Transaction[]) {
  const totals = new Map<string, number>();

  for (const transaction of transactions) {
    totals.set(
      transaction.paymentMethod,
      (totals.get(transaction.paymentMethod) ?? 0) + 1
    );
  }

  let topPaymentMethod: string | null = null;
  let topCount = 0;

  for (const [paymentMethod, count] of totals.entries()) {
    if (count > topCount) {
      topPaymentMethod = paymentMethod;
      topCount = count;
    }
  }

  return topPaymentMethod;
}

function isCurrentMonth(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}
