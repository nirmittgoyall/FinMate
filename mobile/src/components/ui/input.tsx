import { useState } from "react";

import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { Text, TextInput as TWTextInput, View } from "@/tw";

type InputProps = React.ComponentProps<typeof TWTextInput> & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export function Input({
  label,
  hint,
  error,
  className,
  containerClassName,
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
          "rounded-[22px] border bg-app-surface px-4 py-1",
          isFocused ? "border-app-primary bg-app-surface-elevated" : "border-app-border",
          error ? "border-app-danger" : null
        )}
      >
        <TWTextInput
          placeholderTextColor={colors.subtle}
          selectionColor={colors.primary}
          className={cn("min-h-12", typography.input, className)}
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
      </View>
      {error ? (
        <Text className="text-[13px] leading-[18px] text-app-danger">{error}</Text>
      ) : hint ? (
        <Text className={typography.caption}>{hint}</Text>
      ) : null}
    </View>
  );
}
