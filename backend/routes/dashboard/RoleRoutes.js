const express = require("express");
// import { verifyToken } from "../../middleware/verifyToken.js";

const { 
    GetPaged,
    CreateRole,
    UpdateRole,
    DeleteRole,
    GetAllRoles
} = require("../../controllers/RoleController.js");

const router = express.Router();

router.get("/", GetPaged);
router.get("/all", GetAllRoles);
router.post("/create", CreateRole);
router.post("/update/:id", UpdateRole);
router.delete("/delete/:id", DeleteRole);

module.exports = router;