exports.up = function(knex) {
  return knex.schema.createTable('products', function(table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.integer('price').notNullable();
    table.integer('stock').notNullable();
    table.string('imageUrl').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('products');
};