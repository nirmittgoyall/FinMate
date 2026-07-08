import { router } from "expo-router";

import {
  AmbientGlow,
  Card,
  RevealIn,
  ScreenWrapper,
  SettingsRow,
} from "@/components/ui";
import { typography } from "@/constants/typography";
import { formatCurrency } from "@/lib/utils/format-currency";
import { useAuthStore } from "@/store/auth-store";
import { Text, View } from "@/tw";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signOut = useAuthStore((state) => state.signOut);
  const initials = getInitials(user?.name ?? "Fin Mate");

  const handleSignOut = async () => {
    if (isLoading) {
      return;
    }

    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <View className="flex-1 bg-app-bg">
      <AmbientGlow size={380} x={0.5} y={0.02} />

      <ScreenWrapper
        contentClassName="pb-32"
        headerContent={
          <RevealIn>
            <View className="gap-2">
              <Text className="text-[15px] tracking-[-0.02em] text-app-muted">Profile</Text>
              <Text className="text-[30px] leading-[34px] font-semibold tracking-[-0.04em] text-app-text">
                Your FinMate space.
              </Text>
              <Text className="text-[13px] leading-[18px] text-app-subtle">
                Account details, money settings, and support links live here.
              </Text>
            </View>
          </RevealIn>
        }
      >
        <RevealIn index={1}>
          <View className="overflow-hidden rounded-[28px] border border-app-glass-border bg-app-surface-elevated/80 px-4 py-4">
            <View
              className="absolute inset-x-0 top-0 h-px bg-app-glass-highlight"
              pointerEvents="none"
            />
            <View className="flex-row items-center gap-4">
              <View className="h-[64px] w-[64px] items-center justify-center rounded-full bg-app-primary-soft">
                <Text className="text-[22px] font-semibold tracking-[-0.04em] text-app-primary-strong">
                  {initials}
                </Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className={typography.cardTitle}>{user?.name ?? "No active user"}</Text>
                <Text className={typography.caption}>{user?.email ?? "Sign in to view your account."}</Text>
              </View>
            </View>

            <View className="mt-4 flex-row flex-wrap gap-2">
              <View className="rounded-full bg-app-surface px-3 py-2">
                <Text className="text-[12px] font-medium text-app-muted">
                  Currency: {user?.currency ?? "USD"}
                </Text>
              </View>
              <View className="rounded-full bg-app-surface px-3 py-2">
                <Text className="text-[12px] font-medium text-app-muted">
                  Budget: {formatCurrency(user?.monthlyBudget ?? 0, user?.currency ?? "USD")}
                </Text>
              </View>
            </View>
          </View>
        </RevealIn>

        <RevealIn index={2}>
          <Card title="Settings" description="Core preferences kept visible with minimal friction.">
            <View className="gap-3">
              <SettingsRow iconName="cash-outline" label="Currency" value={user?.currency ?? "USD"} />
              <SettingsRow
                iconName="wallet-outline"
                label="Budget"
                value={formatCurrency(user?.monthlyBudget ?? 0, user?.currency ?? "USD")}
              />
              <SettingsRow
                iconName="lock-closed-outline"
                label="Security"
                value="Password and current session protection"
              />
              <SettingsRow iconName="help-buoy-outline" label="Support" value="Get help using FinMate" />
              <SettingsRow
                iconName="information-circle-outline"
                label="About"
                value="Product details and version info"
              />
            </View>
          </Card>
        </RevealIn>

        <RevealIn index={3}>
          <Card title="Danger Zone" description="Sensitive actions stay separated from normal settings.">
            <SettingsRow
              iconName="log-out-outline"
              label={isLoading ? "Signing out..." : "Sign out of this device"}
              tone="danger"
              onPress={handleSignOut}
            />
          </Card>
        </RevealIn>
      </ScreenWrapper>
    </View>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}