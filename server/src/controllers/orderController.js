// E-Commerce_Fashion-main/server/src/controllers/orderController.js
const knex = require('../../db/knex');

/**
 * Membuat pesanan baru dari item yang dikirim dari frontend.
 */
exports.createOrder = async (req, res) => {
  const { items, total_amount } = req.body;
  const { id: user_id } = req.user;

  if (!items || items.length === 0 || !total_amount) {
    return res.status(400).json({ message: 'Data pesanan tidak lengkap.' });
  }

  const trx = await knex.transaction();
  try {
    // 1. Ambil data pengguna, termasuk saldo, dan kunci barisnya untuk transaksi
    const user = await trx('users').where('id', user_id).forUpdate().first();

    // 2. Cek apakah saldo mencukupi
    if (user.balance < total_amount) {
      await trx.rollback();
      return res.status(400).json({ message: 'Saldo tidak mencukupi.' });
    }

    // 3. Kurangi saldo pengguna
    const newBalance = user.balance - total_amount;
    await trx('users').where('id', user_id).update({ balance: newBalance });

    // 4. Masukkan data pesanan utama ke tabel 'orders'
    const [orderId] = await trx('orders').insert({
      user_id,
      total_amount,
      status: 'pending' // Status awal tetap 'pending' menunggu accept dari admin
    });

    // 5. Siapkan & masukkan data item pesanan
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));
    await trx('order_items').insert(orderItems);
    
    // 6. Kurangi stok produk
    for (const item of items) {
        await trx('products')
            .where('id', item.id)
            .decrement('stock', item.quantity);
    }

    await trx.commit();
    res.status(201).json({ message: 'Pembayaran berhasil, pesanan sedang diproses.', orderId });

  } catch (error) {
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
 * Mengambil detail satu pesanan spesifik beserta item-itemnya.
 */
exports.getOrderDetails = async (req, res) => {
    const { orderId } = req.params;
    const { id: user_id } = req.user;

    try {
        const order = await knex('orders')
            .where({ id: orderId, user_id })
            .first();

        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau Anda tidak memiliki akses.' });
        }

        const items = await knex('order_items')
            .join('products', 'order_items.product_id', 'products.id')
            .where({ order_id: orderId })
            .select(
                'products.id as product_id',
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

exports.getAllCustomerOrders = async (req, res) => {
    try {
        const orders = await knex('orders')
            .join('users', 'orders.user_id', 'users.id')
            .select(
                'orders.id',
                'orders.total_amount',
                'orders.status',
                'orders.created_at',
                'users.name as customer_name',
                'users.email as customer_email'
            )
            .orderBy('orders.created_at', 'desc');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil semua pesanan.', error });
    }
};

// FUNGSI BARU: Mengubah status pesanan
exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status tidak boleh kosong.' });
    }

    try {
        const updated = await knex('orders')
            .where({ id: orderId })
            .update({ status: status });
        
        if (!updated) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
        }
        res.json({ message: `Status pesanan berhasil diubah menjadi ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengubah status pesanan.', error });
    }
};

exports.getAdminDashboardData = async (req, res) => {
    try {
        // Hitung total pendapatan dari pesanan yang sudah diterima
        const revenueResult = await knex('orders')
            .where('status', 'accepted')
            .sum('total_amount as totalRevenue')
            .first();

        // Hitung jumlah pesanan yang masih pending
        const pendingOrdersCount = await knex('orders')
            .where('status', 'pending')
            .count('id as count')
            .first();

        const dashboardData = {
            totalRevenue: revenueResult.totalRevenue || 0,
            pendingOrders: pendingOrdersCount.count || 0,
        };

        res.json(dashboardData);
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.status(500).json({ message: 'Gagal mengambil data dasbor.', error });
    }
};