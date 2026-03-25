import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  database: 'PTCG__Squirrel',
  user: 'postgres',
  password: '20050111',
  port: 5432,
});

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT
        conname as constraint_name,
        contype as constraint_type,
        pg_get_constraintdef(c.oid) as definition,
        t.relname as table_name
      FROM
        pg_constraint c
      JOIN
        pg_class t ON t.oid = c.conrelid
      WHERE
        contype = 'u';
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkSchema();
