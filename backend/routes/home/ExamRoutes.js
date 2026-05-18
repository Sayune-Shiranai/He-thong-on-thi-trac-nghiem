const express = require("express");
const {
  CreateExam,
  GetExamDetail
} = require("../../controllers/ExamController");

const router = express.Router();
router.post("/create", CreateExam);
router.get("/:id", GetExamDetail);

module.exports = router;