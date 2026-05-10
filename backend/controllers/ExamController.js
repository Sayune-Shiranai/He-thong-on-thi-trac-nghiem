const db = require('../models/index.js');

const CreateExam = async (req, res) => {

  try {

    const {
      title,
      description,
      duration
    } = req.body;

    const exam = await db.Exam.create({

      title,
      description,
      duration

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