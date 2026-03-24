import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  database: 'PTCG__Squirrel',
  user: 'postgres',
  password: '20050111',
  port: 5432, // PostgreSQL預設埠號
});

// 測試連線（如果無法連線，會在啟動時報錯）
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
