const express = require("express");
const {
  CreateExam
} = require("../../controllers/ExamController");

const router = express.Router();
router.post("/create", CreateExam);

module.exports = router;