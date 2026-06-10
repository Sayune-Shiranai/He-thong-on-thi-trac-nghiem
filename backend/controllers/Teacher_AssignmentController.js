const db = require('../models/index.js');
const { Op } = require('sequelize');

const GetPaged = async (req, res) => {
  try {
    let { page = 1, limit = 10, keyword = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const TeacherRole = await db.Role.findOne({
      where: { name: "Teacher" }
    });

    const where = {
      role_id: TeacherRole.id
    };

    if (keyword) {
      where.username = {
        [Op.like]: `%${keyword}%`
      };
    }

    const totalRecords = await db.User.count({ where });

    const teacher_assignments = await db.User.findAll({
      where,
      include: [
        {
          model: db.Teacher_Assignment,
          include: [
            {
              model: db.Subject
            },
            {
              model: db.Grade
            }
          ]
        },
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
      data: teacher_assignments
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//update teacher_assignment
const UpdateTeacherAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade_id, subject_id } = req.body;

    const teacher_assignment = await db.Teacher_Assignment.findOne({
      where: { id }
    });

    if (!teacher_assignment) {
      return res.status(404).json({ message: "Giáo viên không tồn tại" });
    }

    await teacher_assignment.update({
      grade_id,
      subject_id
    });

    return res.json({ message: "Giáo viên đã được cập nhật thành công" });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//delete teacher_assignment
const DeleteTeacherAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher_assignment = await db.Teacher_Assignment.findOne({
        where: { id }
    });

    if (!teacher_assignment) {
        return res.status(404).json({ message: "Giáo viên không tồn tại" });
    }

    await teacher_assignment.destroy();

    return res.json({ message: "Giáo viên đã được xóa thành công" });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = {
  GetPaged,
  UpdateTeacherAssignment,
  DeleteTeacherAssignment
}