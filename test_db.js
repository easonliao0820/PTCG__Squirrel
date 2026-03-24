import pool from './api/db.js';
try {
  const version = await pool.query("SELECT version()");
  console.log('Version:', version.rows[0].version);
  const user = await pool.query("SELECT current_user");
  console.log('User:', user.rows[0].current_user);
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
