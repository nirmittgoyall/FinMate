import "../src/global.css";

import { useEffect } from "react";

import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

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
    if (isHydrated) {
      void SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
