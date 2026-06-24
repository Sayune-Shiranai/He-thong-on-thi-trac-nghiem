const express = require("express");
const {
  CreateExam,
  GetAllExams,
  GetExamById,
  // GetAllExamByGrade
} = require("../../controllers/ExamController");

const router = express.Router();
router.get("/", GetAllExams);
router.post("/create", CreateExam);
router.get("/:id", GetExamById);
// router.get("//:grade_id", GetAllExamByGrade);

module.exports = router;