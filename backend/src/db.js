// src/db.js
// Este archivo crea la conexión a la base de datos MySQL
 
// Importamos dotenv para poder leer el archivo .env
require('dotenv').config();
 
// Importamos mysql2 para conectarnos a MySQL
const mysql = require('mysql2/promise');
 
// Creamos un 'pool' de conexiones.
// Un pool es como tener varias conexiones disponibles a la vez,
// lo cual es más eficiente que abrir y cerrar una conexión cada vez.
const pool = mysql.createPool({
  host:     process.env.DB_HOST,     // Lee el host del archivo .env
  port:     process.env.DB_PORT,     // Lee el puerto del archivo .env
  user:     process.env.DB_USER,     // Lee el usuario del archivo .env
  password: process.env.DB_PASSWORD, // Lee la contraseña del archivo .env
  database: process.env.DB_NAME,     // Lee el nombre de la BD del archivo .env
  ssl: {
    rejectUnauthorized: false         // Aiven requiere SSL, esto lo habilita
  }
});
 
// Exportamos el pool para usarlo en otros archivos
module.exports = pool;
