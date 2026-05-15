const db = require('../models/index.js');

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

    // if (!user_id) {
    //   return res.status(400).json({
    //     field: "user_id",
    //     message: "Thiếu user tạo đề!"
    //   });
    // }

    // const user = await db.User.findOne({ where: { id: user_id } });

    // if (!user) {
    //   return res.status(404).json({
    //     message: "User không tồn tại!"
    //   });
    // }

    // tạo đề
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

module.exports = {
  CreateExam
};