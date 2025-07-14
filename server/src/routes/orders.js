// E-Commerce_Fashion-main/server/src/routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Rute untuk pengguna biasa (customer)
router.post('/', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/:orderId', authMiddleware, orderController.getOrderDetails);

// Rute khusus Admin
router.get('/all/list', authMiddleware, adminMiddleware, orderController.getAllCustomerOrders);
router.put('/:orderId/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;