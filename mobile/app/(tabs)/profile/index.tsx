import { router } from "expo-router";

import { Button, Card, ScreenWrapper } from "@/components/ui";
import { useAuthStore } from "@/store/auth-store";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <ScreenWrapper
      eyebrow="Account"
      title="Profile"
      subtitle="A quiet settings surface for identity, preferences, exports, and account controls."
    >
      <Card
        title="Current session"
        description={user ? `${user.name} - ${user.email}` : "No active user"}
        variant="elevated"
      />
      <Card
        title="Session action"
        description="This clears the issued backend session token and returns the app to the sign-in route."
      >
        <Button onPress={handleSignOut} variant="ghost" disabled={isLoading}>
          {isLoading ? "Signing out..." : "Sign out"}
        </Button>
      </Card>
    </ScreenWrapper>
  );
}
