const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Karena authMiddleware sudah diterapkan di app.js untuk '/api/orders',
// semua rute di sini secara otomatis akan terlindungi.

// Membuat pesanan baru
router.post('/', orderController.createOrder);

// Mendapatkan riwayat pesanan pengguna yang sedang login
router.get('/', orderController.getUserOrders);

module.exports = router;