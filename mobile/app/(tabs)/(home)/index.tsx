import { Link } from "expo-router";

import { Button, Card, ScreenWrapper, StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/utils/format-currency";
import { useAuthStore } from "@/store/auth-store";
import { Text, View } from "@/tw";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <ScreenWrapper
      eyebrow="Overview"
      title="FinMate AI"
      subtitle="Dark, calm surfaces for balances, spending signals, and the next action that matters."
      headerSlot={
        <View className="self-start rounded-full border border-app-border-strong bg-app-surface px-4 py-2">
          <Text className="text-[13px] font-medium text-app-muted">
            Signed in as {user?.email ?? "guest"}
          </Text>
        </View>
      }
    >
      <View className="flex-row gap-3">
        <StatCard
          label="Spend this month"
          value={formatCurrency(1840)}
          change="+12.4%"
          caption="vs. last month"
          tone="primary"
        />
        <StatCard
          label="Saved"
          value={formatCurrency(620)}
          change="On track"
          caption="Monthly goal"
          tone="success"
        />
      </View>

      <Card
        eyebrow="Insights"
        title="AI snapshot"
        description="Dining and subscriptions are driving most of the weekly movement. The current design leaves room for future AI summaries without changing the layout system."
        variant="elevated"
      >
        <View className="gap-3">
          <View className="rounded-[22px] border border-app-border bg-app-surface px-4 py-4">
            <Text className="text-[14px] font-medium text-app-text">
              Food delivery is 18% above your average.
            </Text>
            <Text className="mt-1 text-[13px] leading-[18px] text-app-subtle">
              Consider adding a weekly cap and surfacing it on the dashboard.
            </Text>
          </View>
          <Link href="/(tabs)/transactions/add" asChild>
            <Button fullWidth={false}>Add transaction</Button>
          </Link>
        </View>
      </Card>

      <View className="flex-row gap-3">
        <Card
          title="Cash flow"
          description="Income and expense charts can occupy this compact module later."
          className="flex-1"
        />
        <Card
          title="Upcoming"
          description="Recurring bills, due dates, and nudges fit here without crowding the main hero."
          className="flex-1"
        />
      </View>
    </ScreenWrapper>
  );
}
