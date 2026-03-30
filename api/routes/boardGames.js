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
async function uploadToSupabase(file, folder = 'boardGames') {
  const fileName = `${folder}/bg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
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

// API: 取得桌遊分頁資訊
router.get('/board-games/pagination', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    
    let whereClause = '';
    let params = [];
    if (search) {
      whereClause = 'WHERE name ILIKE $1 OR content ILIKE $1';
      params.push(`%${search}%`);
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM "boardGames" ${whereClause}`, params);
    const totalItems = parseInt(countRes.rows[0].count);

    res.json({
      status: 'success',
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 取得所有桌遊 (支援分頁與搜尋)
router.get('/board-games', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let whereClause = '';
    let params = [];
    if (search) {
      whereClause = 'WHERE b.name ILIKE $1 OR b.content ILIKE $1';
      params.push(`%${search}%`);
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM "boardGames" b ${whereClause}`, params);
    const totalItems = parseInt(countRes.rows[0].count);

    const dataParams = [...params, limit, offset];
    const result = await pool.query(`
      SELECT b.*, 
             (SELECT json_agg(t.title) 
              FROM "playTag" pt 
              JOIN tag t ON pt."tagId" = t.id 
              WHERE pt.class = 'boardGames' AND pt."classId" = b.id) as tags
      FROM "boardGames" b 
      ${whereClause}
      ORDER BY b.id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, dataParams);

    const games = result.rows.map(row => {
      let imageUrl = row.img;
      if (row.img && !row.img.startsWith('http')) {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(row.img);
        imageUrl = data.publicUrl;
      }
      return {
        id: row.id,
        name: row.name,
        playingTime: row.time,
        suggestedAge: row.age,
        playerCount: row.people,
        description: row.content,
        imageUrl: imageUrl,
        tags: row.tags || []
      };
    });

    res.json({
      status: 'success',
      data: games,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    console.error('Fetch board games failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 新增桌遊
router.post('/board-games', upload.single('image'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { name, time, age, people, content, tags } = req.body;
    let imgFilename = null;

    if (req.file) {
      const { fileName } = await uploadToSupabase(req.file);
      imgFilename = fileName;
    }

    const result = await client.query(
      'INSERT INTO "boardGames" (name, time, age, people, content, img) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, time, age, people, content, imgFilename]
    );
    const gameId = result.rows[0].id;

    if (tags) {
      const tagList = Array.isArray(tags) ? tags : JSON.parse(tags);
      for (const title of tagList) {
        let tagRes = await client.query('SELECT id FROM tag WHERE title = $1', [title]);
        let tagId;
        if (tagRes.rows.length === 0) {
          const newTag = await client.query('INSERT INTO tag (title) VALUES ($1) RETURNING id', [title]);
          tagId = newTag.rows[0].id;
        } else {
          tagId = tagRes.rows[0].id;
        }
        await client.query('INSERT INTO "playTag" (class, "classId", "tagId") VALUES ($1, $2, $3)', ['boardGames', gameId, tagId]);
      }
    }

    await client.query('COMMIT');
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create board game failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

// API: 更新桌遊
router.put('/board-games/:id', upload.single('image'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = req.params.id;
    const { name, time, age, people, content, tags } = req.body;

    let query = 'UPDATE "boardGames" SET name=$1, time=$2, age=$3, people=$4, content=$5 WHERE id=$6';
    let values = [name, time, age, people, content, id];

    if (req.file) {
      const oldResult = await client.query('SELECT img FROM "boardGames" WHERE id=$1', [id]);
      if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
        await deleteFromSupabase(oldResult.rows[0].img);
      }
      const { fileName } = await uploadToSupabase(req.file);
      query = 'UPDATE "boardGames" SET name=$1, time=$2, age=$3, people=$4, content=$5, img=$6 WHERE id=$7';
      values = [name, time, age, people, content, fileName, id];
    }

    await client.query(query, values);

    if (tags) {
      await client.query('DELETE FROM "playTag" WHERE class = $1 AND "classId" = $2', ['boardGames', id]);
      const tagList = Array.isArray(tags) ? tags : JSON.parse(tags);
      for (const title of tagList) {
        let tagRes = await client.query('SELECT id FROM tag WHERE title = $1', [title]);
        let tagId;
        if (tagRes.rows.length === 0) {
          const newTag = await client.query('INSERT INTO tag (title) VALUES ($1) RETURNING id', [title]);
          tagId = newTag.rows[0].id;
        } else {
          tagId = tagRes.rows[0].id;
        }
        await client.query('INSERT INTO "playTag" (class, "classId", "tagId") VALUES ($1, $2, $3)', ['boardGames', id, tagId]);
      }
    }

    await client.query('COMMIT');
    res.json({ status: 'success' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update board game failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

// API: 刪除桌遊
router.delete('/board-games/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = req.params.id;
    const oldResult = await client.query('SELECT img FROM "boardGames" WHERE id=$1', [id]);
    if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
      await deleteFromSupabase(oldResult.rows[0].img);
    }
    await client.query('DELETE FROM "boardGames" WHERE id=$1', [id]);
    await client.query('COMMIT');
    res.json({ status: 'success' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete board game failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

export default router;
