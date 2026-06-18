const express = require("express");

const { 
    GetPaged,
    GetAllGrades,
    CreateGrade,
    UpdateGrade,
    DeleteGrade
} = require("../../controllers/GradeController.js");

const router = express.Router();

router.get("/", GetPaged);
router.get("/all", GetAllGrades);
router.post("/create", CreateGrade);
router.post("/update/:id", UpdateGrade);
router.delete("/delete/:id", DeleteGrade);

module.exports = router;