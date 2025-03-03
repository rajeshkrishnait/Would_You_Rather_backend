const Question = require("../models/Question.js");
const generateBase62Id = require("../utils/idGenerator.js"); // Import helper

// 🎲 GET Random Question

exports.getRandomQuestion = async (req, res) => {
  try {
    const randomQuestion = await Question.aggregate([{ $sample: { size: 1 } }]);

    if (!randomQuestion.length) {
      return res.status(404).json({ message: "No questions found" });
    }

    res.json(randomQuestion[0]); // Send a single random document
  } catch (error) {
    console.error("Error fetching random question:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ✅ PUT - Vote on a Question
exports.voteOnQuestion = async (req, res) => {
  const { id } = req.params;
  const { vote } = req.body; // Should be either "vote_one" or "vote_two"

  try {
    let question = await Question.findOne({ question_id: id });
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (vote === "vote_one") {
      question.vote_one += 1;
    } else if (vote === "vote_two") {
      question.vote_two += 1;
    } else {
      return res.status(400).json({ message: "Invalid vote choice" });
    }

    question.total_votes += 1;
    question.updated_at = new Date(); // Ensure correct timestamp

    // Save the document and fetch the updated version
    await question.save();
    question = await Question.findOne({ question_id: id }); // Fetch latest data
    console.log(question)
    res.json({ message: "Vote recorded", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ POST - Create a new question
exports.createNewQuestion = async (req, res) => {
  const { question_one, question_two } = req.body;
  console.log(req.body)
  // Validate input
  if (!question_one || !question_two) {
    return res.status(400).json({ message: "Both questions are required" });
  }

  try {
    const question = new Question({
      question_id: generateBase62Id(), // Generate Base62 encoded ID
      question_one,
      question_two,
      vote_one: 0,
      vote_two: 0,
      total_votes: 0,
    });

    await question.save();
    res.status(201).json({ message: "Question created successfully", question });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Server error" });
  }
};