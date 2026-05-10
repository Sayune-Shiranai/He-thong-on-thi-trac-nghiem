const express = require("express");
const {
  CreateExam
} = require("../../controllers/ExamController");

const router = express.Router();
router.post("/", CreateExam);

module.exports = router;