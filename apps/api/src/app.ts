import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

// Healthcheck endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Main API routes - the /api prefix is handled by Nginx proxy
app.use("/", routes);

// Serve static files (if needed for assets or anything else)
app.use(express.static(path.join(__dirname, "public")));

// The "catch-all" handler for SPA: any request not handled by above routes
// returns the index.html so the frontend router can handle it
app.get("*", (req, res) => {
  // Return a 404 for API-like requests that don't exist
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    res.status(404).json({ error: "Route not found" });
  } else {
    // For SPA routes, serve index.html (frontend will handle routing)
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});

// Error handler (must come after routes)
app.use(errorHandler);

export default app;
