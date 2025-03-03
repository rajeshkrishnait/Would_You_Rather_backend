const express = require("express");
const { getRandomQuestion, voteOnQuestion, createNewQuestion } = require("../controllers/questionController");

const router = express.Router();

router.get("/random", getRandomQuestion);
router.put("/:id/vote", voteOnQuestion);
router.put("/new_question", createNewQuestion);
module.exports = router;
