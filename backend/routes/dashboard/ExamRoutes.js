const express = require("express");
// import { verifyToken } from "../../middleware/verifyToken.js";

const { 
    GetPaged,
    CreateExam,
} = require("../../controllers/ExamController.js");

const router = express.Router();

router.get("/", GetPaged);
router.post("/create", CreateExam);

module.exports = router;