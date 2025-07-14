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

// Rute publik
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rute yang dilindungi: hanya admin yang bisa membuat, mengubah, dan menghapus produk
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;