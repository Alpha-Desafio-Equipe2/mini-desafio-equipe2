import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());

// Healthcheck endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Main routes - the /api prefix is handled by Nginx proxy
app.use("/", routes);

app.use(errorHandler);

export default app;
