const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

//Router for user registration
router.post('/register', registerUser);

module.exports = router;