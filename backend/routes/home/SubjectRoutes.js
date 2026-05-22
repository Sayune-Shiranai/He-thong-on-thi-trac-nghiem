const express = require("express");

const { 
    GetAllSubjects,
    GetAllExamsBySubject
} = require("../../controllers/SubjectController.js");

const router = express.Router();
router.get("/", GetAllSubjects);
router.get("/:id", GetAllExamsBySubject);

module.exports = router;