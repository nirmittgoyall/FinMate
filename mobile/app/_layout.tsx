import * as SystemUI from "expo-system-ui";
import "../src/global.css";

import { useEffect } from "react";

import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if the splash screen was already handled.
});

export default function RootLayout() {
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, []);

  useEffect(() => {
    if (isHydrated) {
      void SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
