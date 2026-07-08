import { useEffect, useMemo } from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  AmbientGlow,
  BalanceCard,
  CategorySpendCard,
  RevealIn,
  ScreenWrapper,
  SectionHeader,
  StatCard,
} from "@/components/ui";
import { colors } from "@/constants/colors";
import { formatCurrency } from "@/lib/utils/format-currency";
import { useAuthStore } from "@/store/auth-store";
import { useTransactionStore } from "@/store/transaction-store";
import { Pressable, ScrollView, Text, View } from "@/tw";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const transactions = useTransactionStore((state) => state.transactions);
  const isLoaded = useTransactionStore((state) => state.isLoaded);
  const isLoading = useTransactionStore((state) => state.isLoading);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);

  useEffect(() => {
    void fetchTransactions().catch(() => {});
  }, [fetchTransactions]);

  const currency = user?.currency ?? "USD";
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const currentBalance = totalIncome - totalExpenses;
  const monthlyBudget = user?.monthlyBudget ?? 0;
  const monthlyExpenses = transactions
    .filter(
      (transaction) => transaction.type === "expense" && isCurrentMonth(transaction.date)
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const budgetProgress = monthlyBudget > 0 ? monthlyExpenses / monthlyBudget : 0;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const categorySpend = useMemo(() => {
    const totals = new Map<string, number>();

    for (const transaction of transactions) {
      if (transaction.type !== "expense" || !isCurrentMonth(transaction.date)) {
        continue;
      }

      totals.set(
        transaction.category,
        (totals.get(transaction.category) ?? 0) + transaction.amount
      );
    }

    return Array.from(totals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((left, right) => right.amount - left.amount);
  }, [transactions]);

  return (
    <View className="flex-1 bg-app-bg">
      <AmbientGlow size={420} x={0.5} y={0.02} />

      <ScreenWrapper
        contentClassName="pb-32"
        headerContent={
          <RevealIn>
            <View className="gap-5">
              <View className="flex-row items-center justify-between">
                <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-app-surface-muted">
                  <Ionicons name="menu-outline" size={20} color={colors.text} />
                </Pressable>
                <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-app-surface-muted">
                  <Ionicons name="notifications-outline" size={19} color={colors.text} />
                  <View className="absolute right-3 top-3 h-2 w-2 rounded-full bg-app-danger" />
                </Pressable>
              </View>

              <View className="gap-1">
                <Text className="text-[15px] tracking-[-0.02em] text-app-muted">
                  {getGreeting()}, {firstName}
                </Text>
                <Text className="text-[30px] leading-[34px] font-semibold tracking-[-0.04em] text-app-text">
                  Dashboard
                </Text>
              </View>
            </View>
          </RevealIn>
        }
      >
        <BalanceCard
          compact
          balance={currentBalance}
          currency={currency}
          monthlyBudget={monthlyBudget}
          monthlyExpenses={monthlyExpenses}
          budgetProgress={budgetProgress}
        />

        <RevealIn index={1}>
          <View className="flex-row gap-3">
            <StatCard
              label="Income"
              value={formatCurrency(totalIncome, currency)}
              tone="success"
              iconName="arrow-down-circle-outline"
              className="gap-2 rounded-[22px] px-4 py-4"
            />
            <StatCard
              label="Expense"
              value={formatCurrency(totalExpenses, currency)}
              tone="primary"
              iconName="arrow-up-circle-outline"
              className="gap-2 rounded-[22px] px-4 py-4"
            />
          </View>
        </RevealIn>

        <RevealIn index={2}>
          <View className="gap-3">
            <SectionHeader
              title="Top Categories"
              subtitle="Spending this month, by category"
              actionLabel="View all"
              onActionPress={() => {}}
            />

            {isLoading && !isLoaded ? (
              <Text className="text-[13px] text-app-muted">Loading categories...</Text>
            ) : null}

            {!isLoading && categorySpend.length ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-3 pr-1"
              >
                {categorySpend.map((item) => (
                  <CategorySpendCard
                    key={item.category}
                    category={item.category}
                    amount={item.amount}
                    currency={currency}
                    share={monthlyExpenses > 0 ? item.amount / monthlyExpenses : 0}
                  />
                ))}
              </ScrollView>
            ) : null}

            {!isLoading && !categorySpend.length ? (
              <Text className="text-[13px] text-app-subtle">
                No expenses logged this month yet — categories will show up here once you add some.
              </Text>
            ) : null}
          </View>
        </RevealIn>
      </ScreenWrapper>
    </View>
  );
}

function isCurrentMonth(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}