import type { ComponentProps } from "react";

import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Text, View } from "@/tw";

type IconName = ComponentProps<typeof Ionicons>["name"];

type EmptyStateProps = {
  title: string;
  description: string;
  iconName?: IconName;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  title,
  description,
  iconName = "sparkles-outline",
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View className="items-start gap-4 rounded-[30px] border border-app-border bg-app-surface px-5 py-6">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-app-surface-elevated">
        <Ionicons name={iconName} size={22} color={colors.primaryStrong} />
      </View>
      <View className="gap-2">
        <Text className={typography.sectionTitle}>{title}</Text>
        <Text className={typography.body}>{description}</Text>
      </View>
      {actionLabel && onActionPress ? (
        <Button variant="secondary" onPress={onActionPress}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
