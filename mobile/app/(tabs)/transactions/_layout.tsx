import { Stack } from "expo-router";

export default function TransactionsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Transactions" }} />
      <Stack.Screen name="add" options={{ title: "Add Transaction" }} />
    </Stack>
  );
}
