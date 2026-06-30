const db = require('../models/index.js');
const path = require("path");
const fs = require("fs");
const { Op } = require('sequelize');

const GetPaged = async (req, res) => {
  try {
      let { page = 1, limit = 10, keyword = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const offset = (page - 1) * limit;

      let where = {
        content_img: null
      };

      const FindGrade = await db.Grade.findAll({
        where: {
            grade: {
                [Op.like]: `%${keyword}%`
            }
        }
      });

      const grades = FindGrade.map(g => g.id);

      const FindSubject = await db.Subject.findAll({
        where: {
            name: {
                [Op.like]: `%${keyword}%`
            }
        }
      });

      const subjects = FindSubject.map(g => g.id);

      if (keyword) {
          where = {
              ...where,
              [Op.or]: [
              { content: { [Op.like]: `%${keyword}%` } },
              { grade_id: { [Op.in]: grades } },
              { subject_id: { [Op.in]: subjects } },
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
            },
            {
                model: db.Status,
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

// const GetAllQuestionByExam = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const questions = await db.Question.findAll({
//       include: [
//         {
//           model: db.Exam,
//           where: { id: req.params.id },
//           through: { attributes: [] }
//         }
//       ]
//     });

//     return res.json({
//         success: true,
//         data: questions
//     });

//   } catch (err) {
//     return res.status(500).json({
//         success: false,
//         message: err.message
//     });
//   }
// };

// create question
const CreateQuestion = async (req, res) => {
  try {
    const {
      content,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      grade_id,
      subject_id
    } = req.body;

    if (!subject_id) {
      return res.status(400).json({
        field: "subject_id",
        message: "Khối không được để trống"
      });
    }

    if (!grade_id) {
      return res.status(400).json({
        field: "grade_id",
        message: "Môn học không được để trống"
      });
    }

    if (!content) {
      return res.status(400).json({
        field: "content",
        message: "Nội dung câu hỏi không được để trống"
      });
    }

    if (!option_a) {
      return res.status(400).json({
        field: "option_a",
        message: "Nội dung đáp án A không được để trống"
      });
    }

    if (!option_b) {
      return res.status(400).json({
        field: "option_b",
        message: "Nội dung đáp án B không được để trống"
      });
    }

    if (!option_c) {
      return res.status(400).json({
        field: "option_c",
        message: "Nội dung đáp án C không được để trống"
      });
    }

    if (!option_d) {
      return res.status(400).json({
        field: "option_d",
        message: "Nội dung đáp án D không được để trống"
      });
    }

    if (!correct_answer) {
      return res.status(400).json({
        field: "correct_answer",
        message: "Vui lòng chọn đáp án đúng"
      });
    }
    const question = await db.Question.create({
      content,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      grade_id,
      subject_id,
      status_id: 2
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

//update question
const UpdateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      content,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      grade_id,
      subject_id
    } = req.body;

    const question = await db.Question.findOne({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi!" });
    }

    await question.update({
      grade_id,
      subject_id,
      content,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    });

    return res.json({
      success: true,
      message: "Cập nhật câu hỏi thành công!",
      data: question
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// create question with exam
const CreateQuestionWithExam = async (req, res) => {
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
      subject_id: exam.subject_id,
      status_id: 2
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

//random câu hỏi
const RandomQuestion = async (req, res) => {
  try {
    const { exam_id, count } = req.body;

    if (isNaN(count) || Number(count) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập số lượng câu hỏi hợp lệ!"
      });
    }

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
        success: false,
        message: "Không tìm thấy đề thi"
      });
    }

    const checkQuestion = (exam?.Questions || []).map(q => q.id);

    const questions = await db.Question.findAll({
      where: {
        grade_id: exam.grade_id,
        subject_id: exam.subject_id,
        status_id: {
          [Op.ne]: 1,
        },
        id: {
          [Op.notIn]: checkQuestion.length ? checkQuestion : [0]
        }
      },
      order: db.sequelize.random(),
      limit: Number(count)
    });

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không còn câu hỏi phù hợp để thêm."
      });
    }

    const data = questions.map(question => ({
      exam_id,
      question_id: question.id
    }));

    await db.Exam_Question.bulkCreate(data);

    return res.status(200).json({
      success: true,
      message: `Đã thêm ${questions.length} câu hỏi vào đề thi.`,
      data: questions
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// create question by upload image
const UploadQuestionImage = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const {
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
      const question = await db.Question.create({
        content_img: `/media/exam/${req.file.filename}`,
        question_number: i + 1,
        answer_count: totalQuestions,
        correct_answer: parsedAnswers[i],
        grade_id: exam.grade_id,
        subject_id: exam.subject_id,
        status_id: 2,
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

    if (question.content_img) {
      const imagePath = path.join(__dirname, "..", "public", question.content_img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

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

// duyệt câu hỏi
const ApproveQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await db.Question.findOne({
      where: { id }
    });
    if (!question) return res.status(404).json({ success: false, message: 'Không tìm thấy câu hỏi!' });

    const status = await db.Status.findOne({
      where: { name: "Approved" }
    });

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy trạng thái!"
      });
    }

    question.status_id = status.id;

    await question.save();

    res.json({ success: true, message: 'Đã duyệt', data: question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// hủy duyệt câu hỏi
const RejectQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await db.Question.findOne({
      where: { id }
    });
    if (!question) return res.status(404).json({ success: false, message: 'Không tìm thấy câu hỏi!' });

    const status = await db.Status.findOne({
      where: { name: "Rejected" }
    });

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy trạng thái!"
      });
    }

    question.status_id = status.id;
    
    await question.save();

    res.json({ success: true, message: 'Hủy duyệt', data: question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

const GetAllQuestionGradeSubjectByExam = async (req, res) => {
  try {
    const { exam_id } = req.params;

    const exam = await db.Exam.findOne({
      where: {
        id: exam_id
      }
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đề thi"
      });
    }

    const questions = await db.Question.findAll({
      where: {
        grade_id: exam.grade_id,
        subject_id: exam.subject_id,
        status_id: 2
      },
      include: [
        { 
          model: db.Grade 
        },
        { 
          model: db.Subject 
        },
        { 
          model: db.Status 
        },
      ]
    });

    return res.json({
      success: true,
      data: questions
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Lấy thông tin question theo ID
const GetQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await db.Question.findOne({
      where: { id },
      include: [
        {
          model: db.Grade
        },
        {
          model: db.Subject
        }
      ]
    });
    if (!question) return res.status(404).json({ success: false, message: 'Không tìm thấy câu hỏi!' });

    res.json({ 
      success: true, 
      data: question 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  GetPaged,
  CreateQuestion,
  UpdateQuestion,
  CreateQuestionWithExam,
  UseQuestionBank,
  RandomQuestion,
  UploadQuestionImage,
  DeleteQuestion,
  ApproveQuestion,
  RejectQuestion,
  GetAllQuestionGradeSubjectByExam,
  GetQuestionById
};