// E-Commerce_Fashion-main/server/src/controllers/productController.js
const knex = require('../../db/knex');
require('knex-paginate').attachPaginate();

// Mengambil semua produk dengan fungsionalitas pencarian dan paginasi
exports.getAllProducts = async (req, res) => {
    try {
        const { q, page = 1, perPage = 6 } = req.query;
        const queryBuilder = knex('products').select('*');
        if (q) {
            queryBuilder.where('name', 'like', `%${q}%`);
        }
        const products = await queryBuilder.paginate({
            perPage: parseInt(perPage),
            currentPage: parseInt(page),
            isLengthAware: true,
        });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products.', error });
    }
};

// Mengambil produk untuk halaman manajemen admin
exports.getMyProducts = async (req, res) => {
    // Pastikan hanya admin yang bisa mengakses
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak.' });
    }
    try {
        // Ambil semua produk tanpa pengurutan berdasarkan tanggal (karena kolom tidak ada)
        const products = await knex('products').select('*');
        res.json(products);
    } catch (error) {
        console.error("Error fetching admin products:", error);
        res.status(500).json({ message: 'Gagal mengambil produk Anda.', error });
    }
};

// Mengambil satu produk berdasarkan ID
exports.getProductById = async (req, res) => {
    try {
        const product = await knex('products').where({ id: req.params.id }).first();
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product.', error });
    }
};

// Membuat produk baru (hanya admin)
exports.createProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const user_id = req.user.id; 

    if (!name || !price || !stock || !imageUrl) {
        return res.status(400).json({ message: 'Silakan isi semua field yang wajib diisi dan unggah gambar.' });
    }

    try {
        const [productId] = await knex('products').insert({
            name,
            description,
            price,
            stock,
            imageUrl,
            user_id,
        });
        res.status(201).json({ id: productId, ...req.body, imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product.', error });
    }
};

// Mengupdate produk (hanya admin)
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    
    try {
        const updated = await knex('products')
            .where({ id })
            .update({ name, description, price, stock });
        
        if (!updated) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        res.json({ message: 'Produk berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui produk.', error });
    }
};

// Menghapus produk (hanya admin)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await knex('products').where({ id }).del();
        if (!deleted) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        res.json({ message: 'Produk berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus produk.', error });
    }
};