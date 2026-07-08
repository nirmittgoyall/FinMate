import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryStrong,
        tabBarInactiveTintColor: colors.subtle,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 18,
          height: 72,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 30,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: colors.tabBar,
          elevation: 0,
          shadowColor: "#000000",
          shadowOpacity: 0.22,
          shadowOffset: { width: 0, height: 16 },
          shadowRadius: 24,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "AI",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
