const express = require("express");
const upload = require("../../middlewares/Upload");
const {
  CreateQuestion,
  UseQuestionBank,
  RandomQuestion,
  UploadQuestionImage
} = require("../../controllers/QuestionController");

const router = express.Router();
router.post("/create", CreateQuestion);
router.post("/create/usequestionbank", UseQuestionBank);
router.post("/create/random", RandomQuestion);
router.post("/create/upload", upload.single("content_img"), UploadQuestionImage);

module.exports = router;