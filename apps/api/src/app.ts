import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());

// 🔹 arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Healthcheck
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Rotas da API
app.use("/", routes);

app.get("*", (req, res) => {
  // Return a 404 for API-like requests that don't exist
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    res.status(404).json({ error: "Route not found" });
  } else {
    // For SPA routes, serve index.html (frontend will handle routing)
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});

// Error handler por último
app.use(errorHandler);

export default app;