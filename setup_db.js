import pool from './api/db.js';

async function setup() {
  try {
    const res = await pool.query(`
      CREATE TABLE IF NOT EXISTS "activityTop" (
        id SERIAL PRIMARY KEY,
        "activityId" INTEGER NOT NULL REFERENCES activity(id) ON DELETE CASCADE UNIQUE
      );
    `);
    console.log('Table activityTop checked/created');
    process.exit(0);
  } catch (err) {
    console.error('Error setting up table:', err);
    process.exit(1);
  }
}

setup();
