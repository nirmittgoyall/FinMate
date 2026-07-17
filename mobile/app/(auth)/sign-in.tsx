import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { AmbientGlow, Button, Input, ScreenWrapper } from "@/components/ui";
import { colors } from "@/constants/colors";
import {
  applyServerFieldErrors,
  getErrorMessage,
} from "@/features/auth/form-errors";
import {
  signInSchema,
  type SignInFormValues,
} from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth-store";
import { Pressable, Text, View } from "@/tw";
import { FlatList } from "react-native-gesture-handler";
import { TouchableHighlight } from "react-native";

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
    <View className="flex-1 bg-app-bg">
      <AmbientGlow size={360} x={0.5} y={0.05} />

      <ScreenWrapper contentClassName="pb-32">
        <View className="items-center gap-4 pt-6">
          <View className="h-18 w-18 items-center justify-center rounded-full bg-app-primary">
            <Ionicons name="wallet-outline" size={32} color={colors.contrast} />
          </View>
          <View className="items-center gap-0.5">
            <Text className="text-[13px] font-medium uppercase tracking-[0.24em] text-app-muted">
              Welcome
            </Text>
            <Text className="text-[55px] leading-[36px] font-bold tracking-[-0.03em] text-app-text">
              Wisely
            </Text>
            {/* <Text className="text-center text-[11px] leading-[21px] text-app-muted">
              See your balance, spending, and recent activity in one calm dashboard.
            </Text> */}
          </View>
        </View>

        <View className="mt-8 gap-5" marginBottom={4} marginTop={4} marginLeft={35} marginRight={35} alignItems="close" justifyContent="center" >
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
            <Text className="text-[13px] leading-[18px] text-app-danger">{submitError}</Text>
          ) : null}

          <Button onPress={handleSubmit(onSubmit)} disabled={isLoading} size="lg" className="mt-2" marginBottom={0} marginTop={4} marginLeft={0} marginRight={0}>
            {isLoading ? "Signing in..." : "Open dashboard"}
          </Button>
        </View>

        <View className="mt-0 flex-row items-center justify-center gap-7">
          <Pressable onPress={() => {}} className="h-14 w-14 items-center justify-center rounded-full bg-app-primary">
              <Ionicons name="logo-google" size={22} color={colors.contrast} />
          </Pressable>
          <Pressable onPress={() => {}} className="h-14 w-14 items-center justify-center rounded-full bg-app-primary">
              <Ionicons name="logo-apple" size={25} color={colors.contrast} />
          </Pressable>
          <Pressable onPress={() => {}} className="h-14 w-14 items-center justify-center rounded-full bg-app-primary">
              <Ionicons name="mail" size={22} color={colors.contrast} />
          </Pressable>
        </View>


          <View className="mt-5 flex-row items-center justify-center gap-1.5">
            <Text className="text-[14px] text-app-muted">New to Wisely?</Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text className="text-[14px] font-semibold text-app-text">Create account</Text>
              </Pressable>
            </Link>
          </View>
      </ScreenWrapper>
    </View>
  );
}