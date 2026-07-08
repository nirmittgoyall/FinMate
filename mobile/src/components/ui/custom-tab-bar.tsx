import type { ComponentProps } from "react";

import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils/cn";
import { Pressable, Text, View } from "@/tw";

type IconName = ComponentProps<typeof Ionicons>["name"];

const tabIcons: Record<string, { active: IconName; inactive: IconName; label: string }> = {
  "(home)": { active: "home", inactive: "home-outline", label: "Home" },
  transactions: { active: "receipt", inactive: "receipt-outline", label: "Details" },
  analytics: { active: "sparkles", inactive: "sparkles-outline", label: "AI" },
  profile: { active: "person", inactive: "person-outline", label: "Profile" },
};

/**
 * Bottom tab bar matching the reference layout: two tabs, a raised circular
 * add-transaction button in the center (not a real route — it just navigates
 * directly), then two more tabs.
 */
export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const renderTab = (routeIndex: number) => {
    const route = state.routes[routeIndex];
    const isFocused = state.index === routeIndex;
    const icon = tabIcons[route.name] ?? tabIcons["(home)"];

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        className="flex-1 items-center justify-center gap-1"
      >
        <Ionicons
          name={isFocused ? icon.active : icon.inactive}
          size={22}
          color={isFocused ? colors.primaryStrong : colors.subtle}
        />
        <Text
          className={cn(
            "text-[11px] font-semibold",
            isFocused ? "text-app-primary-strong" : "text-app-subtle"
          )}
        >
          {icon.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        bottom: Math.max(insets.bottom, 14),
      }}
    >
      <View
        className="flex-row items-center rounded-[30px] border border-app-border bg-app-tab-bar"
        style={{
          height: 72,
          shadowColor: "#000000",
          shadowOpacity: 0.22,
          shadowOffset: { width: 0, height: 16 },
          shadowRadius: 24,
          elevation: 12,
        }}
      >
        {renderTab(0)}
        {renderTab(1)}
        {/* spacer reserving room for the raised center button */}
        <View style={{ width: 64 }} />
        {renderTab(2)}
        {renderTab(3)}
      </View>

      <Pressable
        onPress={() => router.push("/(tabs)/transactions/add")}
        className="items-center justify-center rounded-full bg-app-primary"
        style={{
          position: "absolute",
          alignSelf: "center",
          top: -26,
          height: 58,
          width: 58,
          shadowColor: colors.primary,
          shadowOpacity: 0.45,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 16,
          elevation: 14,
        }}
      >
        <Ionicons name="add" size={28} color={colors.contrast} />
      </Pressable>
    </View>
  );
}