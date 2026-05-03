const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Simple health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Task Manager API is running!" });
});

// --- FRONTEND DEPLOYMENT LOGIC ---
// Serve the Flutter Web build from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Catch-all route: if an API route isn't hit, serve the Flutter app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});