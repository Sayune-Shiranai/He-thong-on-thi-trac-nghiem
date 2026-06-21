const express = require("express");
const upload = require("../../middlewares/Upload");
const {
  GetPaged,
  CreateQuestion,
  UseQuestionBank,
  RandomQuestion,
  UploadQuestionImage,
  DeleteQuestion,
  ApproveQuestion,
  RejectQuestion
} = require("../../controllers/QuestionController");

const router = express.Router();
router.get("/", GetPaged);
router.post("/create", CreateQuestion);
router.post("/create/usequestionbank", UseQuestionBank);
router.post("/create/random", RandomQuestion);
router.post("/create/upload", upload.single("content_img"), UploadQuestionImage);
router.delete("/delete/:id", DeleteQuestion);
router.post("/approve/:id", ApproveQuestion); // dashboard/user/approve/:id
router.post("/reject/:id", RejectQuestion); // dashboard/user/reject/:id

module.exports = router;