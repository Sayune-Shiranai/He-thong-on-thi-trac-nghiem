const db = require('../models/index.js');
const path = require("path");
const fs = require("fs");

const CreateQuestion = async (req, res) => {
  try {
    const {
      exam_id,
      content,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    } = req.body;

    if (!exam_id) {
      return res.status(400).json({
        field: "exam_id",
        message: "Thiếu exam_id"
      });
    }

    if (!content) {
      return res.status(400).json({
        field: "content",
        message: "Nội dung câu hỏi không được để trống"
      });
    }

    if (!correct_answer) {
      return res.status(400).json({
        field: "correct_answer",
        message: "Vui lòng chọn đáp án đúng"
      });
    }

    const exam = await db.Exam.findOne({
      where: { id: exam_id }
    });

    if (!exam) {
      return res.status(404).json({
        message: "Đề thi không tồn tại"
      });
    }

    const question = await db.Question.create({
      content,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      grade_id: exam.grade_id,
      subject_id: exam.subject_id
    });

    await db.Exam_Question.create({
      exam_id: exam.id,
      question_id: question.id
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
      exam_id,
      answer_count,
      correct_answers
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Vui lòng upload ảnh"
      });
    }

    if (!exam_id) {
      return res.status(400).json({
        message: "Thiếu exam_id"
      });
    }

    const exam = await db.Exam.findOne({
      where: { id: exam_id }
    });

    if (!exam) {
      return res.status(404).json({
        message: "Đề thi không tồn tại"
      });
    }

    const totalQuestions = parseInt(answer_count);

    if (isNaN(totalQuestions) || totalQuestions <= 0) {
      return res.status(400).json({
        message: "Số lượng câu hỏi không hợp lệ"
      });
    }

    const parsedAnswers =
      typeof correct_answers === "string"
        ? JSON.parse(correct_answers)
        : correct_answers;

    if (!Array.isArray(parsedAnswers)) {
      return res.status(400).json({
        message: "correct_answers phải là mảng"
      });
    }

    if (parsedAnswers.length !== totalQuestions) {
      return res.status(400).json({
        message: "Số lượng đáp án không khớp"
      });
    }

    const createdQuestions = [];

    for (let i = 0; i < totalQuestions; i++) {
      const answer = parsedAnswers[i];
      const question = await db.Question.create({
        content_img: `/media/${req.file.filename}`,
        question_number: i + 1,
        answer_count: totalQuestions,
        correct_answer: answer,
        grade_id: exam.grade_id,
        subject_id: exam.subject_id
      });

      await db.Exam_Question.create({
        exam_id: exam.id,
        question_id: question.id
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