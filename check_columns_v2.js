import pool from './api/db.js';

async function check() {
  try {
    const res = await pool.query('SELECT * FROM "activityTop" LIMIT 1');
    console.log('Result rows:', res.rows);
    if (res.rows.length > 0) {
      console.log('Keys:', Object.keys(res.rows[0]));
    } else {
      console.log('Table is empty, checking columns via query...');
      const res2 = await pool.query('SELECT * FROM "activityTop" WHERE 1=0');
      console.log('Fields:', res2.fields.map(f => f.name));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
