const mysql = require('mysql2/promise');

const { env, hasDatabaseConfig } = require('./config/env');

let pool = null;

function getPool() {
  if (!hasDatabaseConfig()) {
    return null;
  }

  if (!pool) {
    pool = mysql.createPool(env.mysql);
  }

  return pool;
}

async function checkDatabase() {
  if (!hasDatabaseConfig()) {
    return {
      status: 'not_configured',
      detail: 'MYSQL_* environment variables are incomplete',
    };
  }

  try {
    const activePool = getPool();
    await activePool.query('SELECT 1 AS ok');

    return {
      status: 'up',
      detail: 'connection_ok',
    };
  } catch (error) {
    return {
      status: 'unavailable',
      detail: error.code || error.message,
    };
  }
}

module.exports = {
  getPool,
  checkDatabase,
};
