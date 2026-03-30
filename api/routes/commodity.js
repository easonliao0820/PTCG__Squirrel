import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import pool from '../db.js';

const router = express.Router();

// 1. 初始化 Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. 配置 Multer 使用記憶體儲存
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const BUCKET_NAME = 'ptcg-assets';

// 輔助函式：上傳圖片到 Supabase Storage
async function uploadToSupabase(file, folder = 'commodity') {
  const fileName = `${folder}/com_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) throw error;
  
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return { fileName, publicUrl: publicUrlData.publicUrl };
}

// 輔助函式：從 Supabase Storage 刪除圖片
async function deleteFromSupabase(fileName) {
  if (!fileName) return;
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([fileName]);
  
  if (error) {
    console.error(`Failed to delete file from Supabase: ${fileName}`, error.message);
  }
}

// API: 取得所有商品 (支援分頁與搜尋)
router.get('/commodities', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let whereClause = '';
    let params = [];
    if (search) {
      whereClause = 'WHERE name ILIKE $1';
      params.push(`%${search}%`);
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM commodity ${whereClause}`, params);
    const totalItems = parseInt(countRes.rows[0].count);

    const dataParams = [...params, limit, offset];
    const result = await pool.query(
      `SELECT * FROM commodity ${whereClause} ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      dataParams
    );

    const commodities = result.rows.map(row => {
      let imageUrl = row.img;
      if (row.img && !row.img.startsWith('http')) {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(row.img);
        imageUrl = data.publicUrl;
      }
      return {
        id: row.id,
        name: row.name,
        price: row.money,
        stock: row.stock,
        content: row.content,
        imageUrl: imageUrl
      };
    });

    res.json({
      data: commodities,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    console.error('Fetch commodities failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 新增商品
router.post('/commodities', upload.single('image'), async (req, res) => {
  try {
    const { name, price, stock, content } = req.body;
    let imgFilename = null;

    if (req.file) {
      const { fileName } = await uploadToSupabase(req.file);
      imgFilename = fileName;
    }

    const result = await pool.query(
      'INSERT INTO commodity (name, money, stock, img, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, Number(price) || 0, Number(stock) || 0, imgFilename, content || null]
    );

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Create commodity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 更新商品
router.put('/commodities/:id', upload.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, stock, content } = req.body;

    let query = 'UPDATE commodity SET name=$1, money=$2, stock=$3, content=$4 WHERE id=$5 RETURNING *';
    let values = [name, Number(price) || 0, Number(stock) || 0, content || null, id];

    if (req.file) {
      const oldResult = await pool.query('SELECT img FROM commodity WHERE id=$1', [id]);
      if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
        await deleteFromSupabase(oldResult.rows[0].img);
      }

      const { fileName } = await uploadToSupabase(req.file);
      query = 'UPDATE commodity SET name=$1, money=$2, stock=$3, content=$4, img=$5 WHERE id=$6 RETURNING *';
      values = [name, Number(price) || 0, Number(stock) || 0, content || null, fileName, id];
    }

    const result = await pool.query(query, values);
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Update commodity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 刪除商品
router.delete('/commodities/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const oldResult = await pool.query('SELECT img FROM commodity WHERE id=$1', [id]);
    if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
      await deleteFromSupabase(oldResult.rows[0].img);
    }
    await pool.query('DELETE FROM commodity WHERE id=$1', [id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Delete commodity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
