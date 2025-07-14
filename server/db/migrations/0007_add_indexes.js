// E-Commerce_Fashion-main/server/db/migrations/0007_add_indexes.js
exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.index('email'); // Index untuk pencarian saat login
    }),
    knex.schema.table('products', function(table) {
      table.index('user_id'); // Index untuk relasi ke user
      table.index('name');    // Index untuk fitur pencarian
    }),
    knex.schema.table('orders', function(table) {
      table.index('user_id'); // Index untuk riwayat pesanan
    }),
    knex.schema.table('order_items', function(table) {
      table.index('order_id');
      table.index('product_id');
    }),
    knex.schema.table('cart_items', function(table) {
      table.index('user_id');
      table.index('product_id');
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.dropIndex('email');
    }),
    knex.schema.table('products', function(table) {
      table.dropIndex('user_id');
      table.dropIndex('name');
    }),
    knex.schema.table('orders', function(table) {
      table.dropIndex('user_id');
    }),
    knex.schema.table('order_items', function(table) {
      table.dropIndex('order_id');
      table.dropIndex('product_id');
    }),
    knex.schema.table('cart_items', function(table) {
      table.dropIndex('user_id');
      table.dropIndex('product_id');
    })
  ]);
};