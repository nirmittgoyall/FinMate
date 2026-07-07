import { Button, Card, ScreenWrapper } from "@/components/ui";
import { Link } from "@/tw";

export default function NotFoundScreen() {
  return (
    <ScreenWrapper
      eyebrow="Navigation"
      title="Route not found"
      subtitle="This path is outside the current FinMate AI flow."
    >
      <Card
        title="Return to the app"
        description="The route exists as a placeholder, but the screen has not been designed yet."
      >
        <Link href="/" asChild>
          <Button>Go to start</Button>
        </Link>
      </Card>
    </ScreenWrapper>
  );
}
