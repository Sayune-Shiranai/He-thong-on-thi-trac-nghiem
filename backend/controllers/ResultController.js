const db = require('../models/index.js');
const { Op } = require('sequelize');

// 1. SUBMIT EXAM - Nộp bài & tính điểm
const SubmitExam = async (req, res) => {
  try {
    // Dữ liệu client gửi lên
    const { 
      user_id, 
      exam_id, 
      started_at, 
      duration, 
      answers 
    } = req.body;

    // Validate required fields
    if (!user_id || !exam_id || !answers) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc"
      });
    }

    // Lấy danh sách câu hỏi của đề thi
    const examQuestions = await db.Exam_Question.findAll({
      where: { exam_id },
      include: [{
        model: db.Question,
        attributes: ['id', 'correct_answer']
      }]
    });

    if (!examQuestions.length) {
      return res.status(404).json({
        message: "Đề thi không có câu hỏi"
      });
    }

    // Tính điểm
    let correct_count = 0;
    let wrong_count = 0;
    let null_count = 0;
    const resultDetails = [];

    examQuestions.forEach(eq => {
      const question = eq.Question;
      // Tìm câu trả lời của user
      const userAnswer = answers.find(a => a.question_id === question.id);
      const selected_answer = userAnswer ? userAnswer.selected_answer : null;
      
      let is_correct = false;
      if (selected_answer === null) {
        null_count++;
      } else if (selected_answer === question.correct_answer) {
        is_correct = true;
        correct_count++;
      } else {
        wrong_count++;
      }

      // Lưu chi tiết từng câu
      resultDetails.push({
        question_id: question.id,
        selected_answer: selected_answer,
        is_correct: is_correct
      });
    });

    // Tính điểm (giả định: mỗi câu đúng 1 điểm)
    const total_question = examQuestions.length;
    const total_score = correct_count;
    const submitted_at = new Date();

    // Tạo Result
    const result = await db.Result.create({
      user_id,
      exam_id,
      total_score,
      total_question: total_question.toString(), // Hoặc INTEGER
      started_at,
      submitted_at,
      duration
    });

    // Tạo Resultdetail cho từng câu
    for (const detail of resultDetails) {
      await db.Resultdetail.create({
        result_id: result.id,
        question_id: detail.question_id,
        selected_answer: detail.selected_answer,
        is_correct: detail.is_correct
      });
    }

    // Trả về kết quả
    return res.status(201).json({
      message: "Nộp bài thành công",
      data: {
        id: result.id,
        total_score,
        total_question: total_question,
        correct_count,
        wrong_count,
        null_count,
        duration,
        submitted_at
      }
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// 2. GET ALL - Lấy tất cả kết quả (không phân trang)
const GetPaged = async (req, res) => {
  try {
    const results = await db.Result.findAll({
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: db.Exam,
          attributes: ['id', 'title']
        }
      ],
      order: [['submitted_at', 'DESC']]
    });

    return res.json({
      data: results
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// 3. GET BY ID - Chi tiết 1 lần thi
const GetById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.Result.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: db.Exam,
          attributes: ['id', 'title']
        }
      ]
    });

    if (!result) {
      return res.status(404).json({
        message: "Kết quả không tồn tại"
      });
    }

    // Lấy chi tiết các câu trả lời
    const details = await db.Resultdetail.findAll({
      where: { result_id: id },
      include: [{
        model: db.Question,
        attributes: ['id', 'content', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']
      }]
    });

    return res.json({
      data: {
        ...result.toJSON(),
        details
      }
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// 4. GET BY USER - Lịch sử thi của user
const GetByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const where = { user_id };
    const totalRecords = await db.Result.count({ where });

    const results = await db.Result.findAll({
      where,
      include: [{
        model: db.Exam,
        attributes: ['id', 'title']
      }],
      limit: limitNum,
      offset,
      order: [['submitted_at', 'DESC']]
    });

    const totalPages = Math.ceil(totalRecords / limitNum);

    return res.json({
      page: pageNum,
      limit: limitNum,
      totalPages,
      totalRecords,
      data: results
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// 5. GET BY EXAM - Kết quả theo đề thi
const GetByExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const where = { exam_id };
    const totalRecords = await db.Result.count({ where });

    const results = await db.Result.findAll({
      where,
      include: [{
        model: db.User,
        attributes: ['id', 'username']
      }],
      limit: limitNum,
      offset,
      order: [['total_score', 'DESC']] // Sắp xếp theo điểm cao nhất
    });

    const totalPages = Math.ceil(totalRecords / limitNum);

    // Thống kê
    const stats = await db.Result.findAll({
      where,
      attributes: [
        [db.sequelize.fn('AVG', db.sequelize.col('total_score')), 'avg_score'],
        [db.sequelize.fn('MAX', db.sequelize.col('total_score')), 'max_score']
      ],
      raw: true
    });

    return res.json({
      page: pageNum,
      limit: limitNum,
      totalPages,
      totalRecords,
      stats: stats[0],
      data: results
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// 6. DELETE - Xóa kết quả
const DeleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.Result.findOne({
      where: { id }
    });

    if (!result) {
      return res.status(404).json({
        message: "Kết quả không tồn tại"
      });
    }

    // Xóa chi tiết trước
    await db.Resultdetail.destroy({
      where: { result_id: id }
    });

    // Xóa kết quả
    await result.destroy();

    return res.json({
      message: "Xóa kết quả thành công"
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// EXPORT
module.exports = {
  SubmitExam,
  GetPaged,
  GetById,
  GetByUser,
  GetByExam,
  DeleteResult
};