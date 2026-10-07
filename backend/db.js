const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "sanjuu",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "hotel_management",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});


pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
  } else {
    console.log("✅ PostgreSQL connected successfully to database:", process.env.DB_NAME || "hotel_management");
    release();
  }
});

module.exports = pool;