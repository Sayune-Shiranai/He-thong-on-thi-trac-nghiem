const express = require("express");

const { 
    GetPaged,
    CreateGrade,
    UpdateGrade,
    DeleteGrade
} = require("../../controllers/GradeController.js");

const router = express.Router();

router.get("/", GetPaged);
router.post("/create", CreateGrade);
router.post("/update/:id", UpdateGrade);
router.delete("/delete/:id", DeleteGrade);

module.exports = router;