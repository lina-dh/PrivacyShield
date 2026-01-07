import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import rubberDuckRoutes from "./routes/rubberDucks.js"; // Import the routes

import analyzeRoutes from "./routes/analyzeRoutes.js"; // Import our new PrivacyShield routes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images"))); // Serve static images

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Use the routes file for all `/ducks` routes
app.use("/ducks", rubberDuckRoutes);

// Connect our new API routes to the /api prefix
app.use("/api", analyzeRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
