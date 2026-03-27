import pool from './api/db.js';

async function update() {
  try {
    const res = await pool.query(`UPDATE activity SET style = style - 1 WHERE style IN (1, 2)`);
    console.log(`Updated ${res.rowCount} rows in activity table.`);
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

update();
