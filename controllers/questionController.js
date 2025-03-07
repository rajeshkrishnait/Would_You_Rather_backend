const Question = require("../models/Question.js");
const generateBase62Id = require("../utils/idGenerator.js"); // Import helper
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage (for handling file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });



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
  console.log(req.body)
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

    res.json({ message: "Vote recorded", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.createNewQuestion = [
  upload.fields([
    { name: "imageOne", maxCount: 1 },
    { name: "imageTwo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { questionOne, questionTwo } = req.body;

      // Check if all required fields are present
      if (
        !questionOne ||
        !questionTwo ||
        !req.files.imageOne ||
        !req.files.imageTwo
      ) {
        return res.status(400).json({
          message: "Both questions and exactly two images are required",
        });
      }

      // Extract image buffers from request
      const imageOneBuffer = req.files.imageOne[0].buffer;
      const imageTwoBuffer = req.files.imageTwo[0].buffer;

      // Function to upload image to Cloudinary
      const uploadToCloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", format: "webp", quality: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(fileBuffer);
        });
      };

      // Upload both images to Cloudinary in parallel
      const [imageOneUrl, imageTwoUrl] = await Promise.all([
        uploadToCloudinary(imageOneBuffer),
        uploadToCloudinary(imageTwoBuffer),
      ]);

      // Save the new question to the database
      const question = new Question({
        question_id: generateBase62Id(),
        question_one: questionOne,
        question_two: questionTwo,
        vote_one: 0,
        vote_two: 0,
        total_votes: 0,
        image_one_url: imageOneUrl,
        image_two_url: imageTwoUrl,
      });

      await question.save();
      res.status(201).json({ message: "Question created successfully", question });
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];