import mysql from 'mysql2/promise'
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from './config.js'

console.log("Database Config:", {
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  // Don't log password
});

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log("Database connected successfully");
    connection.release();
  })
  .catch(err => {
    console.error("Error connecting to database:", err);
  });

// Wrap query to add logging
const originalQuery = pool.query.bind(pool);
pool.query = async function (...args) {
  console.log("Database Query:", {
    sql: args[0],
    params: args[1] || []
  });
  try {
    const result = await originalQuery(...args);
    console.log("Query Result:", {
      success: true,
      rowCount: result[0]?.length || 0
    });
    return result;
  } catch (error) {
    console.error("Query Error:", error);
    throw error;
  }
};

export default pool;
