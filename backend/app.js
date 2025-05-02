const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");

dotenv.config();
const {
  authRoutes,
  userRoutes,
  organizationRoutes,
  crewRoutes,
  eventRegRoute,
} = require("./routes");

// Import the upload routes
const uploadRoutes = require("./routes/UploadRoutes");

// Import product routes
const productRoutes = require("./routes/productRoutes");

// Import event product routes
const eventProductRoutes = require("./routes/eventsHasProductsRoutes");

const committeeRoutes = require("./routes/committeeRoutes");

const logger = require("./utils/logger");

const app = express();

// Middleware for logging (using the logger)
app.use((req, res, next) => {
  logger.info(`${req.method} request to ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/crews", crewRoutes);
app.use("/api/eventsAdmin", eventRegRoute);
app.use("/api/upload", uploadRoutes); // Register the upload routes
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files
app.use("/api/products", productRoutes);
app.use("/api/eventProducts", eventProductRoutes);
app.use("/api/committees", committeeRoutes);

module.exports = app;
