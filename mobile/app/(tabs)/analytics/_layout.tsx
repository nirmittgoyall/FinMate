import { Stack } from "expo-router";

export default function AnalyticsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Analytics" }} />
    </Stack>
  );
}
