const express = require('express');
const router = express.Router();

const {
  GetPaged,
  SubmitExam,
  GetDetail,
  GetMyResults,
  DeleteResult
} = require('../controllers/ResultController');

router.get('/', GetPaged);

router.post('/submit', SubmitExam);

router.get('/detail/:id', GetDetail);

router.get('/my-results',Authentication, GetMyResults);

router.delete('/delete/:id', DeleteResult);

module.exports = router;