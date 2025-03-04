const Question = require("../models/Question.js");
const generateBase62Id = require("../utils/idGenerator.js"); // Import helper
// 🎲 GET Random Question
exports.getRandomQuestion = async (req, res) => {
  try {
    const batchSize = 3; // Adjust batch size as needed
    let questions = await Question.find().sort({ question_id: 1 }); // Ensure consistent order

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }
    // Initialize session variables correctly (set startIndex only once)
    if (req.session.startIndex === undefined) {
      req.session.startIndex = Math.floor(Math.random() * questions.length);
      req.session.prevIndex = req.session.startIndex; // Start from this index
    }else if(req.session.startIndex == req.session.prevIndex){
      return res.json({ message: "No more questions to send" });

    }
    let result = [];
    let prevIndex = req.session.prevIndex;
    let count = 0;
    // Fetch batchSize number of questions in circular order
    while (result.length < batchSize && count < questions.length) {
      let question = questions[prevIndex];
      result.push(question);

      // Move circularly
      prevIndex = (prevIndex + 1) % questions.length;
      count++;

      // Stop if prevIndex meets startIndex after at least one full cycle
      if (prevIndex === req.session.startIndex) break;
    }

    // Update prevIndex for the next request (startIndex remains unchanged)
    req.session.prevIndex = prevIndex;

    res.json(result);
  } catch (error) {
    console.error("Error fetching random questions:", error);
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