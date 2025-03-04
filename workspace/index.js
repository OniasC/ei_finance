const { Client } = require('pg');

const client = new Client({
    host: "postgres_db",
    port: 5432,
    user: "devuser",
    password: "devpass",
    database: "devdb"
});

async function connectDB(params) {
    try{
        await client.connect();
        console.log("Connected to PostgreSQL!");
    } catch(err) {
        console.error("connection error", err.stack);
    } finally {
        await client.end();
        console.log("Disconnected from PostgreSQL!");
    }
}

async function insertLog(message, level) {
    try{
        await client.connect();
        const query = "INSERT INTO LoGs (message, level) VALUES ($1, $2) RETURNING *"; //database is not case sensitive.
        const values = [message, level];

        const res = await client.query(query, values);
        console.log(res.rows[0]);
        console.log("Connected to PostgreSQL!");
    } catch(err) {
        console.error("database error", err.stack);
    } finally {
        await client.end();
        console.log("Disconnected from PostgreSQL!");
    }
}

async function fetchLogs() {
    try {
      await client.connect();
      const res = await client.query("SELECT * FROM logs ORDER BY created_at DESC");
      console.log("Logs:", res.rows);
    } catch (err) {
      console.error("Database error:", err);
    } finally {
      await client.end();
    }
  }

insertLog("Application started successfully running it a third time!", "QUATORZE");
//fetchLogs();