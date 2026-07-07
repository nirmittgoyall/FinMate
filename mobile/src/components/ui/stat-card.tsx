import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { Text, View } from "@/tw";

type StatCardTone = "primary" | "success" | "neutral";

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  caption?: string;
  tone?: StatCardTone;
  className?: string;
};

const toneStyles: Record<StatCardTone, string> = {
  primary: "bg-app-surface-elevated border-app-border-strong",
  success: "bg-app-success-soft border-app-border",
  neutral: "bg-app-surface border-app-border",
};

const badgeStyles: Record<StatCardTone, string> = {
  primary: "bg-app-primary-soft text-app-primary",
  success: "bg-app-success text-app-bg",
  neutral: "bg-app-surface-muted text-app-muted",
};

export function StatCard({
  label,
  value,
  change,
  caption,
  tone = "neutral",
  className,
}: StatCardProps) {
  return (
    <View
      className={cn(
        "flex-1 gap-4 rounded-[28px] border px-4 py-5",
        toneStyles[tone],
        className
      )}
    >
      <View className="gap-2">
        <Text className={typography.eyebrow}>{label}</Text>
        <Text className={typography.metric} selectable>
          {value}
        </Text>
      </View>
      {change || caption ? (
        <View className="gap-2">
          {change ? (
            <Text
              className={cn(
                "self-start rounded-full px-3 py-1 text-[12px] font-medium",
                badgeStyles[tone]
              )}
            >
              {change}
            </Text>
          ) : null}
          {caption ? <Text className={typography.caption}>{caption}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}
