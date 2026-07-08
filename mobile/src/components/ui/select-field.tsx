import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";

import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { Pressable, ScrollView, Text, View } from "@/tw";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  containerClassName?: string;
};

export function SelectField({
  label,
  hint,
  error,
  value,
  options,
  onValueChange,
  containerClassName,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) ?? options[0] ?? null;

  const closeModal = () => setIsOpen(false);

  return (
    <View className={cn("gap-2", containerClassName)}>
      {label ? <Text className={typography.eyebrow}>{label}</Text> : null}
      <Pressable
        android_ripple={{ color: "rgba(124, 92, 255, 0.12)" }}
        onPress={() => setIsOpen(true)}
        className={cn(
          "min-h-14 flex-row items-center justify-between rounded-[26px] border bg-app-surface-muted px-4 py-4",
          isOpen ? "border-app-primary bg-app-surface-elevated" : "border-app-border",
          error ? "border-app-danger" : null
        )}
      >
        <Text className={cn(typography.input, !selectedOption ? "text-app-subtle" : null)}>
          {selectedOption?.label ?? "Select an option"}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </Pressable>
      {error ? (
        <Text className="text-[13px] leading-[18px] text-app-danger">{error}</Text>
      ) : hint ? (
        <Text className={typography.caption}>{hint}</Text>
      ) : null}

      <Modal
        animationType="fade"
        transparent
        visible={isOpen}
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: colors.overlay,
          }}
        >
          <Pressable className="absolute inset-0" onPress={closeModal} />
          <View className="mx-3 mb-3 overflow-hidden rounded-[32px] border border-app-border bg-app-surface px-5 pb-6 pt-4">
            <View className="mb-4 items-center">
              <View className="h-1.5 w-14 rounded-full bg-app-border" />
            </View>
            <View className="mb-5 flex-row items-start justify-between gap-4">
              <View className="flex-1 gap-1">
                <Text className={typography.sectionTitle}>{label ?? "Select an option"}</Text>
                <Text className={typography.caption}>
                  {hint ?? "Choose the value that fits this transaction."}
                </Text>
              </View>
              <Pressable
                onPress={closeModal}
                className="h-10 w-10 items-center justify-center rounded-full bg-app-surface-muted"
              >
                <Ionicons name="close" size={18} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView className="max-h-[320px]" showsVerticalScrollIndicator={false}>
              <View className="gap-3">
                {options.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <Pressable
                      key={option.value}
                      android_ripple={{ color: "rgba(124, 92, 255, 0.12)" }}
                      onPress={() => {
                        onValueChange(option.value);
                        closeModal();
                      }}
                      className={cn(
                        "flex-row items-center justify-between rounded-[24px] border px-4 py-4",
                        isSelected
                          ? "border-app-primary bg-app-primary-soft"
                          : "border-app-border bg-app-surface-muted"
                      )}
                    >
                      <Text
                        className={cn(
                          "text-[15px] leading-[20px] font-medium",
                          isSelected ? "text-app-primary-strong" : "text-app-text"
                        )}
                      >
                        {option.label}
                      </Text>
                      {isSelected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.primaryStrong}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
