import type { ComponentProps, ReactNode } from "react";
import type {
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from "react-native";

import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { Pressable, Text, View } from "@/tw";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "md" | "lg";

type ButtonProps = ComponentProps<typeof Pressable> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  subtitle?: string;
  fullWidth?: boolean;
  textClassName?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-app-primary border border-app-primary",
  secondary: "bg-app-surface-elevated border border-app-border",
  ghost: "bg-app-surface-muted border border-app-border",
  danger: "bg-app-danger border border-app-danger",
};

const textClasses: Record<ButtonVariant, string> = {
  primary: "text-app-contrast",
  secondary: "text-app-text",
  ghost: "text-app-text",
  danger: "text-app-contrast",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-14 px-5 py-4",
  lg: "min-h-16 px-6 py-5",
};

const rippleColors: Record<ButtonVariant, string> = {
  primary: "rgba(255, 255, 255, 0.15)",
  secondary: "rgba(124, 92, 255, 0.16)",
  ghost: "rgba(124, 92, 255, 0.12)",
  danger: "rgba(255, 255, 255, 0.18)",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  subtitle,
  fullWidth = true,
  className,
  disabled,
  textClassName,
  style,
  ...props
}: ButtonProps) {
  const content =
    typeof children === "string" ? (
      <View className="items-center gap-1">
        <Text className={cn(typography.button, textClasses[variant], textClassName)}>
          {children}
        </Text>
        {subtitle ? (
          <Text
            className={cn(
              "text-[12px] leading-[16px]",
              variant === "primary" || variant === "danger"
                ? "text-app-contrast opacity-70"
                : "text-app-subtle"
            )}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    ) : (
      children
    );

  return (
    <Pressable
      disabled={Boolean(disabled)}
      android_ripple={{ color: rippleColors[variant] }}
      className={cn(
        "items-center justify-center rounded-[24px]",
        fullWidth ? "w-full" : "self-start",
        sizeClasses[size],
        variantClasses[variant],
        disabled ? "opacity-50" : "opacity-100",
        className
      )}
      style={(state: PressableStateCallbackType) =>
        resolvePressableStyle({
          state,
          disabled: Boolean(disabled),
          style,
        })
      }
      {...props}
    >
      {content}
    </Pressable>
  );
}

function resolvePressableStyle({
  state,
  disabled,
  style,
}: {
  state: PressableStateCallbackType;
  disabled?: boolean;
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
}) {
  const baseStyle: StyleProp<ViewStyle> = {
    transform: [{ scale: !disabled && state.pressed ? 0.985 : 1 }],
  };

  if (typeof style === "function") {
    return [baseStyle, style(state)];
  }

  return [baseStyle, style];
}

