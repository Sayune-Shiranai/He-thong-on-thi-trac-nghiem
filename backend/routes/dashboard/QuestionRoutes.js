const express = require("express");
const upload = require("../../middlewares/Upload");
const {
  GetPaged
} = require("../../controllers/QuestionController");

const router = express.Router();
router.post("/paged", GetPaged);

module.exports = router;