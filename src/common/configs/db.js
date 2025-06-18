import { config } from "dotenv";
import mysql from "mysql2/promise";
import * as logger from "../logger/loggerSetup.js";

config();

// Validate required environment variables
const requiredVars = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME"];
const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length) {
  logger.error(`Missing database config variables: ${missingVars.join(", ")}`, {
    component: 'database-config',
    missingVars,
    requiredVars,
    environmentCheck: 'failed'
  });
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
    logger.info("Database connection pool established", {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      connectionLimit: process.env.DB_CONN_LIMIT || "10",
      component: 'database-connection',
      connectionStatus: 'success',
      timestamp: new Date().toISOString()
    });
    connection.release();
  } catch (err) {
    logger.error("Failed to connect to the database", {
      error: err.message,
      stack: err.stack,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      component: 'database-connection',
      connectionStatus: 'failed',
      errorCode: err.code,
      timestamp: new Date().toISOString()
    });
    process.exit(1);
  }
})();

export default pool;
