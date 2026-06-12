// const db = require('../models/index.js');

// const AddQuestionToExam = async (req, res) => {
//   try {
//     const {
//       exam_id,
//       question_id,
//       score,
//       sort_order
//     } = req.body;

//     const examQuestion = await db.ExamQuestion.create({
//       exam_id,
//       question_id,
//       score,
//       sort_order
//     });

//     return res.status(201).json({
//       message: "Thêm câu hỏi vào đề thành công",
//       data: examQuestion
//     });
//   } catch (err) {
//     return res.status(500).json({
//       error: err.message
//     });
//   }
// };

// module.exports = {
//   AddQuestionToExam
// };

// // const GetExamDetail = async (req, res) => {

// //   try {

// //     const exam = await db.Exam.findByPk(req.params.id, {

// //       include: [
// //         {
// //           model: db.Question,

// //           through: {
// //             attributes: ["score", "sort_order"]
// //           }
// //         }
// //       ]

// //     });

// //     return res.json(exam);

// //   } catch (err) {

// //     return res.status(500).json({
// //       error: err.message
// //     });

// //   }

// // };