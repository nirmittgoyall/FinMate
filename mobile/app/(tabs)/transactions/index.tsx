import { useEffect } from "react";

import { Link } from "expo-router";

import { Button, Card, ScreenWrapper, TransactionItem } from "@/components/ui";
import { useTransactionStore } from "@/store/transaction-store";
import { Text, View } from "@/tw";

export default function TransactionsScreen() {
  const transactions = useTransactionStore((state) => state.transactions);
  const error = useTransactionStore((state) => state.error);
  const isLoaded = useTransactionStore((state) => state.isLoaded);
  const isLoading = useTransactionStore((state) => state.isLoading);
  const isRefreshing = useTransactionStore((state) => state.isRefreshing);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
  const refreshTransactions = useTransactionStore(
    (state) => state.refreshTransactions
  );

  useEffect(() => {
    void fetchTransactions().catch(() => {});
  }, [fetchTransactions]);

  return (
    <ScreenWrapper
      eyebrow="Ledger"
      title="Transactions"
      subtitle="Live transaction history from the backend, ready for filters, detail routes, and AI-powered analysis."
    >
      <Card
        eyebrow="Recent"
        title="Latest movement"
        description="The list is now backed by the authenticated transactions API instead of static placeholder rows."
        variant="elevated"
      >
        {isLoading && !isLoaded ? (
          <Text className="text-[13px] leading-[18px] text-app-subtle">
            Loading transactions from the backend...
          </Text>
        ) : null}

        {!isLoading && transactions.length ? (
          <View className="gap-3">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                title={transaction.title}
                category={transaction.category}
                date={formatTransactionDate(transaction.date)}
                amount={transaction.amount}
                type={transaction.type}
              />
            ))}
          </View>
        ) : null}

        {!isLoading && !transactions.length && !error ? (
          <View className="gap-3 rounded-[24px] border border-dashed border-app-border bg-app-surface px-4 py-5">
            <Text className="text-[14px] font-medium text-app-text">
              No transactions yet.
            </Text>
            <Text className="text-[13px] leading-[18px] text-app-subtle">
              Create your first income or expense entry to start building your history.
            </Text>
          </View>
        ) : null}

        {error ? (
          <View className="gap-3 rounded-[24px] border border-app-danger bg-app-surface px-4 py-5">
            <Text className="text-[14px] font-medium text-app-danger">
              {error}
            </Text>
            <Button
              variant="secondary"
              disabled={isRefreshing}
              onPress={() => {
                void refreshTransactions().catch(() => {});
              }}
            >
              {isRefreshing ? "Retrying..." : "Retry"}
            </Button>
          </View>
        ) : null}
      </Card>

      <View className="flex-row gap-3">
        <Link href="/(tabs)/transactions/add" asChild>
          <Button className="flex-1">Add transaction</Button>
        </Link>
        <Button
          variant="secondary"
          className="flex-1"
          disabled={isLoading || isRefreshing}
          onPress={() => {
            void refreshTransactions().catch(() => {});
          }}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const transactionDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});

function formatTransactionDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  return isSameDay ? "Today" : transactionDateFormatter.format(date);
}
