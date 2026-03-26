import pool from './api/db.js';

async function check() {
  try {
    const res = await pool.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `);
    console.log('Tables:', res.rows.map(r => r.tablename));

    const res2 = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'activityTop'
    `);
    console.log('Columns in activityTop:', res2.rows.map(r => r.column_name));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
