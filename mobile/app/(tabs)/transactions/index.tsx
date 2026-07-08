import { useDeferredValue, useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  EmptyState,
  FloatingButton,
  Input,
  ScreenWrapper,
  SectionHeader,
  TransactionCard,
} from "@/components/ui";
import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import { useTransactionStore } from "@/store/transaction-store";
import { Pressable, Text, View } from "@/tw";

type TransactionFilter = "all" | "income" | "expense";

const filters: TransactionFilter[] = ["all", "income", "expense"];

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const currency = useAuthStore((state) => state.user?.currency ?? "USD");
  const transactions = useTransactionStore((state) => state.transactions);
  const error = useTransactionStore((state) => state.error);
  const deletingTransactionId = useTransactionStore(
    (state) => state.deletingTransactionId
  );
  const isLoaded = useTransactionStore((state) => state.isLoaded);
  const isLoading = useTransactionStore((state) => state.isLoading);
  const isRefreshing = useTransactionStore((state) => state.isRefreshing);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
  const refreshTransactions = useTransactionStore((state) => state.refreshTransactions);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    void fetchTransactions().catch(() => {});
  }, [fetchTransactions]);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === "all" ? true : transaction.type === filter;
    const matchesQuery = normalizedQuery
      ? [
          transaction.title,
          transaction.category,
          transaction.paymentMethod,
          transaction.note ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      : true;

    return matchesFilter && matchesQuery;
  });

  return (
    <View className="flex-1 bg-app-bg">
      <ScreenWrapper
        contentClassName="pb-28"
        headerContent={
          <View className="gap-2">
            <Text className="text-[15px] tracking-[-0.02em] text-app-muted">Transactions</Text>
            <Text className="text-[34px] leading-[38px] font-semibold tracking-[-0.05em] text-app-text">
              Every movement, quietly organized.
            </Text>
            <Text className="text-[13px] leading-[18px] text-app-subtle">
              Search, filter, and swipe to remove entries you no longer need.
            </Text>
          </View>
        }
      >
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search transactions"
          leadingSlot={<Ionicons name="search-outline" size={18} color={colors.muted} />}
        />

        <View className="flex-row gap-3">
          {filters.map((item) => {
            const isActive = item === filter;

            return (
              <Pressable
                key={item}
                android_ripple={{ color: "rgba(124, 92, 255, 0.12)" }}
                onPress={() => setFilter(item)}
                className={cn(
                  "flex-1 rounded-full border px-4 py-3",
                  isActive
                    ? "border-app-primary bg-app-primary-soft"
                    : "border-app-border bg-app-surface-muted"
                )}
              >
                <Text
                  className={cn(
                    "text-center text-[13px] font-medium capitalize",
                    isActive ? "text-app-primary-strong" : "text-app-muted"
                  )}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionHeader
          title="Activity"
          subtitle={`${filteredTransactions.length} shown`}
          actionLabel={isRefreshing ? "Refreshing..." : "Refresh"}
          onActionPress={() => {
            if (isRefreshing) {
              return;
            }

            void refreshTransactions().catch(() => {});
          }}
        />

        {isLoading && !isLoaded ? (
          <Text className="text-[14px] leading-[20px] text-app-muted">
            Loading transactions...
          </Text>
        ) : null}

        {error ? (
          <EmptyState
            iconName="alert-circle-outline"
            title="History is unavailable"
            description={error}
            actionLabel={isRefreshing ? "Refreshing..." : "Retry"}
            onActionPress={() => {
              if (isRefreshing) {
                return;
              }

              void refreshTransactions().catch(() => {});
            }}
          />
        ) : null}

        {!isLoading && !error && filteredTransactions.length ? (
          <View className="gap-3">
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                title={transaction.title}
                category={transaction.category}
                paymentMethod={transaction.paymentMethod}
                date={formatTransactionDate(transaction.date)}
                amount={transaction.amount}
                type={transaction.type}
                currency={currency}
                actionLabel={deletingTransactionId === transaction.id ? "Deleting..." : "Delete"}
                actionDisabled={deletingTransactionId !== null}
                onActionPress={() => {
                  void deleteTransaction(transaction.id).catch(() => {});
                }}
              />
            ))}
          </View>
        ) : null}

        {!isLoading && !error && !filteredTransactions.length ? (
          <EmptyState
            iconName="search-outline"
            title="Nothing matches this view"
            description={
              query || filter !== "all"
                ? "Try another search or switch back to all transactions."
                : "Add your first transaction to start your history."
            }
            actionLabel={query || filter !== "all" ? "Clear filters" : "Add transaction"}
            onActionPress={() => {
              if (query || filter !== "all") {
                setQuery("");
                setFilter("all");
                return;
              }

              router.push("/(tabs)/transactions/add");
            }}
          />
        ) : null}
      </ScreenWrapper>

      <View
        className="absolute right-6"
        style={{ bottom: Math.max(insets.bottom + 88, 104) }}
      >
        <FloatingButton
          iconName="add"
          label="Add"
          onPress={() => router.push("/(tabs)/transactions/add")}
        />
      </View>
    </View>
  );
}

const transactionDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatTransactionDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return transactionDateFormatter.format(date);
}
