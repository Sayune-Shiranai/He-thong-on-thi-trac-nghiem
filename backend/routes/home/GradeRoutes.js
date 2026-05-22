const express = require("express");

const { 
    GetAllGrades,
    GetAllExamsByGrade,
} = require("../../controllers/GradeController.js");

const router = express.Router();

router.get("/", GetAllGrades);
router.get("/:id", GetAllExamsByGrade);

module.exports = router;