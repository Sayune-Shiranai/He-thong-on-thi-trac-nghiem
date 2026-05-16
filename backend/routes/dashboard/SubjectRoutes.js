const express = require("express");

const { 
    GetPaged,
    CreateSubject,
    UpdateSubject,
    DeleteSubject
} = require("../../controllers/SubjectController.js");

const router = express.Router();

router.get("/", GetPaged);
router.post("/create", CreateSubject);
router.post("/update/:id", UpdateSubject);
router.delete("/delete/:id", DeleteSubject);

module.exports = router;