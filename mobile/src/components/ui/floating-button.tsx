import type { ComponentProps } from "react";
import type {
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils/cn";
import { Pressable, Text, View } from "@/tw";

type IconName = ComponentProps<typeof Ionicons>["name"];

type FloatingButtonProps = ComponentProps<typeof Pressable> & {
  label: string;
  iconName?: IconName;
};

export function FloatingButton({
  label,
  iconName = "add",
  className,
  style,
  ...props
}: FloatingButtonProps) {
  return (
    <Pressable
      android_ripple={{ color: "rgba(255, 255, 255, 0.16)" }}
      className={cn(
        "flex-row items-center gap-3 rounded-full border border-app-primary bg-app-primary px-5 py-4",
        className
      )}
      style={(state: PressableStateCallbackType) =>
        resolveFloatingStyle({
          state,
          style,
        })
      }
      {...props}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-app-contrast/10">
        <Ionicons name={iconName} size={20} color={colors.contrast} />
      </View>
      <Text className="text-[15px] font-medium tracking-[-0.03em] text-app-contrast">
        {label}
      </Text>
    </Pressable>
  );
}

function resolveFloatingStyle({
  state,
  style,
}: {
  state: PressableStateCallbackType;
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
}) {
  const baseStyle: StyleProp<ViewStyle> = {
    transform: [{ scale: state.pressed ? 0.985 : 1 }],
  };

  if (typeof style === "function") {
    return [baseStyle, style(state)];
  }

  return [baseStyle, style];
}
