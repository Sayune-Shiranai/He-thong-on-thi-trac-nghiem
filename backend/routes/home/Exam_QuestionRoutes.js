const express = require("express");s
const {
  AddQuestionToExam
} = require("../../controllers/Exam_QuestionController");

const router = express.Router();
router.post("/", AddQuestionToExam);

module.exports = router;