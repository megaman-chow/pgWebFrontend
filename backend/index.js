// backend/index.js
require('dotenv').config();  // load env variables

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Postgres using dotenv values
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Test route
app.get('/', (req, res) => {
  res.send('✅ Backend connected & using dotenv');
});

// Route to get schemas + tables
app.get('/db-structure', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `);

    const structure = {};
    result.rows.forEach(row => {
      if (!structure[row.table_schema]) {
        structure[row.table_schema] = [];
      }
      structure[row.table_schema].push(row.table_name);
    });

    res.json(structure);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching database structure");
  }
});

// Route to fetch data from a table
app.get('/data/:schema/:table', async (req, res) => {
  const { schema, table } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM ${schema}.${table} LIMIT 100;`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching table data");
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));