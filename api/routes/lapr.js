import express from 'express';
import pool from '../db.js';

const router = express.Router();

// API: 取得劇本殺分頁資訊 (總筆數與總頁數)
router.get('/lapr/pagination', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const search = req.query.search || '';
    
    let whereClause = '';
    let params = [];
    if (search) {
      whereClause = 'WHERE name ILIKE $1 OR publisher ILIKE $1 OR remark ILIKE $1';
      params.push(`%${search}%`);
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM lapr ${whereClause}`, params);
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

// API: 取得所有劇本殺 (支援分頁與搜尋)
router.get('/lapr', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let whereClause = '';
    let params = [];
    if (search) {
      whereClause = 'WHERE l.name ILIKE $1 OR l.publisher ILIKE $1 OR l.remark ILIKE $1';
      params.push(`%${search}%`);
    }

    // 取得總筆數
    const countRes = await pool.query(`SELECT COUNT(*) FROM lapr l ${whereClause}`, params);
    const totalItems = parseInt(countRes.rows[0].count);

    // 取得分頁資料
    const dataParams = [...params, limit, offset];
    const result = await pool.query(`
      SELECT l.*, 
             (SELECT json_agg(t.title) 
              FROM \"playTag\" pt 
              JOIN tag t ON pt.\"tagId\" = t.id 
              WHERE pt.class = 'lapr' AND pt.\"classId\" = l.id) as tags
      FROM lapr l 
      ${whereClause}
      ORDER BY l.id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, dataParams);

    const laprs = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      publisher: row.publisher,
      remark: row.remark,
      tags: row.tags || []
    }));

    res.json({
      status: 'success',
      data: laprs,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    console.error('Fetch lapr failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 新增 LARP
router.post('/lapr', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { name, role, publisher, remark, tags } = req.body;

    const result = await client.query(
      'INSERT INTO lapr (name, role, publisher, remark) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role, publisher, remark]
    );
    const laprId = result.rows[0].id;

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
        await client.query('INSERT INTO "playTag" (class, "classId", "tagId") VALUES ($1, $2, $3)', ['lapr', laprId, tagId]);
      }
    }

    await client.query('COMMIT');
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create lapr failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

// API: 更新 LARP
router.put('/lapr/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = req.params.id;
    const { name, role, publisher, remark, tags } = req.body;

    await client.query(
      'UPDATE lapr SET name=$1, role=$2, publisher=$3, remark=$4 WHERE id=$5',
      [name, role, publisher, remark, id]
    );

    if (tags) {
      await client.query('DELETE FROM "playTag" WHERE class = $1 AND "classId" = $2', ['lapr', id]);
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
        await client.query('INSERT INTO "playTag" (class, "classId", "tagId") VALUES ($1, $2, $3)', ['lapr', id, tagId]);
      }
    }

    await client.query('COMMIT');
    res.json({ status: 'success' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update lapr failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

// API: 刪除 LARP
router.delete('/lapr/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = req.params.id;
    await client.query('DELETE FROM lapr WHERE id=$1', [id]);
    await client.query('COMMIT');
    res.json({ status: 'success' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete lapr failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

export default router;
