const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question_id: { type: String, required: true, unique: true }, // Base62 ID
  question_one: { type: String, required: true },
  question_two: { type: String, required: true },
  image_one_url:{type:String, required:false},
  image_two_url:{type:String, required:false},
  vote_one: { type: Number, default: 0 },
  vote_two: { type: Number, default: 0 },
  total_votes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },  
  updated_at: { type: Date, default: Date.now }
});


const Question = mongoose.model("Question", questionSchema, "questions");

module.exports = Question;
