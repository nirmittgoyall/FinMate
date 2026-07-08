import type { ComponentProps } from "react";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils/cn";
import { Pressable, Text, View } from "@/tw";
import { typography } from "@/constants/typography";

type SettingsRowTone = "neutral" | "danger";
type IconName = ComponentProps<typeof Ionicons>["name"];

type SettingsRowProps = {
  iconName: IconName;
  label: string;
  value?: string;
  tone?: SettingsRowTone;
  onPress?: ComponentProps<typeof Pressable>["onPress"];
  className?: string;
};

export function SettingsRow({
  iconName,
  label,
  value,
  tone = "neutral",
  onPress,
  className,
}: SettingsRowProps) {
  const iconColor = tone === "danger" ? colors.danger : colors.secondary;

  return (
    <Pressable
      android_ripple={{ color: "rgba(124, 92, 255, 0.12)" }}
      disabled={!onPress}
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-4 rounded-[24px] bg-app-surface-muted px-4 py-4",
        className
      )}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-app-surface">
        <Ionicons name={iconName} size={19} color={iconColor} />
      </View>
      <View className="flex-1 gap-1">
        <Text className={cn(typography.cardTitle, tone === "danger" ? "text-app-danger" : null)}>
          {label}
        </Text>
        {value ? <Text className={typography.caption}>{value}</Text> : null}
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={tone === "danger" ? colors.danger : colors.subtle}
      />
    </Pressable>
  );
}
