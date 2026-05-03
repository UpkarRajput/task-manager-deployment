const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

dotenv.config();
const app = express();

// CORS — allow local dev and the Firebase Hosting domain
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  // Replace with your actual Firebase Hosting URL once you deploy:
  // "https://YOUR-PROJECT-ID.web.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".web.app") || origin.endsWith(".firebaseapp.com")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Root route — confirms the API is live
app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running!",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      projects: "/api/projects",
    },
  });
});

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Task Manager API is running!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
