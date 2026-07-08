import type { ReactNode } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { ScrollView, Text, View } from "@/tw";

type ScreenWrapperProps = {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  headerSlot?: ReactNode;
  headerContent?: ReactNode;
  footer?: ReactNode;
  headerClassName?: string;
  footerClassName?: string;
  children: ReactNode;
  contentClassName?: string;
  scrollClassName?: string;
};

export function ScreenWrapper({
  title,
  subtitle,
  eyebrow,
  headerSlot,
  headerContent,
  footer,
  headerClassName,
  footerClassName,
  children,
  contentClassName,
  scrollClassName,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-app-bg">
      <ScrollView
        className={cn("flex-1 bg-app-bg", scrollClassName)}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top + 8, 20),
          paddingBottom: Math.max(
            insets.bottom + (footer ? 120 : 40),
            footer ? 132 : 48
          ),
        }}
        contentContainerClassName={cn(
          spacing.screenPadding,
          spacing.screenGap,
          contentClassName
        )}
      >
        {headerContent ? (
          <View className={headerClassName}>{headerContent}</View>
        ) : title || subtitle || eyebrow || headerSlot ? (
          <View className={cn("gap-3", headerClassName)}>
            {eyebrow ? <Text className={typography.eyebrow}>{eyebrow}</Text> : null}
            {title ? <Text className={typography.screenTitle}>{title}</Text> : null}
            {subtitle ? <Text className={typography.body}>{subtitle}</Text> : null}
            {headerSlot ? <View className="pt-1">{headerSlot}</View> : null}
          </View>
        ) : null}
        <View className={spacing.sectionGap}>{children}</View>
      </ScrollView>

      {footer ? (
        <View
          className={cn(
            "absolute bottom-0 left-0 right-0 border-t border-app-border bg-app-bg px-6 pt-4",
            footerClassName
          )}
          style={{ paddingBottom: Math.max(insets.bottom, 14) }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
