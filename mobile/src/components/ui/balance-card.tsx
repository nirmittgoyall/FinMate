import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

import { AmbientGlow } from "@/components/ui/ambient-glow";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { RevealIn } from "@/components/ui/reveal-in";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";
import { Text, View } from "@/tw";

type BalanceCardProps = {
  balance: number;
  currency: string;
  monthlyBudget: number;
  monthlyExpenses: number;
  budgetProgress: number;
  /** Tighter padding + smaller type, matching the compact dashboard layout. */
  compact?: boolean;
};

export function BalanceCard({
  balance,
  currency,
  monthlyBudget,
  monthlyExpenses,
  budgetProgress,
  compact = false,
}: BalanceCardProps) {
  const [barWidth, setBarWidth] = useState(0);
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const clampedProgress = monthlyBudget > 0 ? Math.max(0, Math.min(budgetProgress, 1)) : 0;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: clampedProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animatedProgress, clampedProgress]);

  const progressWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, barWidth],
  });

  return (
    <RevealIn>
      <View
        className={cn(
          "overflow-hidden rounded-[28px] border border-app-glass-border bg-app-surface-elevated/80",
          compact ? "px-4 py-4" : "px-5 py-5"
        )}
      >
        <AmbientGlow size={compact ? 280 : 380} x={0.78} y={-0.15} />
        <View
          className="absolute inset-x-0 top-0 h-px bg-app-glass-highlight"
          pointerEvents="none"
        />

        <View className="flex-row items-start justify-between gap-4">
          <View className="gap-1">
            <Text className={typography.eyebrow}>AI Balance</Text>
            {!compact ? (
              <Text className={typography.body}>A clean snapshot of what is available right now.</Text>
            ) : null}
          </View>
          <View
            className={cn(
              "items-center justify-center rounded-full bg-app-primary-soft",
              compact ? "h-8 w-8" : "px-3 py-2"
            )}
          >
            <Text
              className={cn(
                "font-medium text-app-primary-strong",
                compact ? "text-[11px]" : "text-[12px]"
              )}
            >
              {compact ? "AI" : getBudgetBadge(monthlyBudget, clampedProgress)}
            </Text>
          </View>
        </View>

        <AnimatedNumber
          className={cn(
            "font-semibold tracking-[-0.06em] text-app-text",
            compact ? "mt-3 text-[32px] leading-[36px]" : "mt-6 text-[46px] leading-[50px]"
          )}
          value={balance}
          formatter={(nextValue) => formatCurrency(nextValue, currency)}
        />

        <View className={cn("gap-2", compact ? "mt-4" : "mt-7 gap-3")}>
          <View className="flex-row items-center justify-between gap-4">
            <Text className={typography.caption}>Budget progress</Text>
            <Text className="text-[13px] font-medium text-app-text">
              {getBudgetHeadline(monthlyBudget, monthlyExpenses, currency, clampedProgress)}
            </Text>
          </View>
          <View
            className="h-2.5 overflow-hidden rounded-full bg-app-surface-muted"
            onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
          >
            <Animated.View
              style={{
                width: progressWidth,
                height: 10,
                borderRadius: 999,
                backgroundColor: clampedProgress >= 0.8 ? colors.danger : colors.primary,
              }}
            />
          </View>
          {!compact ? (
            <Text className={typography.caption}>
              {getBudgetCaption(monthlyBudget, monthlyExpenses, currency, clampedProgress)}
            </Text>
          ) : null}
        </View>
      </View>
    </RevealIn>
  );
}

function getBudgetBadge(monthlyBudget: number, progress: number) {
  if (monthlyBudget <= 0) {
    return "Set budget";
  }

  if (progress >= 1) {
    return "Over limit";
  }

  if (progress >= 0.8) {
    return "Close to limit";
  }

  return "On track";
}

function getBudgetHeadline(
  monthlyBudget: number,
  monthlyExpenses: number,
  currency: string,
  progress: number
) {
  if (monthlyBudget <= 0) {
    return "No budget yet";
  }

  if (progress >= 1) {
    return `${Math.round(progress * 100)}% used`;
  }

  return `${formatCurrency(Math.max(monthlyBudget - monthlyExpenses, 0), currency)} left`;
}

function getBudgetCaption(
  monthlyBudget: number,
  monthlyExpenses: number,
  currency: string,
  progress: number
) {
  if (monthlyBudget <= 0) {
    return "Set your monthly budget in Profile to unlock better alerts and AI health signals.";
  }

  if (progress >= 1) {
    return `${formatCurrency(monthlyExpenses - monthlyBudget, currency)} over the current budget.`;
  }

  return `${formatCurrency(monthlyExpenses, currency)} spent out of ${formatCurrency(monthlyBudget, currency)} this month.`;
}