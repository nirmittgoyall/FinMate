import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { Button, Card, Input, ScreenWrapper } from "@/components/ui";
import {
  applyServerFieldErrors,
  getErrorMessage,
} from "@/features/auth/form-errors";
import {
  transactionSchema,
  type TransactionFormValues,
} from "@/features/transactions/schemas";
import { cn } from "@/lib/utils/cn";
import { useTransactionStore } from "@/store/transaction-store";
import { Pressable, Text, View } from "@/tw";

export default function AddTransactionScreen() {
  const createTransaction = useTransactionStore((state) => state.createTransaction);
  const isCreating = useTransactionStore((state) => state.isCreating);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: "",
      paymentMethod: "",
      note: "",
      date: new Date().toISOString().slice(0, 10),
      type: "expense",
    },
  });

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
    <ScreenWrapper
      eyebrow="Entry"
      title="Add transaction"
      subtitle="Create an expense or income entry and persist it directly to the backend."
    >
      <Card
        eyebrow="Capture"
        title="Transaction form"
        description="The form now posts a real transaction payload through the authenticated API client."
        variant="elevated"
      >
        <View className="gap-4">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Title"
                onChangeText={onChange}
                placeholder="Title"
                value={value}
                error={errors.title?.message}
              />
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
                placeholder="Amount"
                value={value}
                error={errors.amount?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Category"
                onChangeText={onChange}
                placeholder="Category"
                value={value}
                error={errors.category?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="paymentMethod"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Payment method"
                onChangeText={onChange}
                placeholder="UPI, card, cash"
                value={value}
                error={errors.paymentMethod?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Date"
                onChangeText={onChange}
                placeholder="YYYY-MM-DD"
                value={value}
                error={errors.date?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Note"
                onChangeText={onChange}
                placeholder="Optional note"
                value={value}
                error={errors.note?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                <Text className="text-[11px] uppercase tracking-[2.8px] text-app-muted">
                  Type
                </Text>
                <View className="flex-row gap-3">
                  {(["expense", "income"] as const).map((option) => {
                    const isSelected = value === option;

                    return (
                      <Pressable
                        key={option}
                        onPress={() => onChange(option)}
                        className={cn(
                          "flex-1 rounded-[22px] border px-4 py-4",
                          isSelected
                            ? "border-app-primary bg-app-primary"
                            : "border-app-border-strong bg-app-surface"
                        )}
                      >
                        <Text
                          className={cn(
                            "text-center text-[14px] font-medium capitalize",
                            isSelected ? "text-app-contrast" : "text-app-text"
                          )}
                        >
                          {option}
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

          {submitError ? (
            <Text className="text-[13px] leading-[18px] text-app-danger">
              {submitError}
            </Text>
          ) : null}

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isCreating}
            variant="secondary"
            subtitle={
              isCreating
                ? "Saving to the backend"
                : "Creates the transaction and returns to the ledger"
            }
          >
            {isCreating ? "Saving..." : "Save transaction"}
          </Button>
        </View>
      </Card>
    </ScreenWrapper>
  );
}
