const knex = require('knex');
const knexfile = require('../knexfile');

// Tentukan environment yang akan digunakan, defaultnya adalah 'development'
const environment = process.env.NODE_ENV || 'development';

// Ambil konfigurasi dari knexfile sesuai environment yang aktif
const config = knexfile[environment];

// Ekspor instance Knex yang sudah siap digunakan
module.exports = knex(config);