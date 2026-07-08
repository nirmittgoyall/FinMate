import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { currencyOptions } from "@/constants/finance";
import { Button, Card, Input, ScreenWrapper, SelectField } from "@/components/ui";
import {
  applyServerFieldErrors,
  getErrorMessage,
} from "@/features/auth/form-errors";
import {
  signUpSchema,
  type SignUpFormValues,
} from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth-store";
import { Text, View } from "@/tw";

export default function SignUpScreen() {
  const signUp = useAuthStore((state) => state.signUp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      monthlyBudget: "",
      currency: "INR",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setSubmitError(null);
    clearErrors();

    try {
      await signUp(values);
      router.replace("/(tabs)/(home)");
    } catch (error) {
      const hasFieldErrors = applyServerFieldErrors(error, setError);

      if (!hasFieldErrors) {
        setSubmitError(getErrorMessage(error));
      }
    }
  };

  return (
    <ScreenWrapper
      eyebrow="Create account"
      title="Set up your money space"
      subtitle="Add your monthly budget and currency once, then start tracking expenses clearly."
    >
      <Card
        title="Your details"
        description="Keep this simple. Your budget and currency power the dashboard as soon as you sign in."
        variant="elevated"
      >
        <View className="gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Full name"
                onChangeText={onChange}
                placeholder="Aman Sharma"
                value={value}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={onChange}
                placeholder="you@example.com"
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                secureTextEntry
                onChangeText={onChange}
                placeholder="At least 8 characters"
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="monthlyBudget"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Monthly budget"
                keyboardType="decimal-pad"
                onChangeText={onChange}
                placeholder="25000"
                value={value}
                error={errors.monthlyBudget?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="currency"
            render={({ field: { onChange, value } }) => (
              <SelectField
                label="Currency"
                value={value}
                onValueChange={onChange}
                options={currencyOptions}
                error={errors.currency?.message}
              />
            )}
          />

          {submitError ? (
            <Text className="text-[13px] leading-[18px] text-app-danger">
              {submitError}
            </Text>
          ) : null}

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </View>
      </Card>

      <Card title="Already have an account?" description="Sign in and continue from your dashboard.">
        <Link href="/(auth)/sign-in" asChild>
          <Button variant="secondary">Sign in</Button>
        </Link>
      </Card>
    </ScreenWrapper>
  );
}
