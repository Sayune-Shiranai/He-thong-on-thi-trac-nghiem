const express = require("express");

const { 
    GetPaged,
    GetAllSubjects,
    CreateSubject,
    UpdateSubject,
    DeleteSubject
} = require("../../controllers/SubjectController.js");

const router = express.Router();

router.get("/", GetPaged);
router.get("/all", GetAllSubjects);
router.post("/create", CreateSubject);
router.post("/update/:id", UpdateSubject);
router.delete("/delete/:id", DeleteSubject);

module.exports = router;