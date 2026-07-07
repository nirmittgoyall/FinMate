import cors from "cors";
import express from "express";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import { apiRouter } from "./routes";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_request, response) => {
  response.status(200).json({
    message: "FinMate AI server scaffold is running.",
  });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
