import type { ComponentProps } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

import { colors } from "@/constants/colors";
import { formatCurrency } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils/cn";
import { Text, Pressable, View } from "@/tw";
import { typography } from "@/constants/typography";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type TransactionCardProps = {
  title: string;
  category: string;
  paymentMethod: string;
  date: string;
  amount: number;
  type: "expense" | "income";
  currency?: string;
  className?: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  onActionPress?: () => void;
};

export function TransactionCard({
  title,
  category,
  paymentMethod,
  date,
  amount,
  type,
  currency = "USD",
  className,
  actionLabel,
  actionDisabled = false,
  onActionPress,
}: TransactionCardProps) {
  const signedAmount = `${type === "expense" ? "-" : "+"}${formatCurrency(amount, currency)}`;
  const iconName = getTransactionIcon(category, type);
  const iconColor = type === "income" ? colors.success : colors.primaryStrong;
  const amountClassName = type === "income" ? "text-app-success" : "text-app-text";

  const card = (
    <View
      className={cn(
        "flex-row items-center justify-between gap-4 rounded-[28px] border border-app-border bg-app-surface px-4 py-4",
        className
      )}
    >
      <View className="flex-1 flex-row items-center gap-4">
        <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-app-surface-elevated">
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>
        <View className="flex-1 gap-1.5">
          <Text className={typography.cardTitle}>{title}</Text>
          <Text className={typography.caption}>{category}</Text>
          <View className="flex-row items-center gap-2">
            <View className="rounded-full bg-app-surface-muted px-3 py-1">
              <Text className="text-[12px] font-medium text-app-muted">{paymentMethod}</Text>
            </View>
            <Text className={typography.caption}>{date}</Text>
          </View>
        </View>
      </View>
      <View className="items-end gap-1">
        <Text className={cn(typography.money, amountClassName)} selectable>
          {signedAmount}
        </Text>
        <Text className={typography.caption}>{type === "income" ? "Income" : "Expense"}</Text>
      </View>
    </View>
  );

  if (!actionLabel || !onActionPress) {
    return card;
  }

  return (
    <Swipeable
      enabled={!actionDisabled}
      friction={2}
      overshootRight={false}
      renderRightActions={() => (
        <View className="ml-3 justify-center">
          <Pressable
            android_ripple={{ color: "rgba(255, 255, 255, 0.14)" }}
            disabled={actionDisabled}
            onPress={onActionPress}
            className={cn(
              "min-h-[104px] min-w-[96px] items-center justify-center rounded-[28px] px-4",
              actionDisabled ? "bg-app-surface-muted opacity-50" : "bg-app-danger"
            )}
          >
            <Ionicons name="trash-outline" size={18} color={colors.contrast} />
            <Text className="mt-2 text-[13px] font-medium text-app-contrast">{actionLabel}</Text>
          </Pressable>
        </View>
      )}
    >
      {card}
    </Swipeable>
  );
}

function getTransactionIcon(category: string, type: "expense" | "income"): IconName {
  const categoryMap: Record<string, IconName> = {
    Food: "restaurant-outline",
    Transport: "car-sport-outline",
    Shopping: "bag-handle-outline",
    Bills: "receipt-outline",
    Health: "heart-outline",
    Education: "school-outline",
    Entertainment: "film-outline",
    Rent: "home-outline",
    Travel: "airplane-outline",
    Salary: "briefcase-outline",
    Freelance: "laptop-outline",
    Business: "storefront-outline",
    Gift: "gift-outline",
    Investment: "trending-up-outline",
    Other: "ellipse-outline",
  };

  return categoryMap[category] ?? (type === "income" ? "arrow-down-circle-outline" : "arrow-up-circle-outline");
}
