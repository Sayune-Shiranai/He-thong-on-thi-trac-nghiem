const express = require('express');
const Authentication = require("../../middlewares/Authentication");

const {
  GetProfile,
  ChangePassword
} = require('../../controllers/ProfileController');

const router = express.Router();
router.get('/', Authentication, GetProfile);
router.put('/change-password', Authentication, ChangePassword);

module.exports = router;