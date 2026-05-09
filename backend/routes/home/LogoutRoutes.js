const express = require("express");
const { 
    Logout
} = require("../../controllers/LogoutController.js");

const router = express.Router();
router.post("/", Logout);


module.exports = router;