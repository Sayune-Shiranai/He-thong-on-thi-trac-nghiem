const db = require('../models/index.js');
const path = require("path");
const fs = require("fs");

const CreateQuestion = async (req, res) => {
  try {
    const {
      content,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    } = req.body;

    const question = await db.Question.create({
      content,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    });

    return res.status(201).json({
      message: "Tạo câu hỏi thành công",
      data: question
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

const UploadQuestionImage = async (req, res) => {
  try {
    const {
      answer_count,
      correct_answers
    } = req.body;

    // kiểm tra ảnh
    if (!req.file) {
      return res.status(400).json({
        message: "Vui lòng upload ảnh"
      });
    }
    // kiểm tra số lượng câu
    if (!answer_count || answer_count <= 0) {
      return res.status(400).json({
        message: "Số lượng câu hỏi không hợp lệ"
      });
    }
    // parse mảng nếu gửi form-data
    const parsedAnswers =
      typeof correct_answers === "string"
        ? JSON.parse(correct_answers)
        : correct_answers;
    // kiểm tra mảng đáp án đúng
    if (!Array.isArray(parsedAnswers)) {
      return res.status(400).json({
        message: "correct_answers phải là mảng"
      });
    }
    // kiểm tra số lượng đáp án đúng
    if (parsedAnswers.length != answer_count) {
      return res.status(400).json({
        message: "Số lượng đáp án đúng không khớp"
      });
    }
    const createdQuestions = [];
    // tạo nhiều câu hỏi
    for (let i = 0; i < answer_count; i++) {
      const answer = parsedAnswers[i];
      // validate đáp án đúng
      if (!["A", "B", "C", "D"].includes(answer)) {
        return res.status(400).json({
          message: `Đáp án câu ${i + 1} không hợp lệ`
        });
      }
      const question = await db.Question.create({
        image: `/uploads/questions/${req.file.filename}`,
        question_number: i + 1,
        correct_answer: answer
      });

      createdQuestions.push(question);
    }
    return res.status(201).json({

      message: "Upload ảnh thành công",
      total_questions: createdQuestions.length,
      data: createdQuestions
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  CreateQuestion,
  UploadQuestionImage
};