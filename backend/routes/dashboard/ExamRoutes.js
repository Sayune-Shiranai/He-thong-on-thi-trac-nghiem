const express = require("express");
// import { verifyToken } from "../../middleware/verifyToken.js";

const { 
    GetPaged,
    CreateExam,
    UpdateExam,
    DeleteExam,
    ApproveExam,
    RejectExam,
    DeleteQuestionByExam,
    GetExamById
} = require("../../controllers/ExamController.js");

const router = express.Router();

router.get("/", GetPaged); // dashboard/exam
router.post("/create", CreateExam); // dashboard/exam/create
router.put("/update/:id", UpdateExam); // dashboard/exam/update/:id/
router.delete("/delete/:id", DeleteExam); // dashboard/exam/delete/:id
router.post("/approve/:id", ApproveExam); // dashboard/exam/approve/:id
router.post("/reject/:id", RejectExam); // dashboard/exam/reject/:id
router.get("/:id", GetExamById)
router.delete("/:exam_id/question/:question_id", DeleteQuestionByExam);


module.exports = router;