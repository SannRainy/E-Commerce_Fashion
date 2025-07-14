const knex = require('../../db/knex');

// Mendapatkan semua item di keranjang pengguna
exports.getCartItems = async (req, res) => {
    const { id: user_id } = req.user;
    try {
        const cartItems = await knex('cart_items')
            .join('products', 'cart_items.product_id', 'products.id')
            .where('cart_items.user_id', user_id)
            .select(
                'products.id',
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