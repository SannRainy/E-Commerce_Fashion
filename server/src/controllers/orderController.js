const knex = require('../../db/knex');

/**
 * Membuat pesanan baru dari item yang dikirim dari frontend.
 */
exports.createOrder = async (req, res) => {
  // Ambil item dan total harga dari body request, dan user_id dari middleware
  const { items, total_amount } = req.body;
  const { id: user_id } = req.user;

  // Validasi input
  if (!items || items.length === 0 || !total_amount) {
    return res.status(400).json({ message: 'Data pesanan tidak lengkap.' });
  }

  // Gunakan transaksi untuk memastikan semua query berhasil atau tidak sama sekali
  const trx = await knex.transaction();
  try {
    // 1. Masukkan data pesanan utama ke tabel 'orders'
    const [orderId] = await trx('orders').insert({
      user_id,
      total_amount,
      status: 'pending' // Status awal pesanan
    });

    // 2. Siapkan data item pesanan untuk dimasukkan ke tabel 'order_items'
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    // 3. Masukkan semua item pesanan ke tabel 'order_items'
    await trx('order_items').insert(orderItems);
    
    // 4. Kurangi stok untuk setiap produk yang dibeli
    for (const item of items) {
        await trx('products')
            .where('id', item.id)
            .decrement('stock', item.quantity);
    }

    // Jika semua berhasil, konfirmasi transaksi
    await trx.commit();
    res.status(201).json({ message: 'Pesanan berhasil dibuat.', orderId });

  } catch (error) {
    // Jika ada satu saja query yang gagal, batalkan semua transaksi
    await trx.rollback();
    console.error("Gagal membuat pesanan:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat membuat pesanan.', error });
  }
};

/**
 * Mengambil semua riwayat pesanan milik pengguna yang sedang login.
 */
exports.getUserOrders = async (req, res) => {
  const { id: user_id } = req.user;
  try {
    // Ambil semua pesanan berdasarkan user_id, urutkan dari yang terbaru
    const orders = await knex('orders')
      .where({ user_id })
      .orderBy('created_at', 'desc');

    res.json(orders);
  } catch (error) {
    console.error("Gagal mengambil riwayat pesanan:", error);
    res.status(500).json({ message: 'Gagal mengambil riwayat pesanan.', error });
  }
};

/**
 * (Opsional) Mengambil detail satu pesanan spesifik beserta item-itemnya.
 */
exports.getOrderDetails = async (req, res) => {
    const { orderId } = req.params;
    const { id: user_id } = req.user;

    try {
        // Ambil data pesanan
        const order = await knex('orders')
            .where({ id: orderId, user_id })
            .first();

        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau Anda tidak memiliki akses.' });
        }

        // Ambil item-item dari pesanan tersebut
        const items = await knex('order_items')
            .join('products', 'order_items.product_id', 'products.id')
            .where({ order_id: orderId })
            .select(
                'products.name',
                'products.imageUrl',
                'order_items.quantity',
                'order_items.price'
            );

        res.json({ ...order, items });
    } catch (error) {
        console.error("Gagal mengambil detail pesanan:", error);
        res.status(500).json({ message: 'Gagal mengambil detail pesanan.', error });
    }
};