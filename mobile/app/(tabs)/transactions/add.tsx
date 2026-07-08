import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform } from "react-native";

import {
  Button,
  DateField,
  Input,
  ScreenWrapper,
  SelectField,
} from "@/components/ui";
import { colors } from "@/constants/colors";
import {
  getCategoriesForType,
  paymentMethodOptions,
} from "@/constants/finance";
import { typography } from "@/constants/typography";
import {
  applyServerFieldErrors,
  getErrorMessage,
} from "@/features/auth/form-errors";
import {
  transactionSchema,
  type TransactionFormValues,
} from "@/features/transactions/schemas";
import { formatCurrency } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import { useTransactionStore } from "@/store/transaction-store";
import { Pressable, Text, View } from "@/tw";

const transactionTypeOptions = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
] as const;

const paymentOptions = paymentMethodOptions.map((method) => ({
  label: method,
  value: method,
}));

export default function AddTransactionScreen() {
  const currency = useAuthStore((state) => state.user?.currency ?? "USD");
  const createTransaction = useTransactionStore((state) => state.createTransaction);
  const isCreating = useTransactionStore((state) => state.isCreating);
  const storeError = useTransactionStore((state) => state.error);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: "Food",
      paymentMethod: "UPI",
      note: "",
      date: new Date().toISOString().slice(0, 10),
      type: "expense",
    },
  });

  const selectedType = watch("type");
  const selectedCategory = watch("category");
  const validCategories = [...getCategoriesForType(selectedType)];
  const categoryOptions = validCategories.map((category) => ({
    label: category,
    value: category,
  }));

  useEffect(() => {
    if (!validCategories.includes(selectedCategory)) {
      setValue("category", validCategories[0], { shouldValidate: true });
    }
  }, [selectedCategory, selectedType, setValue, validCategories]);

  const onSubmit = async (values: TransactionFormValues) => {
    setSubmitError(null);
    clearErrors();

    try {
      await createTransaction(values);
      router.back();
    } catch (error) {
      const hasFieldErrors = applyServerFieldErrors(error, setError);

      if (!hasFieldErrors) {
        setSubmitError(getErrorMessage(error));
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenWrapper
        contentClassName="pb-12"
        footer={
          <Button onPress={handleSubmit(onSubmit)} disabled={isCreating} size="lg">
            {isCreating ? "Saving..." : "Save transaction"}
          </Button>
        }
        headerContent={
          <View className="gap-4">
            <View className="items-center">
              <View className="h-1.5 w-14 rounded-full bg-app-border" />
            </View>
            <View className="flex-row items-center justify-between">
              <Button
                fullWidth={false}
                variant="ghost"
                size="md"
                className="h-12 w-12 rounded-full px-0 py-0"
                onPress={() => router.back()}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </Button>
              <View className="items-center gap-1">
                <Text className={typography.eyebrow}>Add Transaction</Text>
                <Text className="text-[13px] text-app-subtle">Premium sheet layout</Text>
              </View>
              <View className="h-12 w-12" />
            </View>
          </View>
        }
      >
        <View className="gap-5 rounded-[32px] border border-app-border bg-app-surface px-5 py-6">
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View className="gap-3">
                <Text className={typography.eyebrow}>Type</Text>
                <View className="flex-row gap-3 rounded-full bg-app-surface-muted p-1">
                  {transactionTypeOptions.map((option) => {
                    const isActive = value === option.value;

                    return (
                      <Pressable
                        key={option.value}
                        android_ripple={{ color: "rgba(124, 92, 255, 0.12)" }}
                        onPress={() =>
                          onChange(option.value as TransactionFormValues["type"])
                        }
                        className={cn(
                          "flex-1 rounded-full px-4 py-4",
                          isActive ? "bg-app-primary" : "bg-transparent"
                        )}
                      >
                        <Text
                          className={cn(
                            "text-center text-[15px] font-medium",
                            isActive ? "text-app-contrast" : "text-app-muted"
                          )}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {errors.type?.message ? (
                  <Text className="text-[13px] leading-[18px] text-app-danger">
                    {errors.type.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Amount"
                keyboardType="decimal-pad"
                onChangeText={onChange}
                placeholder="0.00"
                value={value}
                hint={`Example: ${formatCurrency(1200, currency)}`}
                error={errors.amount?.message}
                className="text-[40px] leading-[44px] font-semibold tracking-[-0.06em] text-app-text"
                trailingSlot={
                  <View className="rounded-full bg-app-surface px-3 py-2">
                    <Text className="text-[12px] font-medium text-app-subtle">{currency}</Text>
                  </View>
                }
              />
            )}
          />

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Title"
                onChangeText={onChange}
                placeholder={
                  selectedType === "expense" ? "Dinner with friends" : "July salary"
                }
                value={value}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <SelectField
                label="Category"
                value={value}
                onValueChange={onChange}
                options={categoryOptions}
                error={errors.category?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="paymentMethod"
            render={({ field: { onChange, value } }) => (
              <SelectField
                label="Payment"
                value={value}
                onValueChange={onChange}
                options={paymentOptions}
                error={errors.paymentMethod?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DateField
                label="Date"
                value={value}
                onChange={onChange}
                error={errors.date?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Notes"
                onChangeText={onChange}
                placeholder="Optional note"
                value={value}
                error={errors.note?.message}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          />

          {submitError || storeError ? (
            <Text className="text-[13px] leading-[18px] text-app-danger">
              {submitError ?? storeError}
            </Text>
          ) : null}
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
}
