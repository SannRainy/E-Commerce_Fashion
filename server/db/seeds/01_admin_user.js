// E-Commerce_Fashion-main/server/db/seeds/01_admin_user.js
const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Hapus semua user yang ada untuk menghindari duplikat saat seeding ulang
  await knex('users').del();

  // Buat password hash untuk admin
  const hashedPassword = await bcrypt.hash('123123', 10);

  // Masukkan data admin ke tabel users
  await knex('users').insert([
    {
      name: 'Admin MDG',
      email: 'adminmdg@private.com',
      password: hashedPassword,
      role: 'admin' // Tetapkan peran sebagai 'admin'
    }
  ]);
};