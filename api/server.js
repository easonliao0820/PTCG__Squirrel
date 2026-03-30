// --- 1. 環境變數預載入 (必須在所有 import 最上方) ---
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 強制指向根目錄的 .env.local
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

console.log('-------------------------------------------');
console.log('✅ 環境變數已預先載入');
console.log('📡 目標資料庫:', process.env.DATABASE_URL ? 'Supabase 雲端' : '❌ 讀取失敗');
console.log('-------------------------------------------');

// --- 2. 導入其餘模組 ---
import express from 'express';
import cors from 'cors';
import pool from './db.js';

// 導入路由
import adminRoutes from './routes/admin.js';
import calendarRoutes from './routes/calendar.js';
import activityRoutes from './routes/activity.js';
import commodityRoutes from './routes/commodity.js';
import boardGamesRoutes from './routes/boardGames.js';
import laprRoutes from './routes/lapr.js';
import tagRoutes from './routes/tag.js';

const app = express();
const PORT = 3000; // 鎖定你要求的 3000 埠號

// Middleware
app.use(cors());
app.use(express.json());
// 靜態檔案指向
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API: 測試連線 (檢查是否連上 Supabase)
app.get('/api/test_connection', async (req, res) => {
  try {
    const result = await pool.query('SELECT version()');
    res.json({
      status: 'success',
      message: '✅ 連線成功！已成功連至 Supabase 雲端資料庫。',
      db_version: result.rows[0].version
    });
  } catch (error) {
    console.error('❌ 連線失敗:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 註冊所有子路由
app.use('/api', adminRoutes);
app.use('/api', calendarRoutes);
app.use('/api', activityRoutes);
app.use('/api', commodityRoutes);
app.use('/api', boardGamesRoutes);
app.use('/api', laprRoutes);
app.use('/api', tagRoutes);

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 後端伺服器運行中: http://localhost:${PORT}`);
  console.log(`🔗 測試連線網址: http://localhost:${PORT}/api/test_connection`);
  console.log('-------------------------------------------');
});