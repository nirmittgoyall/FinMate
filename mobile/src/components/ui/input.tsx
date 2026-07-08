import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";

import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { Text, TextInput as TWTextInput, View } from "@/tw";

type InputProps = ComponentProps<typeof TWTextInput> & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
  leadingSlot?: ReactNode;
  trailingSlot?: ReactNode;
};

export function Input({
  label,
  hint,
  error,
  className,
  containerClassName,
  leadingSlot,
  trailingSlot,
  multiline,
  onBlur,
  onFocus,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn("gap-2", containerClassName)}>
      {label ? <Text className={typography.eyebrow}>{label}</Text> : null}
      <View
        className={cn(
          "rounded-[26px] border bg-app-surface-muted px-4 py-1",
          isFocused ? "border-app-primary bg-app-surface-elevated" : "border-app-border",
          error ? "border-app-danger" : null
        )}
      >
        <View className={cn("flex-row gap-3", multiline ? "items-start" : "items-center")}>
          {leadingSlot ? <View className="pt-4">{leadingSlot}</View> : null}
          <TWTextInput
            placeholderTextColor={colors.subtle}
            selectionColor={colors.primary}
            className={cn(
              multiline ? "min-h-[112px] flex-1 pt-4" : "min-h-14 flex-1",
              typography.input,
              className
            )}
            multiline={multiline}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            {...props}
          />
          {trailingSlot ? <View className="pt-4">{trailingSlot}</View> : null}
        </View>
      </View>
      {error ? (
        <Text className="text-[13px] leading-[18px] text-app-danger">{error}</Text>
      ) : hint ? (
        <Text className={typography.caption}>{hint}</Text>
      ) : null}
    </View>
  );
}
