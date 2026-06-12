const express = require("express");
const authentication = require("../../middlewares/Authentication");

const { 
    GetAllGrades,
    GetAllExamsByGrade,
    GetGradesByTeacherAssignment
} = require("../../controllers/GradeController.js");

const router = express.Router();
router.get("/mygrades", authentication, GetGradesByTeacherAssignment);
router.get("/", GetAllGrades);
router.get("/:id", GetAllExamsByGrade);


module.exports = router;