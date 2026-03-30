import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import pool from '../db.js';

const router = express.Router();

// 1. 初始化 Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. 配置 Multer 使用記憶體儲存 (不存硬碟)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const BUCKET_NAME = 'ptcg-assets'; // 與 activity.js 保持一致

// 輔助函式：上傳圖片到 Supabase Storage
async function uploadToSupabase(file, customName) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(customName, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) throw error;
  
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(customName);

  return { fileName: customName, publicUrl: publicUrlData.publicUrl };
}

// 輔助函式：從 Supabase Storage 刪除圖片
async function deleteFromSupabase(fileName) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([fileName]);
  
  if (error) {
    console.error(`Failed to delete file from Supabase: ${fileName}`, error.message);
  }
}

// API: 取得所有行事曆 (支援分頁)
router.get('/calendar', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const countRes = await pool.query('SELECT COUNT(*) FROM calendar');
    const totalItems = parseInt(countRes.rows[0].count);

    const result = await pool.query(
      'SELECT * FROM calendar ORDER BY year DESC, month DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const calendars = result.rows.map(row => {
      let imageUrl = row.img;
      if (row.img && !row.img.startsWith('http')) {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(row.img);
        imageUrl = data.publicUrl;
      }
      return { ...row, imageUrl };
    });

    res.json({
      data: calendars,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Fetch calendars failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: 上傳/更新行事曆
router.post('/calendar/upload', upload.single('image'), async (req, res) => {
  try {
    const { year, month } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const paddedMonth = String(month).padStart(2, '0');
    // 使用原本的命名規則作為雲端檔名
    const customFileName = `calendar/${year}${paddedMonth}_${Date.now()}`;
    
    // 上傳到 Supabase
    const { fileName, publicUrl } = await uploadToSupabase(req.file, customFileName);

    const checkResult = await pool.query('SELECT img FROM calendar WHERE year = $1 AND month = $2', [year, month]);
    
    if (checkResult.rows.length > 0) {
      // 刪除舊檔案
      await deleteFromSupabase(checkResult.rows[0].img);
      await pool.query('UPDATE calendar SET img = $1 WHERE year = $2 AND month = $3', [fileName, year, month]);
    } else {
      await pool.query('INSERT INTO calendar (year, month, img) VALUES ($1, $2, $3)', [year, month, fileName]);
    }

    res.json({ status: 'success', message: 'Calendar saved to Supabase', imageUrl: publicUrl });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: 刪除行事曆
router.delete('/calendar/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const result = await pool.query('SELECT img FROM calendar WHERE year = $1 AND month = $2', [year, month]);
    
    if (result.rows.length > 0) {
      // 從 Supabase 刪除
      await deleteFromSupabase(result.rows[0].img);
      await pool.query('DELETE FROM calendar WHERE year = $1 AND month = $2', [year, month]);
    }
    
    res.json({ status: 'success', message: 'Calendar deleted from Supabase' });
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
