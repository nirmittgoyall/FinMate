import { Card, ScreenWrapper, StatCard } from "@/components/ui";
import { View } from "@/tw";

export default function AnalyticsScreen() {
  return (
    <ScreenWrapper
      eyebrow="Insights"
      title="Analytics"
      subtitle="Dark stat modules ready for trends, category mix, anomaly detection, and AI commentary."
    >
      <View className="flex-row gap-3">
        <StatCard
          label="Runway"
          value="41 days"
          change="Stable"
          caption="Based on current burn rate"
          tone="neutral"
        />
        <StatCard
          label="Largest category"
          value="Food"
          change="32%"
          caption="of monthly spend"
          tone="primary"
        />
      </View>
      <Card
        title="Forecast module"
        description="Reserve this surface for a premium chart or narrative card summarizing projected spend."
        variant="elevated"
      />
      <Card
        title="Behavioral signals"
        description="This section can later compare habits, recurring drift, and unusual spikes without changing the core layout language."
      />
    </ScreenWrapper>
  );
}
