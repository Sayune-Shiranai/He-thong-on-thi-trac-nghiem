const express = require("express");
// import { verifyToken } from "../../middleware/verifyToken.js";

const {
    GetPaged,
    UpdateUser,
    DeleteUser,
    ApproveUser,
    RejectUser,
    GetUserById,
    GetAllUserRoleTeacher
} = require("../../controllers/UserController.js");

const router = express.Router();

router.get("/", GetPaged); // dashboard/user
router.put("/update/:id", UpdateUser); // dashboard/user/update/:id/
router.delete("/delete/:id", DeleteUser); // dashboard/user/delete/:id
router.post("/approve/:id", ApproveUser); // dashboard/user/approve/:id
router.post("/reject/:id", RejectUser); // dashboard/user/reject/:id
router.get("/teacher", GetAllUserRoleTeacher); // dashboard/user/teacher
router.get("/:id", GetUserById); // dashboard/user/:id

module.exports = router;