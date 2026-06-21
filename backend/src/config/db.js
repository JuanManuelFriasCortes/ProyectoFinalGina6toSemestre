// ============================================
// Conexión a la base de datos MySQL
// Usamos un POOL de conexiones (más eficiente que conexiones sueltas)
// y la versión con promesas para poder usar async/await en los controladores.
// ============================================
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

// Exportamos la versión con promesas -> permite: await pool.query(...)
const db = pool.promise();

// Pequeña prueba de conexión al arrancar (opcional, solo informativo)
db.query('SELECT 1')
  .then(() => console.log('✅ Conexión a MySQL exitosa'))
  .catch((err) => console.error('❌ Error conectando a MySQL:', err.message));

module.exports = db;
