const express = require("express");

const { 
    GetPaged,
    GetAllSubjects,
    CreateSubject,
    UpdateSubject,
    DeleteSubject,
    GetSubjectById
} = require("../../controllers/SubjectController.js");

const router = express.Router();

router.get("/", GetPaged);
router.get("/all", GetAllSubjects);
router.post("/create", CreateSubject);
router.put("/update/:id", UpdateSubject);
router.delete("/delete/:id", DeleteSubject);
router.get("/:id", GetSubjectById);

module.exports = router;