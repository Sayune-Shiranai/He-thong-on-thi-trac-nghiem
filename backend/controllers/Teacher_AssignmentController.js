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

//create teacher_assignment
const CreateTeacherAssignment = async (req, res) => {
  try {
    let { user_id, grade_ids, subject_ids } = req.body;

    const teacher = await db.User.findOne({
      where: { id: user_id },
      include: [
        {
          model: db.Role
        }
      ]
    });

    if (!teacher) {
      return res.status(404).json({ message: "Không tìm thấy giáo viên!" });
    }

    if (teacher.Role?.name !== "Teacher") {
      return res.status(400).json({ message: "Người dùng không phải là giáo viên" });
    }

    grade_ids = JSON.parse(grade_ids);
    subject_ids = JSON.parse(subject_ids);

    const teacher_assignments = [];

    for (const grade_id of grade_ids) {
      for (const subject_id of subject_ids) {
        teacher_assignments.push({
          user_id,
          grade_id,
          subject_id
        });
      }
    }

    await db.Teacher_Assignment.bulkCreate(teacher_assignments);
    
    return res.json({ message: "Giáo viên đã được tạo thành công", data: teacher_assignments });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//update teacher_assignment (chưa hoàn thiện)
const UpdateTeacherAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade_ids, subject_ids } = req.body;

    const teacher_assignment = await db.Teacher_Assignment.findOne({
      where: { id }
    });

    if (!teacher_assignment) {
      return res.status(404).json({
        message: "Không tìm thấy giáo viên!"
      });
    }

    const user_id = teacher_assignment.user_id;

    await db.Teacher_Assignment.destroy({
      where: { user_id }
    });

    const teacher_assignments = [];

    for (const grade_id of grade_ids) {
      for (const subject_id of subject_ids) {
        teacher_assignments.push({
          user_id,
          grade_id,
          subject_id
        });
      }
    }

    await db.Teacher_Assignment.bulkCreate(teacher_assignments);

    return res.json({
      message: "Cập nhật phân công thành công!"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

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
  CreateTeacherAssignment,
  UpdateTeacherAssignment,
  DeleteTeacherAssignment
}