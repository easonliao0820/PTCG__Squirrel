import pool from './api/db.js';

const gamesData = [
    { id: 32, name: '腦洞量表-沒有下限', min: 4, max: 9, note: '歡樂' },
    { id: 33, name: '腦洞量表-大冒險', min: 4, max: 9, note: '歡樂' },
    { id: 34, name: '字母風火輪', min: 2, max: 100, note: '歡樂' },
    { id: 35, name: '沃塔棋', min: 2, max: 4, note: '益智' },
    { id: 36, name: 'UNO疊疊樂', min: 2, max: 100, note: '歡樂' },
    { id: 37, name: '形色叩叩', min: 2, max: 4, note: '' },
    { id: 38, name: '籤籤入扣', min: 2, max: 100, note: '歡樂' },
    { id: 39, name: 'UNO', min: 2, max: 100, note: '歡樂' },
    { id: 40, name: 'UNO Flip', min: 2, max: 100, note: '歡樂' },
    { id: 41, name: '星域奇航', min: 2, max: 2, note: '' },
    { id: 42, name: '大搜查', min: 2, max: 6, note: '解謎' },
    { id: 43, name: '大搜查-擴充', min: 2, max: 6, note: '解謎' },
    { id: 44, name: '大搜查-英勇冒險', min: 1, max: 6, note: '解謎' },
    { id: 45, name: '大搜查-史詩冒險', min: 1, max: 6, note: '解謎' },
    { id: 46, name: '大搜查-絕密冒險', min: 1, max: 6, note: '解謎' },
    { id: 47, name: '大搜查-異域冒險', min: 1, max: 6, note: '解謎' },
    { id: 48, name: '利曼24小時耐力賽', min: 2, max: 5, note: '' },
    { id: 49, name: '蟲蟲燒烤派對', min: 2, max: 7, note: '' },
    { id: 50, name: '罩得住', min: 2, max: 4, note: '' },
    { id: 51, name: '嗒寶-寶可夢 DOBBLE', min: 2, max: 6, note: '家庭' },
    { id: 52, name: '小惡魔 DIAVOLO', min: 2, max: 6, note: '家庭' },
    { id: 53, name: '誰是牛頭王', min: 2, max: 10, note: '歡樂' },
    { id: 54, name: '豆腐王國', min: 3, max: 8, note: '陣營' },
    { id: 55, name: '知識線-動物篇', min: 2, max: 8, note: '家庭' },
    { id: 56, name: '字字轉機-臉紅心跳', min: 3, max: 6, note: '歡樂' },
    { id: 57, name: '字字轉機-圖像版', min: 3, max: 6, note: '歡樂' },
    { id: 58, name: '亡者神抽', min: 2, max: 4, note: '' },
    { id: 59, name: 'PAPAYOO', min: 3, max: 8, note: '' },
    { id: 60, name: '情書', min: 2, max: 4, note: '' },
    { id: 61, name: '黃瓜五兄弟', min: 2, max: 6, note: '' },
    { id: 62, name: '變色龍', min: 2, max: 5, note: '' },
    { id: 63, name: '洪水警報', min: 3, max: 5, note: '' },
    { id: 64, name: '色字頭上一掌拍', min: 2, max: 6, note: '' },
    { id: 65, name: '心靈同步', min: 2, max: 4, note: '' },
    { id: 66, name: '矮人礦坑', min: 3, max: 10, note: '陣營' },
    { id: 67, name: '力爭上游', min: 4, max: 8, note: '歡樂' },
    { id: 68, name: '三國殺-國戰', min: 2, max: 12, note: '陣營' },
    { id: 69, name: '三國殺-標準', min: 2, max: 10, note: '陣營' },
    { id: 70, name: '三國殺-鐵盒版', min: 3, max: 10, note: '陣營' },
    { id: 71, name: '我滿懷業障的有病桌遊', min: 2, max: 6, note: '' },
    { id: 72, name: '我滿懷歧異的意識代碼', min: 1, max: 1, note: '' },
    { id: 73, name: '拼布藝術', min: 2, max: 2, note: '' },
    { id: 74, name: '歡迎來到你的理想家園', min: 1, max: 100, note: '' },
    { id: 75, name: '甜蜜的家', min: 2, max: 5, note: '' },
    { id: 76, name: '捕蟲仔', min: 2, max: 6, note: '' },
    { id: 77, name: '勝在有腦', min: 2, max: 6, note: '益智' },
    { id: 78, name: '勝在有腦-兒童版', min: 2, max: 6, note: '家庭' },
    { id: 79, name: 'MAGIC SCHOOL', min: 2, max: 4, note: '' },
    { id: 80, name: '海盜對決', min: 2, max: 2, note: '' },
    { id: 81, name: '圖騰快手', min: 2, max: 10, note: '歡樂' },
    { id: 82, name: 'SPYFALL', min: 3, max: 8, note: '陣營' },
    { id: 83, name: 'SPYFALL2', min: 3, max: 12, note: '陣營' },
    { id: 84, name: '卡卡頌-大全擴', min: 2, max: 6, note: '' },
    { id: 85, name: '山中小屋', min: 2, max: 6, note: '' },
    { id: 86, name: '山中小屋-寡婦行擴充', min: 2, max: 6, note: '' },
    { id: 87, name: '波多黎各', min: 2, max: 5, note: '' },
    { id: 88, name: '大創造時代', min: 1, max: 5, note: '' },
    { id: 89, name: '街口/骰子街', min: 2, max: 4, note: '' },
    { id: 90, name: '街口-百萬富翁擴充', min: 2, max: 4, note: '' },
    { id: 91, name: '街口-港口擴充', min: 2, max: 4, note: '' },
    { id: 92, name: '街口-傳承', min: 2, max: 4, note: '' },
    { id: 93, name: '小島', min: 1, max: 4, note: '' },
    { id: 94, name: '江戶職人物語', min: 2, max: 4, note: '' },
    { id: 95, name: '光合作用', min: 2, max: 4, note: '' },
    { id: 96, name: '星球 PLANTE', min: 2, max: 4, note: '' },
    { id: 97, name: '矩陣密室-25 ROOM-25', min: 1, max: 5, note: '' },
    { id: 98, name: '12支流 12Rivers', min: 2, max: 4, note: '' },
    { id: 99, name: '妙筆神猜', min: 3, max: 6, note: '歡樂' },
    { id: 100, name: '巫術學院', min: 2, max: 4, note: '' },
];

function generateInfo(game) {
    let content = `這是一款適合 ${game.min}-${game.max} 人的${game.note || '有趣'}桌遊。`;
    let time = "20-40 分鐘";
    let age = "8+";

    if (game.note === '歡樂' || game.note === '家庭') {
        time = "15-30 分鐘";
        age = "6+";
    } else if (game.note === '益智' || game.note === '解謎') {
        time = "45-90 分鐘";
        age = "12+";
    } else if (game.note === '陣營') {
        time = "30-60 分鐘";
        age = "10+";
    }

    if (game.name.includes('大搜查')) {
        content = "《大搜查！》是一款靈感源自於密室逃脫遊戲的卡牌共助遊戲。你能否在規定時間內解開謎題，成功逃脫？";
        time = "60 分鐘";
        age = "10+";
    } else if (game.name.includes('UNO')) {
        content = "經典的卡牌遊戲，想盡辦法將手中的牌出完！";
    } else if (game.name.includes('三國殺')) {
        content = "融合歷史、美術、卡牌等元素於一身的策略遊戲。角色扮演、陣營對抗，體驗爾虞我詐。";
        time = "45-60 分鐘";
        age = "15+";
    } else if (game.name.includes('山中小屋')) {
        content = "冒險者們進入神秘的山中別墅，探索房間並觸發超自然事件。直到某人背叛...";
        time = "60-90 分鐘";
        age = "12+";
    }

    return { content, time, age };
}

async function importData() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Starting import...');

        for (const game of gamesData) {
            const { content, time, age } = generateInfo(game);
            const people = `${game.min}-${game.max} 人`;
            
            // Insert into boardGames
            const result = await client.query(
                'INSERT INTO "boardGames" (name, time, age, people, content) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [game.name, time, age, people, content]
            );
            const gameId = result.rows[0].id;

            // Handle Tags
            const tags = [];
            if (game.note) tags.push(game.note);
            
            for (const title of tags) {
                // Find or create tag
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
        console.log('Import successful!');
        process.exit(0);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Import failed:', err);
        process.exit(1);
    } finally {
        client.release();
    }
}

importData();
