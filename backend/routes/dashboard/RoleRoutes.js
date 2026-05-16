const express = require("express");
// import { verifyToken } from "../../middleware/verifyToken.js";

const { 
    GetPaged,
    CreateRole,
    UpdateRole,
    DeleteRole
} = require("../../controllers/RoleController.js");

const router = express.Router();

router.get("/", GetPaged);
router.post("/create", CreateRole);
router.post("/update/:id", UpdateRole);
router.delete("/delete/:id", DeleteRole);

module.exports = router;