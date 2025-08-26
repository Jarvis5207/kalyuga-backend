import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";

import Complaint from "./models/Complaint.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MongoDB connection ---
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/complaints_db";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

app.use(cors());
app.use(express.json());

// --- Multer setup (file upload) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.get("/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.post("/submit-complaint", upload.single("photo"), async (req, res) => {
  try {
    const { name, age, problem } = req.body;

    const photoInfo = req.file
      ? {
          filename: req.file.filename,
          originalname: req.file.originalname,
          url: "/uploads/" + req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : null;

    const complaint = await Complaint.create({
      name,
      age,
      problem,
      photo: photoInfo,
    });

    res.json({
      success: true,
      message: "Complaint submitted successfully",
      id: complaint._id,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get("/complaints", async (req, res) => {
  try {
    const items = await Complaint.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
