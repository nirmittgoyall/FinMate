import type { ComponentProps, ReactNode } from "react";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { Text, View } from "@/tw";

type InsightCardTone = "primary" | "neutral" | "success" | "danger";
type IconName = ComponentProps<typeof Ionicons>["name"];

type InsightCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  iconName?: IconName;
  tone?: InsightCardTone;
  children?: ReactNode;
  className?: string;
};

const surfaceStyles: Record<InsightCardTone, string> = {
  primary: "bg-app-surface-elevated border-app-border-strong",
  neutral: "bg-app-surface border-app-border",
  success: "bg-app-success-soft border-app-border",
  danger: "bg-app-primary-soft border-app-border",
};

const iconSurfaceStyles: Record<InsightCardTone, string> = {
  primary: "bg-app-primary-soft",
  neutral: "bg-app-surface-muted",
  success: "bg-app-surface",
  danger: "bg-app-surface",
};

const badgeStyles: Record<InsightCardTone, string> = {
  primary: "bg-app-primary-soft text-app-primary-strong",
  neutral: "bg-app-surface-muted text-app-muted",
  success: "bg-app-surface text-app-success",
  danger: "bg-app-surface text-app-danger",
};

function getToneColor(tone: InsightCardTone) {
  switch (tone) {
    case "success":
      return colors.success;
    case "danger":
      return colors.warning;
    case "neutral":
      return colors.secondary;
    default:
      return colors.primaryStrong;
  }
}

export function InsightCard({
  eyebrow,
  title,
  description,
  badge,
  iconName = "sparkles-outline",
  tone = "neutral",
  children,
  className,
}: InsightCardProps) {
  return (
    <View
      className={cn(
        "rounded-[30px] border px-5 py-5",
        surfaceStyles[tone],
        className
      )}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-2">
          {eyebrow ? <Text className={typography.eyebrow}>{eyebrow}</Text> : null}
          <Text className={typography.cardTitle}>{title}</Text>
          {description ? <Text className={typography.body}>{description}</Text> : null}
        </View>
        <View
          className={cn(
            "h-12 w-12 items-center justify-center rounded-full",
            iconSurfaceStyles[tone]
          )}
        >
          <Ionicons name={iconName} size={20} color={getToneColor(tone)} />
        </View>
      </View>
      {badge ? (
        <Text className={cn("mt-4 self-start rounded-full px-3 py-1 text-[12px] font-medium", badgeStyles[tone])}>
          {badge}
        </Text>
      ) : null}
      {children ? <View className="mt-4 gap-3">{children}</View> : null}
    </View>
  );
}
