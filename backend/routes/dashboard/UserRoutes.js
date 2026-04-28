const express = require("express");
// import { verifyToken } from "../../middleware/verifyToken.js";

const {
    GetPaged
    // updateUser,
    // deleteUser,
    // approveUser,
    // rejectUser,
    // getUserById
    // UserGetAllForum,
    // UserGetAllBook
} = require("../../controllers/UserController.js");

const router = express.Router();

router.get("/", GetPaged); // dashboard/user
// router.put("/update/:id", updateUser); // dashboard/user/update/:id/
// router.delete("/delete/:id", deleteUser); // dashboard/user/delete/:id
// router.post("/approve/:id", approveUser); // dashboard/user/approve/:id
// router.post("/reject/:id", rejectUser); // dashboard/user/reject/:id
// router.get("/:id", getUserById); // dashboard/user/:id

module.exports = router;