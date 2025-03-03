const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question_id: { type: String, required: true, unique: true }, // Base62 ID
  question_one: { type: String, required: true },
  question_two: { type: String, required: true },
  vote_one: { type: Number, default: 0 },
  vote_two: { type: Number, default: 0 },
  total_votes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },  // Ensure Date format
  updated_at: { type: Date, default: Date.now }
});

// Ensure collection name is exactly "questions"
const Question = mongoose.model("Question", questionSchema, "questions");

module.exports = Question;
