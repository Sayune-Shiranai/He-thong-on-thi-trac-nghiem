const express = require("express");
// import { verifyToken } from "../../middleware/verifyToken.js";

const {
    GetPaged,
    UpdateTeacherAssignment,
    DeleteTeacherAssignment,
    // UserGetAllForum,
    // UserGetAllBook
} = require("../../controllers/Teacher_AssignmentController.js");

const router = express.Router();

router.get("/", GetPaged); // dashboard/teacher-assignment
router.put("/update/:id", UpdateTeacherAssignment); // dashboard/teacher-assignment/update/:id
router.delete("/delete/:id", DeleteTeacherAssignment); // dashboard/teacher-assignment/delete/:id

module.exports = router;