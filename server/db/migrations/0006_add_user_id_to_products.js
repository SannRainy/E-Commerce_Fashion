// E-Commerce_Fashion-main/server/db/migrations/0006_add_user_id_to_products.js
exports.up = function(knex) {
  return knex.schema.table('products', function(table) {
    table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
  });
};

exports.down = function(knex) {
  return knex.schema.table('products', function(table) {
    table.dropColumn('user_id');
  });
};