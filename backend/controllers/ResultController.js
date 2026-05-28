const db = require('../models/index.js');
const { Op } = require('sequelize');

// xem danh sách kết quả có phân trang
const GetPaged = async (req, res) => {
  try {
    let { page = 1, limit = 10, keyword = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    let where = {};

    if (keyword) {
      where = {
        [Op.or]: [
          {
            '$User.username$': {
              [Op.like]: `%${keyword}%`
            }
          },
          {
            '$Exam.title$': {
              [Op.like]: `%${keyword}%`
            }
          }
        ]
      };
    }

    const totalRecords = await db.Result.count({
      where,
      include: [
        {
          model: db.User,
          attributes: []
        },
        {
          model: db.Exam,
          attributes: []
        }
      ]
    });

    const result = await db.Result.findAll({
      where,
      include: [
        {
          model: db.User
        },
        {
          model: db.Exam
        }
      ],
      limit,
      offset,
      order: [['id', 'DESC']]
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return res.json({
      page,
      limit,
      totalPages,
      totalRecords,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// nộp bài thi
const SubmitExam = async (req, res) => {
  try {
    const {
      exam_id,
      answers,
      started_at
    } = req.body;
const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({
        error: 'Vui lòng truyền user_id!'
      });
    }

    if (!exam_id) {
      return res.status(400).json({
        error: 'Vui lòng truyền exam_id!'
      });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: 'Answers không hợp lệ!'
      });
    }

    const exam = await db.Exam.findOne({
      where: { id: exam_id },
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

    let correctCount = 0;

    const totalQuestion = exam.Questions.length;

    const submitted_at = new Date();

    let duration = 0;

    if (started_at) {
      const start = new Date(started_at);
      duration = Math.floor((submitted_at - start) / 1000);
    }

    const newResult = await db.Result.create({
      user_id,
      exam_id,
      total_question: totalQuestion,
      total_score: 0,
      started_at,
      submitted_at,
      duration
    });

    for (const item of answers) {
      const question = await db.Question.findOne({
        where: {
          id: item.question_id
        }
      });

      if (!question) continue;

      const isCorrect =
        question.correct_answer === item.selected_answer;

      if (isCorrect) {
        correctCount++;
      }

      await db.Resultdetail.create({
        result_id: newResult.id,
        question_id: question.id,
        selected_answer: item.selected_answer,
        is_correct: isCorrect
      });
    }

    const score = Number(
      ((correctCount / totalQuestion) * 10).toFixed(2)
    );

    await newResult.update({
      total_score: score
    });

    return res.status(201).json({
      message: 'Nộp bài thành công!',
      data: {
        result_id: newResult.id,
        score,
        correct_answer: correctCount,
        total_question: totalQuestion,
        duration
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// xem chi tiết kết quả
const GetDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.Result.findOne({
      where: { id },
      include: [
        {
          model: db.User
        },
        {
          model: db.Exam
        },
        {
          model: db.Resultdetail,
          include: [
            {
              model: db.Question
            }
          ]
        }
      ]
    });

    if (!result) {
      return res.status(404).json({
        error: 'Không tìm thấy kết quả!'
      });
    }

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// xem lịch sử làm bài
const GetMyResults = async (req, res) => {
  try {
    const user_id = req.user.id;

    const results = await db.Result.findAll({
      where: {
        user_id
      },
      include: [
        {
          model: db.Exam
        }
      ],
      order: [['id', 'DESC']]
    });

    return res.json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// xóa kết quả
const DeleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.Result.findOne({
      where: { id }
    });

    if (!result) {
      return res.status(404).json({
        error: 'Không tìm thấy kết quả!'
      });
    }

    await db.Resultdetail.destroy({
      where: {
        result_id: id
      }
    });

    await result.destroy();

    return res.json({
      message: 'Xóa kết quả thành công!'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
module.exports = {
  GetPaged,
  SubmitExam,
  GetDetail,
  GetMyResults,
  DeleteResult
};