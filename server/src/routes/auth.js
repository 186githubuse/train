const express = require('express');

const {
  registerStudent,
  loginStudent,
  getCurrentStudent,
} = require('../controllers/studentAuthController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);
router.get('/me', requireAuth, getCurrentStudent);

module.exports = router;
