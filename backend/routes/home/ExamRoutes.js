const express = require("express");
const {
  CreateExam,
  GetAllExams,
  GetExamById,
  StartExam,
  SubmitExam
} = require("../../controllers/ExamController");

const router = express.Router();
router.get("/", GetAllExams);
router.post("/create", CreateExam);
router.get("/:id", GetExamById);
router.post("/:id/start", StartExam);
router.post("/:id/submit", SubmitExam);
// router.get("//:grade_id", GetAllExamByGrade);

module.exports = router;