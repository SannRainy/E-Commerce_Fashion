// E-Commerce_Fashion-main/server/src/controllers/cartController.js
const knex = require('../../db/knex');

// Mendapatkan semua item di keranjang pengguna
exports.getCartItems = async (req, res) => {
    const { id: user_id } = req.user;
    try {
        // Modifikasi query untuk mendapatkan detail produk yang lebih lengkap
        const cartItems = await knex('cart_items')
            .join('products', 'cart_items.product_id', 'products.id')
            .where('cart_items.user_id', user_id)
            .select(
                'cart_items.id as cart_item_id', // ID unik untuk item di keranjang
                'products.id as product_id',
                'products.name',
                'products.price',
                'products.imageUrl',
                'cart_items.quantity'
            );
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil item keranjang.', error });
    }
};

// Menambahkan item ke keranjang
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const { id: user_id } = req.user;

    try {
        const existingItem = await knex('cart_items')
            .where({ user_id, product_id: productId })
            .first();

        if (existingItem) {
            // Jika item sudah ada, update kuantitasnya
            await knex('cart_items')
                .where({ user_id, product_id: productId })
                .increment('quantity', quantity);
        } else {
            // Jika item belum ada, tambahkan item baru
            await knex('cart_items').insert({
                user_id,
                product_id: productId,
                quantity,
            });
        }
        res.status(200).json({ message: 'Item berhasil ditambahkan ke keranjang.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan item ke keranjang.', error });
    }
};

// FUNGSI BARU - Mengupdate kuantitas item
exports.updateCartItem = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const { id: user_id } = req.user;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Kuantitas tidak valid.' });
    }

    try {
        const updated = await knex('cart_items')
            .where({ user_id, product_id: productId })
            .update({ quantity });

        if (!updated) {
            return res.status(404).json({ message: 'Item tidak ditemukan di keranjang.' });
        }
        res.status(200).json({ message: 'Kuantitas item berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui kuantitas item.', error });
    }
};


// Menghapus item dari keranjang
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const { id: user_id } = req.user;

    try {
        await knex('cart_items')
            .where({ user_id, product_id: productId })
            .del();
        res.status(200).json({ message: 'Item berhasil dihapus dari keranjang.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus item.', error });
    }
};

// Mengosongkan semua keranjang
exports.clearCart = async (req, res) => {
    const { id: user_id } = req.user;
    try {
        await knex('cart_items').where({ user_id }).del();
        res.status(200).json({ message: 'Keranjang berhasil dikosongkan.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengosongkan keranjang.', error });
    }
};