// server.js (Main App Entry Point)
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
const configurePassport = require("./config/passport");
const User = require("./models/User");
const path = require("path");
const analyticsRoutes = require("./routes/analytics.routes");
const onboardRoutes = require("./routes/onboard.routes");
const assistantRoutes = require("./routes/assistant.routes");
const userRoutes = require('./routes/user.routes')
const ragRoutes = require('./routes/rag.routes')

// Load env variables
dotenv.config();
require("./config/passport");

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Must be false for localhost HTTP
      sameSite: "lax", // Allow sending cookies from 5173
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", onboardRoutes);
app.use("/api/assistant", assistantRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rag', ragRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Catch-all for client-side routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Error Handler
app.use(errorHandler);

// ✅ Connect to DB *first*, THEN start server
connectDB()
  .then(() => {
    configurePassport(User); // 👈 Passport only initializes after DB is connected

    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
  });
