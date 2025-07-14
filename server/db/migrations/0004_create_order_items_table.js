exports.up = function(knex) {
  return knex.schema.createTable('order_items', function(table) {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.integer('quantity').notNullable();
    table.integer('price').notNullable();
    
    // Sintaks Foreign Key yang lebih aman
    table.foreign('order_id').references('orders.id').onDelete('CASCADE');
    table.foreign('product_id').references('products.id').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('order_items');
};