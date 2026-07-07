import type { ReactNode } from "react";

import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { ScrollView, Text, View } from "@/tw";

type ScreenWrapperProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  headerSlot?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function ScreenWrapper({
  title,
  subtitle,
  eyebrow,
  headerSlot,
  children,
  contentClassName,
}: ScreenWrapperProps) {
  return (
    <ScrollView
      className="flex-1 bg-app-bg"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName={cn(
        spacing.screenPadding,
        spacing.screenGap,
        contentClassName
      )}
    >
      <View className="relative overflow-hidden rounded-[32px] border border-app-border bg-app-surface-muted px-5 py-6">
        <View className="absolute -right-10 -top-8 h-32 w-32 rounded-full bg-app-glow" />
        <View className="absolute -left-6 top-20 h-20 w-20 rounded-full bg-app-glow-alt" />
        <View className="gap-3">
          {eyebrow ? <Text className={typography.eyebrow}>{eyebrow}</Text> : null}
          <Text className={typography.hero}>{title}</Text>
          {subtitle ? <Text className={typography.body}>{subtitle}</Text> : null}
          {headerSlot ? <View className="pt-2">{headerSlot}</View> : null}
        </View>
      </View>
      <View className={spacing.sectionGap}>{children}</View>
    </ScrollView>
  );
}
