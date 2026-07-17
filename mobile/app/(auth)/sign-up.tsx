import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { currencyOptions } from "@/constants/finance";
import { AmbientGlow, Button, Input, ScreenWrapper, SelectField } from "@/components/ui";
import { colors } from "@/constants/colors";
import {
  applyServerFieldErrors,
  getErrorMessage,
} from "@/features/auth/form-errors";
import {
  signUpSchema,
  type SignUpFormValues,
} from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth-store";
import { Pressable, Text, View } from "@/tw";

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
    <View className="flex-1 bg-app-bg">
      <AmbientGlow size={320} x={0.5} y={0.02} />

      <ScreenWrapper contentClassName="pb-16">
        <View className="items-center gap-1 pt-6">
          <View className="h-18 w-18 items-center justify-center rounded-full bg-app-primary">
            <Ionicons name="wallet-outline" size={32} color={colors.contrast} />
          </View>
          <View className="items-center gap-0.5">
            <Text className="text-[55px] leading-[36px] font-bold tracking-[-0.03em] text-app-text">
              Wisely
            </Text>
            <Text className="text-[25px] stretch leading-[32px] tracking-[-0.03em] text-app-text">
            Create your account
          </Text>
          </View>
        </View>

        <View className="mt-7 gap-4" marginBottom={16} marginTop={16} marginLeft={35} marginRight={35}>
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

          <View className="flex-row gap-3">
            <Controller
              control={control}
              name="monthlyBudget"
              render={({ field: { onChange, value } }) => (
                <Input
                  containerClassName="flex-1"
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
                  containerClassName="flex-1"
                  label="Currency"
                  value={value}
                  onValueChange={onChange}
                  options={currencyOptions}
                  error={errors.currency?.message}
                />
              )}
            />
          </View>

          {submitError ? (
            <Text className="text-[13px] leading-[18px] text-app-danger">{submitError}</Text>
          ) : null}

          <Button onPress={handleSubmit(onSubmit)} disabled={isLoading} size="lg" className="mt-2">
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </View>

        <View className="mt-8 flex-row items-center justify-center gap-1.5">
          <Text className="text-[14px] text-app-muted">Already have an account?</Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable>
              <Text className="text-[14px] font-semibold text-app-text">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </ScreenWrapper>
    </View>
  );
}