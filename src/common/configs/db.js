import { config } from "dotenv";
import mysql from "mysql2/promise";
import * as logger from "../logger/loggerSetup.js";

config();

// Validate required environment variables
const requiredVars = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME"];
const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length) {
  logger.error(`Missing database config variables: ${missingVars.join(", ")}`, {
    component: "database-config",
    missingVars,
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

// Test the connection with minimal logging
(async () => {
  try {
    const connection = await pool.getConnection();
    logger.info(
      `Database connection pool established with DB: ${process.env.DB_NAME}`
    );
    connection.release();
  } catch (err) {
    logger.error("Failed to connect to the database", {
      error: err.message,
      database: process.env.DB_NAME,
      component: "database-connection",
    });
    process.exit(1);
  }
})();

export default pool;
