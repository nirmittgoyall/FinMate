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
  signInSchema,
  type SignInFormValues,
} from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth-store";
import { Text, View } from "@/tw";

export default function SignInScreen() {
  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setSubmitError(null);
    clearErrors();

    try {
      await signIn(values);
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
      eyebrow="Welcome back"
      title="FinMate"
      subtitle="See your balance, spending, and recent activity in one calm dashboard."
    >
      <Card
        title="Sign in"
        description="Use your existing account to continue. Nothing about the auth flow changes here."
        variant="elevated"
      >
        <View className="gap-4">
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
                placeholder="Your password"
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          {submitError ? (
            <Text className="text-[13px] leading-[18px] text-app-danger">
              {submitError}
            </Text>
          ) : null}

          <Button onPress={handleSubmit(onSubmit)} disabled={isLoading} size="lg">
            {isLoading ? "Signing in..." : "Open dashboard"}
          </Button>
        </View>
      </Card>

      <Card
        title="New to FinMate?"
        description="Create an account with your monthly budget and preferred currency."
      >
        <Link href="/(auth)/sign-up" asChild>
          <Button variant="secondary">Create account</Button>
        </Link>
      </Card>
    </ScreenWrapper>
  );
}
