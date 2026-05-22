const express = require("express");
const {
  CreateExam,
  GetAllExams,
  GetExamDetail,
  // GetAllExamByGrade
} = require("../../controllers/ExamController");

const router = express.Router();
router.post("/create", CreateExam);
router.get("/", GetAllExams);
router.get("/:id", GetExamDetail);
// router.get("//:grade_id", GetAllExamByGrade);

module.exports = router;