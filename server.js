import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import bcrypt from "bcrypt";
import cors from "cors";

import User from "./models/User.js"; // ⚠️ must include .js

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

// ===== DATABASE =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ===== ROUTES =====

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashed,
      progress: {
        bubbleScore: 0,
        bibleScore: 0
      }
    });

    await user.save();

    res.json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.json({ message: "Incorrect password" });
    }

    req.session.userId = user._id;

    res.json({ message: "Login successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET CURRENT USER
app.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.json({ message: "Not logged in" });
  }

  const user = await User.findById(req.session.userId);
  res.json(user);
});

// SAVE PROGRESS (FIXED: merges scores)
app.post("/save-progress", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ message: "Not logged in" });
    }

    const user = await User.findById(req.session.userId);

    // merge instead of overwrite
    user.progress = {
      ...user.progress,
      ...req.body.progress
    };

    await user.save();

    res.json({ message: "Progress saved" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});