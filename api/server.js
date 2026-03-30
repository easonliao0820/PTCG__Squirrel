// --- 1. 環境變數預載入 ---
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

dotenv.config(); // 雲端環境會自動抓取 Render 設定的變數

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('-------------------------------------------');
console.log('✅ 環境變數已載入');
console.log('📡 目標資料庫:', process.env.DATABASE_URL ? '已讀取連線字串' : '❌ 讀取失敗');
console.log('-------------------------------------------');

// --- 2. 導入其餘模組 ---
import express from 'express';
import cors from 'cors';
import pool from './db.js';

// 導入路由 (維持不變)
import adminRoutes from './routes/admin.js';
import calendarRoutes from './routes/calendar.js';
import activityRoutes from './routes/activity.js';
import commodityRoutes from './routes/commodity.js';
import boardGamesRoutes from './routes/boardGames.js';
import laprRoutes from './routes/lapr.js';
import tagRoutes from './routes/tag.js';

const app = express();
// 重要：優先使用雲端分配的 PORT，本機則預設 3000
const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
  res.send('🚀 PTCG Squirrel API 運行中！請使用 /api/test_connection 測試連線。');
});

// Middleware
// 建議修改：允許所有來源，避免 Vercel 連不進來
app.use(cors({ origin: true, credentials: true })); 
app.use(express.json());

// 註冊路由 (維持不變)
app.use('/api', adminRoutes);
app.use('/api', calendarRoutes);
app.use('/api', activityRoutes);
app.use('/api', commodityRoutes);
app.use('/api', boardGamesRoutes);
app.use('/api', laprRoutes);
app.use('/api', tagRoutes);

// API: 測試連線
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

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 後端伺服器運行中，埠號: ${PORT}`);
  console.log('-------------------------------------------');
});