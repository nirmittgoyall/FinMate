import type { ReactNode } from "react";

import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { Pressable, Text, View } from "@/tw";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "md" | "lg";

type ButtonProps = React.ComponentProps<typeof Pressable> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  subtitle?: string;
  fullWidth?: boolean;
  textClassName?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-app-primary border border-app-primary",
  secondary: "bg-app-surface-elevated border border-app-border-strong",
  ghost: "bg-transparent border border-app-border",
  danger: "bg-app-danger border border-app-danger",
};

const textClasses: Record<ButtonVariant, string> = {
  primary: "text-app-contrast",
  secondary: "text-app-text",
  ghost: "text-app-text",
  danger: "text-app-contrast",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-4 py-4",
  lg: "px-5 py-5",
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
                : "text-app-muted"
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
      disabled={disabled}
      className={cn(
        "items-center justify-center rounded-[22px]",
        fullWidth ? "w-full" : "self-start",
        sizeClasses[size],
        variantClasses[variant],
        disabled ? "opacity-50" : "opacity-100",
        className
      )}
      {...props}
    >
      {content}
    </Pressable>
  );
}
