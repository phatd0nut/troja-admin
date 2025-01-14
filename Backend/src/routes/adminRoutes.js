/**
 * file: adminRoutes.js
 * description: admin routes
 */

const express = require('express');
const { 
    adminLogin, 
    registerAdmin, 
    changeAdminDetails, 
    fetchData, 
    triggerFetchData 
} = require('../controllers/adminController');
const { sendMail } = require('../controllers/mailController');
const { 
    fetchAllCustomers, 
    fetchCustomersGroupedByGoods, 
    fetchCustomersLastMonth, 
    fetchCustomersLastYear 
} = require('../controllers/customerController');
const { 
    fetchAllEvents, 
    fetchUpcomingEvents 
} = require('../controllers/eventController');
const { fetchAllGoods } = require('../controllers/goodsController');
const { 
    fetchAllPurchases, 
    fetchCustomerPurchaseCounts, 
    fetchRecentPurchases, 
    fetchRecentPurchasesWithDetails, 
    fetchTotalRevenueByRecentEvents 
} = require('../controllers/purchaseController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Admin Authentication Routes
router.post('/login', adminLogin);
router.post('/register', authenticateToken, registerAdmin);
router.put('/change-details', authenticateToken, changeAdminDetails); 

// Data Fetching Routes
router.get('/fetch-data', authenticateToken, fetchData);
router.post('/trigger-fetch', authenticateToken, triggerFetchData);

// Email Routes
router.post('/send-email', authenticateToken, sendMail);

// Customer Routes
router.get('/customers', authenticateToken, fetchAllCustomers);
router.get('/customers/grouped-by-goods', authenticateToken, fetchCustomersGroupedByGoods);
router.get('/customer/:userRefNo/recent-purchases', authenticateToken, fetchRecentPurchases);
router.get('/customers/last-month', authenticateToken, fetchCustomersLastMonth);
router.get('/customers/last-year', authenticateToken, fetchCustomersLastYear);

// Event Routes
router.get('/events', authenticateToken, fetchAllEvents);
router.get('/upcoming-events', authenticateToken, fetchUpcomingEvents);

// Goods Routes
router.get('/goods', authenticateToken, fetchAllGoods);

// Purchase Routes
router.get('/purchases', authenticateToken, fetchAllPurchases);
router.get('/purchases/recent-with-details', authenticateToken, fetchRecentPurchasesWithDetails);
router.get('/customer-purchase-counts', authenticateToken, fetchCustomerPurchaseCounts);
router.get('/purchases/total-revenue-by-recent-events', authenticateToken, fetchTotalRevenueByRecentEvents);

//exporterar router för att kunna använda det i app.js
module.exports = router;