const express = require('express');
const { adminLogin, registerAdmin,changeAdminDetails , fetchData, triggerFetchData } = require('../controllers/adminController');
const { sendMail } = require('../controllers/mailController');
const { fetchAllCustomers, fetchCustomersGroupedByGoods, fetchCustomersLastMonth, fetchCustomersLastYear } = require('../controllers/customerController');
const { fetchAllEvents, fetchUpcomingEvents } = require('../controllers/eventController');
const { fetchAllGoods } = require('../controllers/goodsController');
const { fetchAllPurchases, fetchCustomerPurchaseCounts, fetchRecentPurchases, fetchRecentPurchasesWithDetails } = require('../controllers/purchaseController');

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
router.get('/customer-purchase-counts', authenticateToken, fetchCustomerPurchaseCounts);
router.get('/customers/grouped-by-goods', authenticateToken, fetchCustomersGroupedByGoods);
router.get('/customer/:userRefNo/recent-purchases', authenticateToken, fetchRecentPurchases);
router.post('/trigger-fetch', authenticateToken, triggerFetchData);
router.get('/customers/last-month', fetchCustomersLastMonth);
router.get('/customers/last-year', fetchCustomersLastYear);
router.get('/purchases/recent-with-details', authenticateToken, fetchRecentPurchasesWithDetails);

module.exports = router;