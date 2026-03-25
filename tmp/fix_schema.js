import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  database: 'PTCG__Squirrel',
  user: 'postgres',
  password: '20050111',
  port: 5432,
});

async function fixSchema() {
  try {
    console.log('Attempting to fix playTag schema...');
    
    // Check if constraint exists first
    const check = await pool.query(`
      SELECT conname 
      FROM pg_constraint 
      WHERE conname = 'play_tag_unique_class'
    `);
    
    if (check.rows.length > 0) {
      console.log('Dropping incorrect constraint play_tag_unique_class...');
      await pool.query('ALTER TABLE "playTag" DROP CONSTRAINT play_tag_unique_class');
    } else {
      console.log('Constraint play_tag_unique_class not found, checking for unique indexes...');
      const checkIdx = await pool.query(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE indexname = 'play_tag_unique_class'
      `);
      if (checkIdx.rows.length > 0) {
        console.log('Dropping incorrect index play_tag_unique_class...');
        await pool.query('DROP INDEX play_tag_unique_class');
      }
    }

    console.log('Adding proper unique constraint (class, classId, tagId)...');
    // Using a new name to avoid conflicts if needed, or reuse.
    await pool.query('ALTER TABLE "playTag" ADD CONSTRAINT play_tag_unique_combo UNIQUE (class, "classId", "tagId")');
    
    console.log('Schema fix completed successfully.');
  } catch (err) {
    console.error('Failed to fix schema:', err);
  } finally {
    await pool.end();
  }
}

fixSchema();
