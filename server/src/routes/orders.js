// E-Commerce_Fashion-main/server/src/routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { adminMiddleware } = require('../middleware/authMiddleware');

// authMiddleware sudah diterapkan di app.js, jadi tidak perlu di sini lagi

// Rute khusus Admin (HARUS DI ATAS RUTE DINAMIS)
router.get('/admin/dashboard', adminMiddleware, orderController.getAdminDashboardData);
router.get('/all/list', adminMiddleware, orderController.getAllCustomerOrders);
router.put('/:orderId/status', adminMiddleware, orderController.updateOrderStatus);

// Rute untuk pengguna (bisa admin juga)
router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:orderId', orderController.getOrderDetails);

module.exports = router;