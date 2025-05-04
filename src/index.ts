import express from "express";
import dotenv from "dotenv";
import linkRoutes from "./routes/link.routes";
import redirectRoutes from "./routes/redirect.routes";
import authRoutes from "./routes/auth.routes";
import savedRoutes from "./routes/saved.routes";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());

// Middlewares
app.use(express.json());

// Routes
app.use("/api/links", linkRoutes);
app.use("/", redirectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);

// Health check
app.get("/", (_req, res) => {
  res.send("Link Shortener API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
