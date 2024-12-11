const express = require('express');
const { adminLogin, registerAdmin, fetchData } = require('../controllers/adminController');
const { sendMail } = require('../controllers/mailController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', adminLogin);
router.post('/register', authenticateToken, registerAdmin); 
router.get('/fetch-data', authenticateToken, fetchData);
router.post('/send-email', authenticateToken, sendMail);

module.exports = router;