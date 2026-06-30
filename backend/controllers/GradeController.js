const db = require('../models/index.js');
const { Op } = require('sequelize');

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
                { grade: { [Op.like]: `%${keyword}%` } }
                ]
            };
        }

        const totalRecords = await db.Grade.count({ where });

        const grades = await db.Grade.findAll({
            where,
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
            data: grades
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Tạo khối mới
const CreateGrade = async (req, res) => {
    try {
        const { grade } = req.body;
        if (!grade) {
            return res.status(400).json({ message: "Vui lòng nhập khối!" });
        }

        const newGrade = await db.Grade.create({ grade });
        return res.status(201).json(newGrade);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Cập nhật khối
const UpdateGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const { grade } = req.body;
        if (!grade) {
            return res.status(400).json({ message: "Vui lòng nhập khối!" });
        }

        const CheckGrade = await db.Grade.findOne(
            { where: { id } }
        );

        if (!CheckGrade) {
            return res.status(404).json({ message: "Khối không tồn tại!" });
        }

        await CheckGrade.update({ grade });
        return res.json(CheckGrade);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Xóa khối
const DeleteGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const CheckGrade = await db.Grade.findOne(
            { where: { id } }
        );
        if (!CheckGrade) {
            return res.status(404).json({ message: "Khối không tồn tại!" });
        }
        await CheckGrade.destroy();
        return res.json({ message: "Khối đã được xóa!" });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Lấy tất cả khối
const GetAllGrades = async (req, res) => {
    try {
        const grades = await db.Grade.findAll();
        return res.json({ 
            success: true, 
            data: grades 
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Lấy tất cả đề thi theo khối
const GetAllExamsByGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const exams = await db.Exam.findAll({
            where: { 
                grade_id: id 
            },
            order: [["id", "DESC"]]
        });
        return res.json({ 
            success: true, 
            data: exams 
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const GetGradesByTeacherAssignment = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Chưa đăng nhập!"
      });
    }

    const teacherAssignments = await db.Teacher_Assignment.findAll({
      where: {
        user_id: req.user.id
      },
      include: [
        {
          model: db.Grade,
          attributes: ["id", "grade"]
        }
      ]
    });

    const grades = [
      ...new Map(
        teacherAssignments.map(item => [
          item.Grade.id,
          item.Grade
        ])
      ).values()
    ];

    return res.json({
      success: true,
      data: grades
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const GetGradetById = async (req, res) => {
  try {
    const { id } = req.params;
    const grade = await db.Grade.findOne({
      where: { id }
    });
    if (!grade) return res.status(404).json({ success: false, message: 'Không tìm thấy khối!' });

    res.json({ 
      success: true, 
      data: grade 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
    GetPaged,
    CreateGrade,
    UpdateGrade,
    DeleteGrade,
    GetAllGrades,
    GetAllExamsByGrade,
    GetGradesByTeacherAssignment,
    GetGradetById
}
