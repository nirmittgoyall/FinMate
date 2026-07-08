import { useEffect } from "react";

import { AmbientGlow, EmptyState, InsightCard, RevealIn, ScreenWrapper } from "@/components/ui";
import { analyzeTransactions } from "@/features/insights/analyzer";
import { formatCurrency } from "@/lib/utils/format-currency";
import { useAuthStore } from "@/store/auth-store";
import { useTransactionStore } from "@/store/transaction-store";
import { Text, View } from "@/tw";

export default function AnalyticsScreen() {
  const currency = useAuthStore((state) => state.user?.currency ?? "USD");
  const monthlyBudget = useAuthStore((state) => state.user?.monthlyBudget ?? 0);
  const transactions = useTransactionStore((state) => state.transactions);
  const isLoaded = useTransactionStore((state) => state.isLoaded);
  const isLoading = useTransactionStore((state) => state.isLoading);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);

  useEffect(() => {
    void fetchTransactions().catch(() => {});
  }, [fetchTransactions]);

  const analysis = analyzeTransactions({
    transactions,
    monthlyBudget,
    currency,
  });

  return (
    <View className="flex-1 bg-app-bg">
      <AmbientGlow size={420} x={0.5} y={0.02} />

      <ScreenWrapper
        contentClassName="pb-32"
        headerContent={
          <RevealIn>
            <View className="gap-2">
              <Text className="text-[15px] tracking-[-0.02em] text-app-muted">AI Analyzer</Text>
              <Text className="text-[30px] leading-[34px] font-semibold tracking-[-0.04em] text-app-text">
                Clear insights instead of noisy charts.
              </Text>
              <Text className="text-[13px] leading-[18px] text-app-subtle">
                Local rule analysis is active now. Gemini can replace the engine later without changing this screen.
              </Text>
            </View>
          </RevealIn>
        }
      >
        {isLoading && !isLoaded ? (
          <Text className="text-[14px] leading-[20px] text-app-muted">Loading analysis...</Text>
        ) : null}

        {!isLoading && !transactions.length ? (
          <RevealIn index={1}>
            <EmptyState
              iconName="sparkles-outline"
              title="Nothing to analyze yet"
              description="Add a few income or expense transactions and FinMate will start showing monthly summaries, spending pressure, and suggestions here."
            />
          </RevealIn>
        ) : null}

        {!isLoading && transactions.length ? (
          <>
            <RevealIn index={1}>
              <InsightCard
                eyebrow="Monthly Summary"
                title="How this period feels"
                description={analysis.summary}
                badge={`Engine: ${analysis.engine}`}
                iconName="moon-outline"
                tone="primary"
                className="rounded-[24px] px-4 py-4"
              />
            </RevealIn>

            <RevealIn index={2}>
              <InsightCard
                eyebrow="Top Spending"
                title={analysis.topCategory?.label ?? "No expense category yet"}
                description={
                  analysis.topCategory
                    ? `${formatCurrency(analysis.topCategory.amount, currency)} tracked in your biggest category.`
                    : "Once expenses are logged, the top pressure point will appear here."
                }
                badge={
                  analysis.topCategory
                    ? `${Math.round(analysis.topCategoryShare * 100)}% of spending`
                    : "Awaiting data"
                }
                iconName="pie-chart-outline"
                tone="neutral"
                className="rounded-[24px] px-4 py-4"
              />
            </RevealIn>

            <RevealIn index={3}>
              <InsightCard
                eyebrow="Budget Health"
                title={analysis.budgetHealthLabel}
                description={analysis.budgetWarning}
                badge={monthlyBudget > 0 ? `${Math.round(analysis.budgetUsage * 100)}% used` : "No budget"}
                iconName="shield-checkmark-outline"
                tone={analysis.budgetUsage >= 1 ? "danger" : analysis.budgetUsage >= 0.8 ? "primary" : "success"}
                className="rounded-[24px] px-4 py-4"
              />
            </RevealIn>

            <RevealIn index={4}>
              <InsightCard
                eyebrow="Suggestions"
                title="Practical next moves"
                description="Simple actions based on your current transaction pattern."
                iconName="bulb-outline"
                tone="neutral"
                className="rounded-[24px] px-4 py-4"
              >
                {analysis.suggestions.map((suggestion) => (
                  <View
                    key={suggestion}
                    className="flex-row items-start gap-3 rounded-[20px] bg-app-surface-muted px-4 py-3"
                  >
                    <View className="mt-1.5 h-2.5 w-2.5 rounded-full bg-app-primary" />
                    <Text className="flex-1 text-[14px] leading-[20px] text-app-text">{suggestion}</Text>
                  </View>
                ))}
              </InsightCard>
            </RevealIn>

            <RevealIn index={5}>
              <InsightCard
                eyebrow="Recent Patterns"
                title="Behavior showing up now"
                description={analysis.monthAnalysis}
                iconName="pulse-outline"
                tone="neutral"
                className="rounded-[24px] px-4 py-4"
              >
                {analysis.recentPatterns.map((pattern) => (
                  <View key={pattern} className="rounded-[20px] bg-app-surface-muted px-4 py-3">
                    <Text className="text-[14px] leading-[20px] text-app-text">{pattern}</Text>
                  </View>
                ))}
              </InsightCard>
            </RevealIn>
          </>
        ) : null}
      </ScreenWrapper>
    </View>
  );
}