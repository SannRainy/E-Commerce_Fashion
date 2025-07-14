exports.up = function(knex) {
  return knex.schema.createTable('cart_items', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.integer('quantity').notNullable().defaultTo(1);
    table.timestamps(true, true);

    // Foreign Keys
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('product_id').references('products.id').onDelete('CASCADE');
    
    // Pastikan setiap produk hanya muncul sekali untuk setiap pengguna
    table.unique(['user_id', 'product_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cart_items');
};