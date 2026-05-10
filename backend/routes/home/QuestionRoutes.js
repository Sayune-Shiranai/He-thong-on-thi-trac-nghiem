const express = require("express");
const upload = require("../../middlewares/Upload");
const {
  CreateQuestion,
  UploadQuestionImage
} = require("../../controllers/QuestionController");

const router = express.Router();
router.post("/", CreateQuestion);
router.post("/upload", upload.single("image"), UploadQuestionImage);

module.exports = router;