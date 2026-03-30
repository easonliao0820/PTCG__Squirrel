import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 強制載入 .env.local，確保在 Pool 初始化前環境變數已就位
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

console.log('--- Connecting to:', process.env.DATABASE_URL);

const { Pool } = pg;

// 這裡不再僅依賴 server.js，因為 ESM 載入順序會導致 db.js 先執行
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 針對 Supabase 雲端環境必須強制開啟 SSL
  ssl: {
    rejectUnauthorized: false
  }
});

// 監聽錯誤
pool.on('error', (err) => {
  console.error('❌ 資料庫連線池發生錯誤:', err.message);
});

export default pool;