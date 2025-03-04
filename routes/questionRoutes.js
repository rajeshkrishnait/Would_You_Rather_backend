const express = require("express");
const { getRandomQuestion, voteOnQuestion, createNewQuestion } = require("../controllers/questionController");

const router = express.Router();

router.get("/random", getRandomQuestion);
router.put("/vote/:id", voteOnQuestion);
router.post("/new_question", createNewQuestion);
module.exports = router;
