import pool from './api/db.js';

async function check() {
  try {
    const query = `
      SELECT a.*, 
             to_char(a."dateStart", 'YYYY-MM-DD') as date_start_str,
             to_char(a."dateEnd", 'YYYY-MM-DD') as date_end_str,
             ac.name as class_name, 
             ast.content as style_content,
             (at.id IS NOT NULL) as is_top
      FROM activity a
      LEFT JOIN "activityClass" ac ON a."classId" = ac.id
      LEFT JOIN "activityStyle" ast ON a."styleId" = ast.id
      LEFT JOIN "activityTop" at ON a.id = at.activityid
      ORDER BY is_top DESC, a.id DESC
      LIMIT 1 OFFSET 0
    `;
    const res = await pool.query(query);
    console.log('Query success:', res.rows);
    process.exit(0);
  } catch (err) {
    console.error('Query Error:', err.message);
    process.exit(1);
  }
}

check();
