const express = require("express");
const { 
    Register
} = require("../../controllers/RegisterController.js");

const router = express.Router();
router.post("/", Register);


module.exports = router;