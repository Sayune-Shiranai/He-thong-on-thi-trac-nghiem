// sửa file này phải ib
const express = require('express');
// import connectDB from "./db/db.js";
const dotenv = require('dotenv');
// import db from "./models/index.js";
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173", // hoặc "http://localhost:5173"
  credentials: true,
}));
app.use(
  "/media",
  express.static(path.join(process.cwd(), "media"))
);

const db = require('./models');

//dashboard routes
const roleRoutes = require("./routes/dashboard/RoleRoutes");
const userRoutes = require("./routes/dashboard/UserRoutes");
const gradeRoutes = require("./routes/dashboard/GradeRoutes");
const subjectRoutes = require("./routes/dashboard/SubjectRoutes");
const examRoutes = require("./routes/dashboard/ExamRoutes");
const questionRoutes = require("./routes/dashboard/QuestionRoutes");
// const exam_questionRoutes = require("./routes/dashboard/Exam_QuestionRoutes");



//home routes
const ExamRoutes = require("./routes/home/ExamRoutes");
const QuestionRoutes = require("./routes/home/QuestionRoutes");
const Exam_QuestionRoutes = require("./routes/home/Exam_QuestionRoutes");
// const ExamResultRoutes = require("./routes/home/ExamResultRoutes");

//auth routes
const RegisterRoutes = require("./routes/home/RegisterRoutes");
const LoginRoutes = require("./routes/home/LoginRoutes");
const LogoutRoutes = require("./routes/home/LogoutRoutes");

//dashboard 
app.use("/dashboard/role", roleRoutes); // /dashboard/role
app.use("/dashboard/user", userRoutes) // /dashboard/user
app.use("/dashboard/grade", gradeRoutes) // /dashboard/grade
app.use("/dashboard/subject", subjectRoutes) // /dashboard/subject
app.use("/dashboard/exam", examRoutes) // /dashboard/exam
app.use("/dashboard/question", questionRoutes) // /dashboard/question
// app.use("/dashboard/exam_question", exam_questionRoutes) // /dashboard/exam_question

//home
app.use("/exam", ExamRoutes) // /dashboard/exam
app.use("/question", QuestionRoutes) // /dashboard/question
app.use("/exam_question", Exam_QuestionRoutes) // /dashboard/exam_question

//auth
app.use("/register", RegisterRoutes); // /register
app.use("/login", LoginRoutes); // /login
app.use("/logout", LogoutRoutes); // /logout

app.get('/HelloWorld', (req, res) => {
  res.send('Hello World!')
})

app.get("/connectDB", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ success: true, message: "Kết nối thành công với SQL Server!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Kết nối thất bại", error: err.message });
  }
});

// app.get("/syncDB", async (req, res) => {
//   try {
//     await db.sequelize.sync({ alter: true });
//     res.json({ success: true, message: "Đồng bộ database thành công!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Đồng bộ database thất bại", error: err.message });
//   }
// });

app.listen(5000, () => {
  console.log(`Server chạy tại http://localhost:5000`);
});