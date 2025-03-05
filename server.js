const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
// Initialize session middleware (add this in your server setup)
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set `true` for HTTPS
}));
// Define allowed origins (add your production frontend URL)
const allowedOrigins = [
  "http://localhost:5173", 
  "https://rajeshkrishnait.github.io"
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked CORS request from:", origin); // Debugging log
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT"], 
    credentials: true, // Required if using cookies or auth tokens
  })
);

// Middleware
app.use(express.json());

app.get('/clear-session', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Failed to clear session" });
    }
    res.clearCookie('connect.sid'); // Removes session cookie from browser
    res.json({ message: "Session cleared" });
  });
});

app.get("/api/questions/healthcheck", (req, res) => {
  res.status(200).send("OK");
});
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
