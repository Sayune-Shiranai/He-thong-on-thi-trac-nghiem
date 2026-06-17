const express = require("express");
// import { verifyToken } from "../../middleware/verifyToken.js";

const {
    GetPaged,
    CreateTeacherAssignment,
    UpdateTeacherAssignment,
    DeleteTeacherAssignment,
    // UserGetAllForum,
    // UserGetAllBook
} = require("../../controllers/Teacher_AssignmentController.js");

const router = express.Router();

router.get("/", GetPaged); // dashboard/teacher
router.post("/create", CreateTeacherAssignment); // dashboard/teacher/create
router.put("/update/:id", UpdateTeacherAssignment); // dashboard/teacher/update/:id
router.delete("/delete/:id", DeleteTeacherAssignment); // dashboard/teacher/delete/:id

module.exports = router;