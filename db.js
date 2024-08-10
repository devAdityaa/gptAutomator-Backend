const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'upwork10',
  password: '@upwork$$',
  database: 'antonia',
});

async function startTransaction(client) {
    await client.query('BEGIN');
}

async function commitTransaction(client) {
    await client.query('COMMIT');
}

async function rollbackTransaction(client) {
    await client.query('ROLLBACK');
}

module.exports = { pool, startTransaction, commitTransaction, rollbackTransaction };
