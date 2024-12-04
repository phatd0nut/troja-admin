const express = require('express');
const { adminLogin, registerAdmin, fetchData } = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', adminLogin);
router.post('/register', authenticateToken, registerAdmin); 
router.get('/fetch-data', authenticateToken, fetchData); 

module.exports = router;