const express = require("express");
// import { verifyToken } from "../../middleware/verifyToken.js";

const { 
    GetPaged,
    CreateExam,
    GetExamDetail
} = require("../../controllers/ExamController.js");

const router = express.Router();

router.get("/", GetPaged);
router.post("/create", CreateExam);
router.get("/:id", GetExamDetail);

module.exports = router;