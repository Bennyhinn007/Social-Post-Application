const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
    : ["http://localhost:5173", "http://localhost:4173"]
).filter(Boolean);

const authLimiter = rateLimit({
  windowMs: Number.parseInt(
    process.env.AUTH_RATE_LIMIT_WINDOW_MS || "900000",
    10,
  ),
  max: Number.parseInt(process.env.AUTH_RATE_LIMIT_MAX || "20", 10),
  skip: () => process.env.NODE_ENV === "test",
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth requests. Please try again later." },
});

const apiLimiter = rateLimit({
  windowMs: Number.parseInt(
    process.env.API_RATE_LIMIT_WINDOW_MS || "900000",
    10,
  ),
  max: Number.parseInt(process.env.API_RATE_LIMIT_MAX || "200", 10),
  skip: () => process.env.NODE_ENV === "test",
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please slow down and try again later.",
  },
});

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/posts", apiLimiter, postRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image must be 5MB or smaller." });
    }

    return res.status(400).json({ message: "Image upload failed." });
  }

  if (err && err.message === "Only image uploads are allowed.") {
    return res.status(400).json({ message: err.message });
  }

  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin is not allowed." });
  }

  if (err) {
    return res.status(500).json({ message: "Something went wrong." });
  }

  return next();
});

module.exports = app;
