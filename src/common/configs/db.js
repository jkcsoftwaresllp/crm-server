import { config } from "dotenv";
import mysql from "mysql2/promise";

config();

// Validate required environment variables
const requiredVars = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME"];
const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length) {
  console.error(`❌ Missing database config variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONN_LIMIT || "10", 10),
  queueLimit: 0,
});

// Optional: Test the connection immediately
(async () => {
  try {
    const connection = await pool.getConnection();
    console.info("Database connection pool established.");
    connection.release();
  } catch (err) {
    console.error("🔴 Failed to connect to the database:", err.message);
    process.exit(1);
  }
})();

export default pool;