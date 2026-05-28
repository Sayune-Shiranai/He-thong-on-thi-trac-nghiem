const express = require('express');
const router = express.Router();

const {
  GetByExam,
  AddQuestion,
  AddMultipleQuestions,
  RemoveQuestion,
  RemoveAllQuestions,
  RandomQuestions
} = require('../controllers/Exam_QuestionController');

const Authentication = require('../middlewares/Authentication');

// lấy danh sách câu hỏi trong đề
router.get(
  '/exam/:exam_id',
  Authentication,
  GetByExam
);

// thêm câu hỏi vào đề
router.post(
  '/add-question',
  Authentication,
  AddQuestion
);

// thêm nhiều câu hỏi
router.post(
  '/add-multiple',
  Authentication,
  AddMultipleQuestions
);

// random câu hỏi
router.post(
  '/random-question',
  Authentication,
  RandomQuestions
);

// xóa câu hỏi khỏi đề
router.delete(
  '/remove-question',
  Authentication,
  RemoveQuestion
);

// xóa toàn bộ câu hỏi
router.delete(
  '/remove-all/:exam_id',
  Authentication,
  RemoveAllQuestions
);

module.exports = router;