import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";
import { Pressable, Text, View } from "@/tw";
import { typography } from "@/constants/typography";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: ComponentProps<typeof Pressable>["onPress"];
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  onActionPress,
  className,
}: SectionHeaderProps) {
  return (
    <View className={cn("flex-row items-end justify-between gap-4", className)}>
      <View className="flex-1 gap-2">
        {eyebrow ? <Text className={typography.eyebrow}>{eyebrow}</Text> : null}
        <Text className={typography.sectionTitle}>{title}</Text>
        {subtitle ? <Text className={typography.caption}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable
          android_ripple={{ color: "rgba(124, 92, 255, 0.12)" }}
          onPress={onActionPress}
          className="rounded-full bg-app-surface-muted px-4 py-3"
        >
          <Text className="text-[13px] font-medium text-app-primary-strong">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
