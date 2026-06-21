const express = require("express");

const { 
    GetPaged,
    GetAllGrades,
    CreateGrade,
    UpdateGrade,
    DeleteGrade,
    GetGradetById
} = require("../../controllers/GradeController.js");

const router = express.Router();

router.get("/", GetPaged);
router.get("/all", GetAllGrades);
router.post("/create", CreateGrade);
router.put("/update/:id", UpdateGrade);
router.delete("/delete/:id", DeleteGrade);
router.get("/:id", GetGradetById);

module.exports = router;