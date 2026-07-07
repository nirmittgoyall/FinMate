import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { Button, Card, Input, ScreenWrapper } from "@/components/ui";
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
      currency: "USD",
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
      eyebrow="Onboarding"
      title="Create account"
      subtitle="Register against the backend, store the access token securely, and land in the dashboard immediately."
    >
      <Card
        eyebrow="Profile"
        title="Register"
        description="The form matches the backend contract, including monthly budget and currency."
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
                placeholder="Full name"
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
                placeholder="Email"
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
                placeholder="Password"
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
                placeholder="2500"
                value={value}
                error={errors.monthlyBudget?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="currency"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Currency"
                autoCapitalize="characters"
                maxLength={3}
                onChangeText={onChange}
                placeholder="USD"
                value={value}
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
            variant="secondary"
            disabled={isLoading}
            subtitle={isLoading ? "Creating your account" : "Backend registration with secure token persistence"}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </View>
      </Card>

      <Card
        title="Already registered?"
        description="Return to login and reuse your existing credentials."
      >
        <Link href="/(auth)/sign-in" asChild>
          <Button variant="ghost">Return to login</Button>
        </Link>
      </Card>
    </ScreenWrapper>
  );
}
