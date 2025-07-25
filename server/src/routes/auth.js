// E-Commerce_Fashion-main/server/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Pastikan route ini ada dan benar
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/topup', authMiddleware, authController.topUpBalance);


module.exports = router;