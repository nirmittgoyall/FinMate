import type { ReactNode } from "react";

import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { Text, View } from "@/tw";

type CardVariant = "default" | "elevated" | "muted";

type CardProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: CardVariant;
};

const variantClasses: Record<CardVariant, string> = {
  default: "bg-app-surface border-app-border",
  elevated: "bg-app-surface-elevated border-app-border-strong",
  muted: "bg-app-surface-muted border-app-border",
};

export function Card({
  title,
  eyebrow,
  description,
  children,
  className,
  contentClassName,
  variant = "default",
}: CardProps) {
  return (
    <View
      className={cn(
        "rounded-[28px] border",
        spacing.cardPadding,
        variantClasses[variant],
        className
      )}
    >
      {eyebrow || title || description ? (
        <View className={cn("gap-2", contentClassName)}>
          {eyebrow ? <Text className={typography.eyebrow}>{eyebrow}</Text> : null}
          {title ? <Text className={typography.cardTitle}>{title}</Text> : null}
          {description ? <Text className={typography.body}>{description}</Text> : null}
        </View>
      ) : null}
      {children ? (
        <View className={cn(title || eyebrow || description ? "mt-4" : null, "gap-4")}>
          {children}
        </View>
      ) : null}
    </View>
  );
}
