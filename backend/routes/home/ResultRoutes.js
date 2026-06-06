const express = require('express');
const router = express.Router();

const {
  GetPaged,
  SubmitExam,
  GetById,   
  GetByUser,
  GetByExam,
  DeleteResult
} = require('../../controllers/ResultController');

// GET /api/results - Danh sách kết quả (phân trang)
router.get('/', GetPaged);

// POST /api/results/submit - Nộp bài & tính điểm
router.post('/submit', SubmitExam);

// GET /api/results/detail/:id - Chi tiết 1 lần thi
router.get('/detail/:id', GetById);

// GET /api/results/my-results?user_id=1 - Lịch sử thi của user
router.get('/my-results', GetByUser);

// GET /api/results/exam/:exam_id - Kết quả theo đề thi
router.get('/exam/:exam_id', GetByExam);

// DELETE /api/results/delete/:id - Xóa kết quả
router.delete('/delete/:id', DeleteResult);

module.exports = router;