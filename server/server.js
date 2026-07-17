import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import weatherRoutes from "./routes/weather.js";
import forecastRoutes from "./routes/forecast.js";
import historyRoutes from "./routes/history.js";
import environmentRoutes from "./routes/environment.js";
import indicesRoutes from "./routes/indices.js";
import contentRoutes from "./routes/content.js";
import convertRoutes from "./routes/convert.js";
import appRoutes from "./routes/app.js";

if (!process.env.OPENWEATHER_API_KEY) {
  console.error("FATAL: OPENWEATHER_API_KEY is not set in .env");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("FATAL: MONGODB_URI is not set in .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(morgan("dev"));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: "Too many requests. Try again later." },
});
const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many requests. Try again later." },
});
const weatherLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many weather requests. Wait a moment." },
});
app.use(limiter);
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:5173", "http://localhost:5174", "https://weatherflowapp.vercel.app"],
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));

app.use("/api/weather", weatherLimiter, weatherRoutes);
app.use("/api/forecast", weatherLimiter, forecastRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/environment", environmentRoutes);
app.use("/api/indices", indicesRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/convert", convertRoutes);
app.use("/api/app", appRoutes);

app.get("/api/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbStatus[dbState] || "unknown",
    uptime: process.uptime(),
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
