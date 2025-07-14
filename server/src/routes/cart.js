// E-Commerce_Fashion-main/server/src/routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Semua rute di sini sudah dilindungi oleh authMiddleware dari app.js

router.get('/', cartController.getCartItems);
router.post('/', cartController.addToCart);
router.put('/:productId', cartController.updateCartItem); // Route baru
router.delete('/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;