const db = require('../models/index.js');
const { Op } = require("sequelize");

//lấy danh sách đề thi theo phân trang
const GetPaged = async (req, res) => {
  try {
      let { page = 1, limit = 10, keyword = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

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

      const offset = (page - 1) * limit;

      let where = {};

      if (keyword) {
          where = {
              [Op.or]: [
              { title: { [Op.like]: `%${keyword}%` } },
              { grade_id: { [Op.in]: grades } },
              { subject_id: { [Op.in]: subjects } },
              ]
          };
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
    

module.exports = {
  GetPaged,
  CreateExam,
  UpdateExam,
  DeleteExam,
  ApproveExam,
  RejectExam,
  GetAllExams,
  GetExamById,
  DeleteQuestionByExam
};