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
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Vui lòng upload ảnh"
      });
    }

    if (
      !option_a ||
      !option_b ||
      !option_c ||
      !option_d
    ) {
      return res.status(400).json({
        message: "Thiếu đáp án"
      });
    }

    const question = await db.Question.create({

      image: `/uploads/questions/${req.file.filename}`,

      option_a,
      option_b,
      option_c,
      option_d,

      correct_answer
    });

    return res.status(201).json({
      message: "Upload câu hỏi thành công",
      data: question
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