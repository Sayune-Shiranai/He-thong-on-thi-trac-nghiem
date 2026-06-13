const db = require('../models/index.js');
const path = require("path");
const fs = require("fs");

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
                { content: { [Op.like]: `%${keyword}%` } }
                ]
            };
        }

        const totalRecords = await db.Question.count({ where });

        const questions = await db.Question.findAll({
            where,
              include: [
                {
                    model: db.Grade,
                    attributes: ["id", "grade"]
                },
                {
                    model: db.Subject,
                    attributes: ["id", "name"]
                },
                {
                    model: db.Exam,
                    attributes: ["id", "title"]
                }
            ],
            limit,
            offset,
            order: [["id", "DESC"]]
        });

        const totalPages = Math.ceil(totalRecords / limit);

        return res.json({
            page,
            limit,
            totalPages,
            totalRecords,
            data: questions
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

// create question
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

    // if (!exam) {
    //   return res.status(404).json({
    //     message: "Đề thi không tồn tại"
    //   });
    // }

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

// sử dụng ngân hàng câu hỏi
const UseQuestionBank = async (req, res) => {
  try {
    const { exam_id, question_ids } = req.body;

    const exam = await db.Exam.findOne({
      where: { id: exam_id }
    });

    if (!exam) {
      return res.status(404).json({
        message: "Không tìm thấy đề thi"
      });
    }

    const data = question_ids.map(question_id => ({
      exam_id,
      question_id
    }));

    await db.Exam_Question.bulkCreate(data);

    return res.json({
      message: "Thêm câu hỏi thành công"
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

// create question by upload image
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

    const exam = await db.Exam.findOne({
      where: { id: exam_id }
    });

    // if (!exam) {
    //   return res.status(404).json({
    //     message: "Đề thi không tồn tại"
    //   });
    // }

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
        content_img: `/media/exam/${req.file.filename}`,
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

// duyệt câu hỏi
const ApproveQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await db.Question.findOne({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({
        message: "Câu hỏi không tồn tại"
      });
    }

    question.status = "Approved";
    await question.save();
    return res.json({
      message: "Duyệt câu hỏi thành công",
      data: question
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

//delete question
const DeleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await db.Question.findOne({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({
        message: "Câu hỏi không tồn tại"
      });
    }

    // if (question.content_img) {
    //   const imagePath = path.join(__dirname, "..", "public", question.content_img);
    //   if (fs.existsSync(imagePath)) {
    //     fs.unlinkSync(imagePath);
    //   }
    // }

    await question.destroy();
    return res.json({
      message: "Xóa câu hỏi thành công"
    });
  }
  catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}

// hủy duyệt câu hỏi
const RejectQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await db.Question.findOne({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({
        message: "Câu hỏi không tồn tại"
      });
    }

    question.status = "Rejected";
    await question.save();
    return res.json({
      message: "Hủy duyệt câu hỏi thành công",
      data: question
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  GetPaged,
  CreateQuestion,
  UploadQuestionImage,
  ApproveQuestion,
  RejectQuestion
};