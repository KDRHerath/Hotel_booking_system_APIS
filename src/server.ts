import express from "express";
import cors from "cors";
import authRoute from "./route/authRoute";
import profileRoute from "./route/profileRoute";

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Bypass CORS for same-origin requests (no origin)
      if (!origin) {
        callback(null, true);
      } else if (allowedOrigins.includes(origin as string)) {
        callback(null, true);
        // Block everything else
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Hotel Management System API!");
});

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
