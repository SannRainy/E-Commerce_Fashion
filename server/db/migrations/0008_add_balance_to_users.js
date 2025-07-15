// E-Commerce_Fashion-main/server/db/migrations/0008_add_balance_to_users.js
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    // Tambahkan kolom saldo, default 0, tidak boleh negatif
    table.decimal('balance', 15, 2).notNullable().defaultTo(0.00);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('balance');
  });
};