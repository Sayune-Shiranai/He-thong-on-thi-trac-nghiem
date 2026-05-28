const db = require('../models/index.js');
const { Op } = require('sequelize');

// lấy danh sách câu hỏi trong đề
const GetByExam = async (req, res) => {
  try {
    const { exam_id } = req.params;

    const exam = await db.Exam.findOne({
      where: {
        id: exam_id
      },
      include: [
        {
          model: db.Question
        }
      ]
    });

    if (!exam) {
      return res.status(404).json({
        error: 'Không tìm thấy đề thi!'
      });
    }

    return res.json(exam.Questions);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// thêm câu hỏi vào đề thi
const AddQuestion = async (req, res) => {
  try {
    const {
      exam_id,
      question_id
    } = req.body;

    if (!exam_id) {
      return res.status(400).json({
        error: 'Vui lòng truyền exam_id!'
      });
    }

    if (!question_id) {
      return res.status(400).json({
        error: 'Vui lòng truyền question_id!'
      });
    }

    const exam = await db.Exam.findOne({
      where: {
        id: exam_id
      }
    });

    if (!exam) {
      return res.status(404).json({
        error: 'Không tìm thấy đề thi!'
      });
    }

    const question = await db.Question.findOne({
      where: {
        id: question_id
      }
    });

    if (!question) {
      return res.status(404).json({
        error: 'Không tìm thấy câu hỏi!'
      });
    }

    const checkExist = await db.Exam_Question.findOne({
      where: {
        exam_id,
        question_id
      }
    });

    if (checkExist) {
      return res.status(400).json({
        error: 'Câu hỏi đã tồn tại trong đề thi!'
      });
    }

    const newExamQuestion = await db.Exam_Question.create({
      exam_id,
      question_id
    });

    return res.status(201).json({
      message: 'Thêm câu hỏi vào đề thi thành công!',
      data: newExamQuestion
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// thêm nhiều câu hỏi vào đề
const AddMultipleQuestions = async (req, res) => {
  try {
    const {
      exam_id,
      question_ids
    } = req.body;

    if (!exam_id) {
      return res.status(400).json({
        error: 'Vui lòng truyền exam_id!'
      });
    }

    if (
      !question_ids ||
      !Array.isArray(question_ids)
    ) {
      return res.status(400).json({
        error: 'question_ids không hợp lệ!'
      });
    }

    const exam = await db.Exam.findOne({
      where: {
        id: exam_id
      }
    });

    if (!exam) {
      return res.status(404).json({
        error: 'Không tìm thấy đề thi!'
      });
    }

    const insertData = [];

    for (const question_id of question_ids) {
      const checkExist = await db.Exam_Question.findOne({
        where: {
          exam_id,
          question_id
        }
      });

      if (!checkExist) {
        insertData.push({
          exam_id,
          question_id
        });
      }
    }

    await db.Exam_Question.bulkCreate(insertData);

    return res.json({
      message: 'Thêm nhiều câu hỏi thành công!',
      total: insertData.length
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// xóa câu hỏi khỏi đề
const RemoveQuestion = async (req, res) => {
  try {
    const {
      exam_id,
      question_id
    } = req.body;

    const examQuestion = await db.Exam_Question.findOne({
      where: {
        exam_id,
        question_id
      }
    });

    if (!examQuestion) {
      return res.status(404).json({
        error: 'Không tìm thấy dữ liệu!'
      });
    }

    await examQuestion.destroy();

    return res.json({
      message: 'Xóa câu hỏi khỏi đề thi thành công!'
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// xóa tất cả câu hỏi khỏi đề
const RemoveAllQuestions = async (req, res) => {
  try {
    const { exam_id } = req.params;

    await db.Exam_Question.destroy({
      where: {
        exam_id
      }
    });

    return res.json({
      message: 'Đã xóa toàn bộ câu hỏi khỏi đề thi!'
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// random câu hỏi vào đề
const RandomQuestions = async (req, res) => {
  try {
    const {
      exam_id,
      subject_id,
      limit = 10
    } = req.body;

    const questions = await db.Question.findAll({
      where: {
        subject_id
      },
      order: db.sequelize.random(),
      limit: parseInt(limit)
    });

    if (!questions.length) {
      return res.status(404).json({
        error: 'Không có câu hỏi phù hợp!'
      });
    }

    const insertData = [];

    for (const item of questions) {
      const checkExist = await db.Exam_Question.findOne({
        where: {
          exam_id,
          question_id: item.id
        }
      });

      if (!checkExist) {
        insertData.push({
          exam_id,
          question_id: item.id
        });
      }
    }

    await db.Exam_Question.bulkCreate(insertData);

    return res.json({
      message: 'Random câu hỏi thành công!',
      total: insertData.length
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  GetByExam,
  AddQuestion,
  AddMultipleQuestions,
  RemoveQuestion,
  RemoveAllQuestions,
  RandomQuestions
};
