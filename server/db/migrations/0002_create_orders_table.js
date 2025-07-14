exports.up = function(knex) {
  return knex.schema.createTable('orders', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('total_amount').notNullable();
    table.string('status').defaultTo('pending');
    table.timestamps(true, true);

    // Sintaks Foreign Key yang lebih aman
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('orders');
};