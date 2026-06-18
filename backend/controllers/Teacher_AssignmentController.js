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

    const whereUser = {
      role_id: TeacherRole.id
    };

    if (keyword) {
      whereUser.username = {
        [Op.like]: `%${keyword}%`
      };
    }

    const totalRecords = await db.Teacher_Assignment.count({
      include: [
        {
          model: db.User,
          where: whereUser
        }
      ]
    });

    const teacher_assignments = await db.Teacher_Assignment.findAll({
      include: [
        {
          model: db.User,
          where: whereUser,
          attributes: ["id", "username", "email"]
        },
        {
          model: db.Subject
        },
        {
          model: db.Grade
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
      data: teacher_assignments
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//create teacher_assignment
const CreateTeacherAssignment = async (req, res) => {
  try {
    let { user_id, grade_id, subject_id } = req.body;

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

    const checkGrade = await db.Grade.findOne({
      where: { id: grade_id }
    });

    if (!checkGrade) {
      return res.status(404).json({ message: "Không tìm thấy khối lớp!" });
    }

    const checkSubject = await db.Subject.findOne({
      where: { id: subject_id }
    });

    if (!checkSubject) {
      return res.status(404).json({ message: "Không tìm thấy môn học!" });
    }

    const existedAssignment = await db.Teacher_Assignment.findOne({
      where: {
        user_id,
        grade_id,
        subject_id
      }
    });

    if (existedAssignment) {
      return res.status(400).json({
        message: `Giáo viên đã được phân công môn ${checkSubject.name} này cho lớp ${checkGrade.grade} rồi!`
      });
    }

    const teacher_assignments = await db.Teacher_Assignment.create({
      user_id,
      grade_id,
      subject_id
    });
    
    return res.json({ message: "Phân công giáo viên đã được tạo thành công", data: teacher_assignments });
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

    const teacher_assignment = await db.Teacher_Assignment.findAll({
        where: { id }
    });

    if (!teacher_assignment || teacher_assignment.length === 0) {
        return res.status(404).json({ message: "Phân công giáo viên không tồn tại" });
    }

    await db.Teacher_Assignment.destroy({
        where: { id }
    });

    return res.json({ message: "Phân công giáo viên đã được xóa thành công" });
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