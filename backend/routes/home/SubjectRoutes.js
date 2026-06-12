const express = require("express");
const authentication = require("../../middlewares/Authentication");

const { 
    GetAllSubjects,
    GetAllExamsBySubject,
    GetSubjectsByTeacherAssignment
} = require("../../controllers/SubjectController.js");

const router = express.Router();
router.get("/mysubjects", authentication, GetSubjectsByTeacherAssignment);
router.get("/", GetAllSubjects);
router.get("/:id", GetAllExamsBySubject);

module.exports = router;