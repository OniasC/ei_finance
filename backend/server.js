const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "postgres_db",
  port: 5432,
  user: process.env.POSTGRES_USER || "devuser",
  password: process.env.POSTGRES_PASSWORD || "devpass",
  database: process.env.POSTGRES_DB || "devdb",
});

app.get("/logs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM logs ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(4000, () => console.log(" Backend running on port 4000"));