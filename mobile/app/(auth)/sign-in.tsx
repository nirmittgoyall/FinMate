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
      email: "demo@finmate.ai",
      password: "secret123",
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
      eyebrow="Access"
      title="FinMate AI"
      subtitle="Sign in with your account and continue directly to your dashboard."
    >
      <Card
        eyebrow="Wallet"
        title="Login"
        description="This screen now authenticates against the backend and stores your session token securely on the device."
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

          {submitError ? (
            <Text className="text-[13px] leading-[18px] text-app-danger">
              {submitError}
            </Text>
          ) : null}

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            subtitle={isLoading ? "Contacting the backend" : "JWT stored securely with Expo SecureStore"}
          >
            {isLoading ? "Signing in..." : "Go to dashboard"}
          </Button>
        </View>
      </Card>

      <Card
        title="Need an account?"
        description="Register once and the app will persist your access token for future launches."
      >
        <Link href="/(auth)/sign-up" asChild>
          <Button variant="secondary">Create an account</Button>
        </Link>
        <Text className="text-[13px] leading-[18px] text-app-subtle">
          Demo access uses `demo@finmate.ai` and `secret123`.
        </Text>
      </Card>
    </ScreenWrapper>
  );
}
