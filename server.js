const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend URL
    methods: ["GET", "POST", "PUT"], // Allow specific methods
    credentials: true, // Allow cookies if needed
  })
); // Allow all origins
// Middleware
app.use(express.json());

// Import Routes
const questionRoutes = require("./routes/questionRoutes"); 
app.use("/api/questions", questionRoutes);  // API routes

// ✅ Add this default route
app.get("/", (req, res) => {
  res.send("Welcome to the Would You Rather API!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true,  dbName: "would_you_rather" })
  .then(() => console.log("🔥 MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Start the Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
