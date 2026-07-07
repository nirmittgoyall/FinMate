import { app } from "./app";
import { connectToDatabase } from "./config/db";
import { env } from "./config/env";

async function bootstrap() {
  try {
    await connectToDatabase();
    app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`FinMate AI server listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start FinMate AI server", error);
    process.exit(1);
  }
}

void bootstrap();

