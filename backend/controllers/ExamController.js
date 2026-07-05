const db = require('../models/index.js');
const { Op } = require("sequelize");

//lấy danh sách đề thi theo phân trang
const GetPaged = async (req, res) => {
  try {
      let { page = 1, limit = 10, keyword = "", grade_id = "", subject_id = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const offset = (page - 1) * limit;

      let where = {};

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
              [Op.or]: [
              { title: { [Op.like]: `%${keyword}%` } },
              { grade_id: { [Op.in]: grades } },
              { subject_id: { [Op.in]: subjects } },
              ]
          };
      }

      if (grade_id) {
          where.grade_id = grade_id;
      }

      if (subject_id) {
          where.subject_id = subject_id;
      }

      const totalRecords = await db.Exam.count({ where });

      const exams = await db.Exam.findAll({
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
                  model: db.User,
                  attributes: ["id", "username"]
              },
              {
                  model: db.Question,
              },
              {
                model: db.Status
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
          data: exams
      });

  } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
  }
}

//create exam
const CreateExam = async (req, res) => {
  try {
    const {
      title,
      grade_id,
      subject_id,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        field: "title",
        message: "Tên đề thi không được để trống!"
      });
    }

    if (!grade_id) {
      return res.status(400).json({
        field: "grade_id",
        message: "Vui lòng chọn khối!"
      });
    }

    if (!subject_id) {
      return res.status(400).json({
        field: "subject_id",
        message: "Vui lòng chọn môn học!"
      });
    }

    const CheckExam = await db.Exam.findOne({
      where: {
        title
      }
    });

    if (CheckExam) {
      return res.status(400).json({
        field: "title",
        message: "Tên đề thi đã tồn tại!"
      });
    }

    const exam = await db.Exam.create({
      title,
      grade_id,
      subject_id,
      status_id: 2,
      user_id: req.user?.id || undefined
    });

    return res.status(201).json({
      message: "Tạo đề thành công",
      data: exam
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};


//update exam
const UpdateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title
    } = req.body;

    const exam = await db.Exam.findOne({ where: { id } });

    if (!exam) {
      return res.status(404).json({
        message: "Đề thi không tồn tại!"
      });
    }

    if (title) {
      exam.title = title;
    }

    await exam.save();

    return res.status(200).json({
      message: "Cập nhật đề thi thành công",
      data: exam
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

//delete exam
const DeleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await db.Exam.findOne({ where: { id } });

    if (!exam) {
      return res.status(404).json({
        message: "Đề thi không tồn tại!"
      });
    }
    await db.Exam_Question.destroy({
      where: { exam_id: id }
    });
    
    await exam.destroy();

    return res.status(200).json({
      message: "Xóa đề thi thành công"
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

//duyệt đề thi
const ApproveExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await db.Exam.findOne({ where: { id } });

    if (!exam) {
      return res.status(404).json({
        message: "Đề thi không tồn tại!"
      });
    }
    const status = await db.Status.findOne({
      where: { name: "Approved" }
    });

    if (!status) {
      return res.status(404).json({
        message: "Không tìm thấy trạng thái!"
      });
    }
    exam.status_id = status.id;

    await exam.save();
    return res.status(200).json({
      message: "Đã duyệt đề thi",
      data: exam
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

const DeleteQuestionByExam = async (req, res) => {
  try {
    const { exam_id, question_id } = req.params;

    const exam = await db.Exam.findOne({ where: { id: exam_id } });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đề thi"
      });
    }

    await exam.removeQuestion(question_id);

    return res.json({
      success: true,
      message: "Xóa câu hỏi khỏi đề thi thành công"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//hủy duyệt đề thi
const RejectExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await db.Exam.findOne({ where: { id } });

    if (!exam) {
      return res.status(404).json({
        message: "Đề thi không tồn tại!"
      });
    }
    const status = await db.Status.findOne({
      where: { name: "Rejected" }
    });

    if (!status) {
      return res.status(404).json({
        message: "Không tìm thấy trạng thái!"
      });
    }
    exam.status_id = status.id;

    await exam.save(); 
    return res.status(200).json({
      message: "Đã từ chối đề thi",
      data: exam
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

//lấy danh sách tất cả đề thi
const GetAllExams = async (req, res) => {
    try {
      const rejectStatus = await db.Status.findOne({
        where: { name: "Rejected" }
      });

      const exams = await db.Exam.findAll({
        where: {
          status_id: {
            [Op.ne]: rejectStatus.id
          }
        },
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
                model: db.Question,
                attributes: [
                    "id",
                    "content",
                    "content_img",
                    "option_a",
                    "option_b",
                    "option_c",
                    "option_d",
                    "correct_answer"
                ]
            }
        ],
        order: [["id", "DESC"]]
      });
      return res.json(
        {
          message: "Lấy danh sách đề thi thành công",
          data: exams
        }
      );
    } catch (err) {
        res.status(500).send(err.message);
    }
}

//lấy chi tiết đề thi theo id
const GetExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await db.Exam.findOne({
      where: { id },
      include: [
        {
          model: db.Question,
          attributes: [
            "id",
            "content",
            "content_img",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "correct_answer"
          ]
        }
      ]
    });

    if (!exam) {
      return res.status(404).json({
        message: "Đề thi không tồn tại"
      });
    }

    return res.status(200).json({
      message: "Lấy đề thi thành công",
      data: exam
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

//StartExam
const StartExam = async (req, res) => {
try {
    const { exam_id } = req.params;
    const user_id = req.user.id

    const exam = await db.Exam.findByPk(exam_id);

    if (!exam) {
      return res.status(404).json({
        message: "Đề thi không tồn tại!"
      });
    }

    if (existed) {
      return res.status(200).json({
        message: "Bạn đang làm bài này.",
        data: existed
       
      });
    }

    const started_at = new Date();

    const result = await db.Result.create({
      user_id,
      exam_id,
      total_score: 0,
      total_question: 0,
      started_at,
      submitted_at: null,
      duration: 0
    });

    return res.status(201).json({
      message: "Bắt đầu làm bài thành công",
      data: {
        result_id: result.id,
        started_at
      }
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

//SubmitExam
const SubmitExam = async (req, res) => {
try {

    const { exam_id } = req.params;
    const { answers } = req.body;
    const user_id = req.user.id;

    const exam = await db.Exam.findOne({
      where: {
        id: exam_id
      },
      include: [
        {
          model: db.Question,
          through: {
            attributes: []
          }
        }
      ]
    });

    if (!exam) {
      return res.status(404).json({
        message: "Đề thi không tồn tại!"
      });
    }

    // Lấy Result đã tạo khi StartExam
    const result = await db.Result.findOne({
      where: {
        result_id,
        user_id,
        exam_id
      }
    });

    if (!result) {
      return res.status(404).json({
        message: "Không tìm thấy phiên làm bài!"
      });
    }

    // Kiểm tra đã nộp chưa
    if (result.submitted_at) {
      return res.status(400).json({
        message: "Bài thi đã được nộp!"
      });
    }

    const submitted_at = new Date();

    // Tính thời gian làm bài (giây)
    const duration = Math.floor(
      (submitted_at - result.started_at) / 1000
    );

    let correct_count = 0;
    let wrong_count = 0;
    let null_count = 0;

    // Chấm từng câu
    for (const question of exam.Questions) {

      const answer = answers.find(
        a => a.question_id == question.id
      );

      let selected_answer = null;
      let is_correct = false;

      if (answer) {
        selected_answer = answer.selected_answer;

        if (selected_answer === question.correct_answer) {
          is_correct = true;
          correct_count++;
        } else {
          wrong_count++;
        }
      } else {
        null_count++;
      }

      await db.Resultdetail.create({
        result_id: result.id,
        question_id: question.id,
        selected_answer,
        is_correct
      });

    }

    const total_question = exam.Questions.length;

    // Thang điểm 10
    const total_score = Number(
      ((correct_count / total_question) * 10).toFixed(2)
    );

    // Cập nhật Result
    await result.update({
      total_question,
      total_score,
      submitted_at,
      duration
    });

    return res.status(200).json({
      message: "Nộp bài thành công",
      data: {
        result_id: result.id,
        total_question,
        correct_count,
        wrong_count,
        null_count,
        total_score,
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
    

module.exports = {
  GetPaged,
  CreateExam,
  UpdateExam,
  DeleteExam,
  ApproveExam,
  RejectExam,
  GetAllExams,
  GetExamById,
  DeleteQuestionByExam,
  StartExam,
  SubmitExam
};