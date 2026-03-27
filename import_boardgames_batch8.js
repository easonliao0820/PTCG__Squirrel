import pool from './api/db.js';

const gamesData = [
  { id: 701, name: '掌握時刻 TAKE TIME', min: 2, max: 4, note: '' },
  { id: 702, name: '七翻天 FLIP7', min: 3, max: 10, note: '' },
  { id: 703, name: '卡米諾', min: 1, max: 6, note: '家庭' },
  { id: 704, name: '心靈圖解任務', min: 4, max: 10, note: '家庭' },
  { id: 705, name: '終點攝影-最後衝刺 PHOTOFINISH', min: 2, max: 6, note: '' },
];

function generateInfo(game) {
    let content = `這是一款適合 ${game.min || '-'}-${game.max} 人的${game.note || '有趣'}桌遊。`;
    let time = "30 min";
    let age = "7+";

    if (game.note === '家庭') {
        time = "15-20 min";
        age = "6+";
    }

    if (game.name.includes('掌握時刻')) {
        content = "考驗反應與時間感的快節奏遊戲。在分秒必爭的挑戰中，準確掌握時機！";
    }

    return { content: content.slice(0, 500), time: time.slice(0, 50), age: age.slice(0, 50) };
}

async function importData() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Starting eighth batch import with truncation...');

        for (const game of gamesData) {
            const { content, time, age } = generateInfo(game);
            const people = `${game.min || '-'}-${game.max} 人`.slice(0, 50);
            const name = game.name.slice(0, 30);
            
            // Insert into boardGames
            const result = await client.query(
                'INSERT INTO "boardGames" (name, time, age, people, content) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [name, time, age, people, content]
            );
            const gameId = result.rows[0].id;

            // Handle Tags
            const tags = [];
            if (game.note) tags.push(game.note);
            
            for (const title of tags) {
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
        console.log('Eighth batch import successful!');
        process.exit(0);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Eighth batch import failed:', err);
        process.exit(1);
    } finally {
        client.release();
    }
}

importData();
