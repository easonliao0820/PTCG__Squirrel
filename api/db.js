// api/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // 關鍵在這一行：允許使用 Supabase 的自簽署憑證
    rejectUnauthorized: true 
  }
});

export default pool;