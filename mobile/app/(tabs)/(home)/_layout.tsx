import { Stack } from "expo-router";

import { colors } from "@/constants/colors";

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}