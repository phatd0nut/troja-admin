const express = require('express');
const { adminLogin, registerAdmin,changeAdminDetails , fetchData } = require('../controllers/adminController');
const { sendMail } = require('../controllers/mailController');
const { fetchAllCustomers } = require('../controllers/customerController');
const { fetchAllEvents, fetchUpcomingEvents } = require('../controllers/eventController');
const { fetchAllGoods } = require('../controllers/goodsController');
const { fetchAllPurchases } = require('../controllers/purchaseController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', adminLogin);
router.post('/register', authenticateToken, registerAdmin);
router.put('/change-details', authenticateToken, changeAdminDetails); 
router.get('/fetch-data', authenticateToken, fetchData);
router.post('/send-email', authenticateToken, sendMail);
router.get('/customers', authenticateToken, fetchAllCustomers);
router.get('/events', authenticateToken, fetchAllEvents);
router.get('/goods', authenticateToken, fetchAllGoods);
router.get('/purchases', authenticateToken, fetchAllPurchases);
router.get('/upcoming-events', authenticateToken, fetchUpcomingEvents);


module.exports = router;