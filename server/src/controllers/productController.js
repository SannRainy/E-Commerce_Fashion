const knex = require('../../db/knex');

// Mengambil semua produk
exports.getAllProducts = async (req, res) => {
    try {
        const products = await knex('products').select('*');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products.', error });
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
        });

        res.status(201).json({ id: productId, ...req.body, imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product.', error });
    }
};

// === FUNGSI YANG HILANG ADA DI BAWAH INI ===

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