import { Router } from "express";

import { authRouter } from "./auth.routes";
import { healthRouter } from "./health.routes";
import { transactionRouter } from "./transaction.routes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/transactions", transactionRouter);

export { apiRouter };
