const db = require('../models/index.js');
const { Op } = require("sequelize");

//lấy danh sách đề thi theo phân trang
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
                { title: { [Op.like]: `%${keyword}%` } }
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
        res.status(500).send(err.message);
    }
}

//tạo đề thi
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
        message: "Vui lòng chọn lớp!"
      });
    }

    const grade = await db.Grade.findOne({ where: { id: grade_id } });

    if (!grade) {
      return res.status(404).json({
        message: "Lớp không tồn tại!"
      });
    }

    if (!subject_id) {
      return res.status(400).json({
        field: "subject_id",
        message: "Vui lòng chọn môn học!"
      });
    }

    const subject = await db.Subject.findOne({ where: { id: subject_id } });

    if (!subject) {
      return res.status(404).json({
        message: "Môn học không tồn tại!"
      });

    }

    const exam = await db.Exam.create({
      title,
      grade_id,
      subject_id,
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

//lấy danh sách tất cả đề thi
const GetAllExams = async (req, res) => {
    try {
        const exams = await db.Exam.findAll({
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
        return res.json(exams);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

//lấy chi tiết đề thi theo id
const GetExamDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await db.Exam.findOne({
      where: { id },
      include: [
        {
          model: db.Question,
          through: {
            attributes: []
          },
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

//lấy danh sách đề thi theo lớp
// const GetAllExamByGrade = async (req, res) => {
//   try {
//     const { grade_id } = req.params;
//     const exams = await db.Exam.findAll({
//       where: { grade_id },
//       include: [
//         {
//           model: db.Grade,
//           attributes: ["id", "grade"]
//         },
//         {
//           model: db.Subject,
//           attributes: ["id", "name"]
//         },
//         {
//           model: db.User,
//           attributes: ["id", "username"]
//         },
//         {
//           model: db.Question,
//           attributes: [
//             "id",
//             "content",
//             "content_img",
//             "correct_answer"
//           ]
//         }
//       ],
//       order: [["id", "DESC"]]
//     });
//     return res.json(exams);
//   } catch (err) {
//     return res.status(500).json({
//       error: err.message
//     });
//   }
// };
    

module.exports = {
  GetPaged,
  CreateExam,
  GetAllExams,
  GetExamDetail,
  // GetAllExamByGrade
};