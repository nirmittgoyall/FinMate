import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { getCategoryIcon } from "@/lib/utils/category-icon";
import { formatCurrency } from "@/lib/utils/format-currency";
import { Text, View } from "@/tw";

type CategorySpendCardProps = {
  category: string;
  amount: number;
  currency: string;
  share: number; // 0-1, this category's fraction of total spend in scope
};

export function CategorySpendCard({
  category,
  amount,
  currency,
  share,
}: CategorySpendCardProps) {
  return (
    <View className="w-[152px] gap-3 rounded-[24px] border border-app-border bg-app-surface px-4 py-4">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-app-surface-elevated">
        <Ionicons name={getCategoryIcon(category)} size={18} color={colors.primaryStrong} />
      </View>
      <View className="gap-1">
        <Text className="text-[14px] font-medium text-app-text" numberOfLines={1}>
          {category}
        </Text>
        <Text className="text-[17px] font-semibold tracking-[-0.03em] text-app-text">
          {formatCurrency(amount, currency)}
        </Text>
        <Text className="text-[12px] text-app-subtle">
          {Math.round(share * 100)}% of spending
        </Text>
      </View>
    </View>
  );
}