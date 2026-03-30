import express from 'express';
import multer from 'multer';
import { getSupabase } from '../supabase.js';
import pool from '../db.js';

const router = express.Router();

// 1. 初始化 Supabase (延遲初始化)
const getClient = () => getSupabase();
const BUCKET_NAME = 'ptcg-assets'; 

// 2. 配置 Multer 使用記憶體儲存 (不存硬碟)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 輔助函式：上傳圖片到 Supabase Storage
async function uploadToSupabase(file) {
  const fileName = `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const { data, error } = await getClient().storage
    .from(BUCKET_NAME)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) throw error;
  
  // 取得公開訪問網址
  const { data: publicUrlData } = getClient().storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return { fileName, publicUrl: publicUrlData.publicUrl };
}

// 輔助函式：從 Supabase Storage 刪除圖片
async function deleteFromSupabase(fileName) {
  const { error } = await getClient().storage
    .from(BUCKET_NAME)
    .remove([fileName]);
  
  if (error) {
    console.error(`Failed to delete file from Supabase: ${fileName}`, error.message);
  }
}

// API: 取得所有活動 (支援分頁、搜尋、分類、年月篩選)
router.get('/activities', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const classId = req.query.classId || 'all';
    const year = req.query.year || 'All';
    const month = req.query.month || 'All';

    let filters = [];
    let params = [];

    if (search) {
      params.push(`%${search}%`);
      filters.push(`(a.title ILIKE $${params.length} OR a.content ILIKE $${params.length})`);
    }

    if (classId !== 'all') {
      params.push(classId);
      filters.push(`a."classId" = $${params.length}`);
    }

    if (year !== 'All' && month !== 'All') {
      params.push(`${year}-${month}%`);
      filters.push(`to_char(a."dateStart", 'YYYY-MM') LIKE $${params.length}`);
    } else if (year !== 'All') {
      params.push(`${year}%`);
      filters.push(`to_char(a."dateStart", 'YYYY-MM-DD') LIKE $${params.length}`);
    } else if (month !== 'All') {
      params.push(`%-${month}-%`);
      filters.push(`to_char(a."dateStart", 'YYYY-MM-DD') LIKE $${params.length}`);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const countRes = await pool.query(`SELECT COUNT(*) FROM activity a ${whereClause}`, params);
    const totalItems = parseInt(countRes.rows[0].count);

    const dataParams = [...params, limit, offset];
    const result = await pool.query(`
      SELECT a.*, 
             to_char(a."dateStart", 'YYYY-MM-DD') as date_start_str,
             to_char(a."dateEnd", 'YYYY-MM-DD') as date_end_str,
             ac.name as class_name, 
             (SELECT json_agg(img) FROM "activityImg" WHERE "activityId" = a.id) as images,
             (atop.id IS NOT NULL) as is_top
      FROM activity a
      LEFT JOIN "activityClass" ac ON a."classId" = ac.id
      LEFT JOIN "activityTop" atop ON a.id = atop.activityid
      ${whereClause}
      ORDER BY is_top DESC, a.id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, dataParams);

    const activities = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      startAt: row.date_start_str,
      endAt: row.date_end_str,
      content: row.content,
      classId: row.classId,
      style: row.style,
      className: row.class_name,
      url: row.url,
      isTop: row.is_top,
      imageUrls: (row.images || []).map(img => {
          if (img.startsWith('http')) return img;
          const { data } = getClient().storage.from(BUCKET_NAME).getPublicUrl(img);
          return data.publicUrl;
      })
    }));

    res.json({
      data: activities,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    console.error('Fetch activities failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// [後續的新增、更新、刪除 API 保持不變...]
router.post('/activities', upload.array('images', 2), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, startAt, endAt, content, classId, style, url } = req.body;
    const files = req.files || [];

    const result = await client.query(
      'INSERT INTO activity (title, "dateStart", "dateEnd", content, "classId", style, url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, startAt || null, endAt || null, content, classId, style, url]
    );
    const activityId = result.rows[0].id;

    if (files.length > 0) {
      for (const file of files) {
        const { fileName } = await uploadToSupabase(file);
        await client.query('INSERT INTO "activityImg" ("activityId", img) VALUES ($1, $2)', [activityId, fileName]);
      }
    }

    await client.query('COMMIT');
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create activity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

router.put('/activities/:id', upload.array('images', 2), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = req.params.id;
    const { title, startAt, endAt, content, classId, style, url } = req.body;
    const files = req.files || [];

    await client.query(
      'UPDATE activity SET title=$1, "dateStart"=$2, "dateEnd"=$3, content=$4, "classId"=$5, style=$6, url=$7 WHERE id=$8',
      [title, startAt || null, endAt || null, content, classId, style, url, id]
    );

    if (files.length > 0) {
      const oldImgs = await client.query('SELECT img FROM "activityImg" WHERE "activityId"=$1', [id]);
      for (const row of oldImgs.rows) {
        await deleteFromSupabase(row.img);
      }
      await client.query('DELETE FROM "activityImg" WHERE "activityId"=$1', [id]);

      for (const file of files) {
        const { fileName } = await uploadToSupabase(file);
        await client.query('INSERT INTO "activityImg" ("activityId", img) VALUES ($1, $2)', [id, fileName]);
      }
    }

    await client.query('COMMIT');
    res.json({ status: 'success' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update activity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

router.delete('/activities/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = req.params.id;

    const imgs = await client.query('SELECT img FROM "activityImg" WHERE "activityId"=$1', [id]);
    for (const row of imgs.rows) {
      await deleteFromSupabase(row.img);
    }

    await client.query('DELETE FROM activity WHERE id=$1', [id]);

    await client.query('COMMIT');
    res.json({ status: 'success' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete activity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

router.post('/activities/toggle-top', async (req, res) => {
  const { activityId, isTop } = req.body;
  try {
    if (isTop) {
      const countRes = await pool.query('SELECT COUNT(*) FROM "activityTop"');
      if (parseInt(countRes.rows[0].count) >= 5) {
        return res.status(400).json({ status: 'error', message: '最多只能設定 5 個置頂輪播項目' });
      }
      await pool.query('INSERT INTO "activityTop" (activityid) VALUES ($1) ON CONFLICT DO NOTHING', [activityId]);
    } else {
      await pool.query('DELETE FROM "activityTop" WHERE activityid=$1', [activityId]);
    }
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Toggle top failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/activities/top', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
             to_char(a."dateStart", 'YYYY-MM-DD') as date_start_str,
             to_char(a."dateEnd", 'YYYY-MM-DD') as date_end_str,
             ac.name as class_name, 
             (SELECT json_agg(img) FROM "activityImg" WHERE "activityId" = a.id) as images
      FROM activity a
      INNER JOIN "activityTop" atop ON a.id = atop.activityid
      LEFT JOIN "activityClass" ac ON a."classId" = ac.id
      ORDER BY atop.id ASC
    `);

    const activities = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      startAt: row.date_start_str,
      endAt: row.date_end_str,
      content: row.content,
      classId: row.classId,
      style: row.style,
      className: row.class_name,
      url: row.url,
      imageUrls: (row.images || []).map(img => {
          if (img.startsWith('http')) return img;
          const { data } = getClient().storage.from(BUCKET_NAME).getPublicUrl(img);
          return data.publicUrl;
      })
    }));

    res.json({ status: 'success', data: activities });
  } catch (err) {
    console.error('Fetch top activities failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
