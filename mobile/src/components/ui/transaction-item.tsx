import { typography } from "@/constants/typography";
import { formatCurrency } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils/cn";
import { Text, View } from "@/tw";

type TransactionItemProps = {
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "expense" | "income";
  className?: string;
};

export function TransactionItem({
  title,
  category,
  date,
  amount,
  type,
  className,
}: TransactionItemProps) {
  const toneClass = type === "expense" ? "text-app-text" : "text-app-success";
  const signedAmount = `${type === "expense" ? "-" : "+"}${formatCurrency(amount)}`;

  return (
    <View
      className={cn(
        "flex-row items-center justify-between rounded-[24px] border border-app-border bg-app-surface px-4 py-4",
        className
      )}
    >
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-app-surface-elevated">
          <Text className="text-[13px] font-medium text-app-text">
            {title.slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className={typography.cardTitle}>{title}</Text>
          <View className="flex-row items-center gap-2">
            <Text className={typography.caption}>{category}</Text>
            <Text className="text-app-border-strong">•</Text>
            <Text className={typography.caption}>{date}</Text>
          </View>
        </View>
      </View>
      <Text className={cn(typography.money, toneClass)} selectable>
        {signedAmount}
      </Text>
    </View>
  );
}
