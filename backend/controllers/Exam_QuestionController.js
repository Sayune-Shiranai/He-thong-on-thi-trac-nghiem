// const db = require("../models");

// const CreateExam = async (req, res) => {

//   const transaction = await db.sequelize.transaction();

//   try {

//     const {
//       title,
//       description,
//       duration,
//       questions
//     } = req.body;

//     // tạo đề
//     const exam = await db.Exam.create({

//       title,
//       description,
//       duration

//     }, { transaction });

//     // duyệt từng câu hỏi
//     for (let i = 0; i < questions.length; i++) {

//       const item = questions[i];

//       // tạo question
//       const question = await db.Question.create({

//         content: item.content,

//         option_a: item.option_a,

//         option_b: item.option_b,

//         option_c: item.option_c,

//         option_d: item.option_d,

//         correct_answer: item.correct_answer

//       }, { transaction });

//       // tạo exam_question
//       await db.ExamQuestion.create({

//         exam_id: exam.id,

//         question_id: question.id,

//         score: item.score || 1,

//         sort_order: i + 1

//       }, { transaction });

//     }

//     await transaction.commit();

//     return res.status(201).json({

//       message: "Tạo đề thành công",

//       exam_id: exam.id

//     });

//   } catch (err) {

//     await transaction.rollback();

//     return res.status(500).json({
//       error: err.message
//     });

//   }

// };

// module.exports = {
//   CreateExam
// };

// const GetExamDetail = async (req, res) => {

//   try {

//     const exam = await db.Exam.findByPk(req.params.id, {

//       include: [
//         {
//           model: db.Question,

//           through: {
//             attributes: ["score", "sort_order"]
//           }
//         }
//       ]

//     });

//     return res.json(exam);

//   } catch (err) {

//     return res.status(500).json({
//       error: err.message
//     });

//   }

// };