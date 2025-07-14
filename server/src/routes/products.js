// E-Commerce_Fashion-main/server/src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Path ini mengarahkan ke folder public/uploads di sisi client
    const uploadPath = path.join(__dirname, '../../../client/public/uploads');
    
    // Buat direktori jika belum ada
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Membuat nama file yang unik untuk menghindari konflik
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

router.get('/', productController.getAllProducts);
router.get('/my-products', authMiddleware, productController.getMyProducts); // Ini bisa kita hapus/ubah nanti jika hanya admin yang punya produk
router.get('/:id', productController.getProductById);

// Rute yang dilindungi: HANYA ADMIN yang bisa membuat produk baru
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), productController.createProduct);

// Hanya admin yang bisa mengubah dan menghapus produk
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;