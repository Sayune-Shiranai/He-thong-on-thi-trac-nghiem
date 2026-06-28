const express = require("express");
const upload = require("../../middlewares/Upload");
const {
  GetPaged,
  CreateQuestion,
  UpdateQuestion,
  CreateQuestionWithExam,
  UseQuestionBank,
  RandomQuestion,
  UploadQuestionImage,
  DeleteQuestion,
  ApproveQuestion,
  RejectQuestion,
  GetAllQuestionGradeSubjectByExam,
  GetQuestionById
} = require("../../controllers/QuestionController");

const router = express.Router();
router.get("/", GetPaged);
router.post("/createquestion", CreateQuestion);
router.post("/create", CreateQuestionWithExam);
router.post("/create/usequestionbank", UseQuestionBank);
router.post("/create/random", RandomQuestion);
router.post("/exam/:exam_id/upload", upload.single("content_img"), UploadQuestionImage);
router.put("/update/:id", UpdateQuestion);
router.delete("/delete/:id", DeleteQuestion);
router.post("/approve/:id", ApproveQuestion); // dashboard/user/approve/:id
router.post("/reject/:id", RejectQuestion); // dashboard/user/reject/:id
router.get("/exam/:exam_id/questionbank", GetAllQuestionGradeSubjectByExam)
router.get("/:id", GetQuestionById);


module.exports = router;