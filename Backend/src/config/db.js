/**
 * db.js är en fil som innehåller funktioner för att ansluta till databasen
 */
const mysql = require("mysql2/promise");
require("dotenv").config();

/**
 * Skapar en pool för att ansluta till databasen
 * @type {import("mysql2/promise").Pool}
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Hämtar en anslutning till databasen
 * @returns {Promise<import("mysql2/promise").Connection>} - anslutningen till databasen
 */
pool.getConnection()
  .then(connection => {
    console.log("Connected to database");
    connection.release();
  })
  .catch(error => {
    console.error("Database connection failed:", error.stack);
  });

//exporterar pool för att kunna använda den i andra filer
module.exports = pool;