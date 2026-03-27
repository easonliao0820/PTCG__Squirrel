import pool from './api/db.js';

const gamesData = [
  { id: 201, name: '馬尼拉 Manila', min: 3, max: 5, note: '' },
  { id: 202, name: '村莊 Village', min: 2, max: 4, note: '' },
  { id: 203, name: '豐饒大地 Fertility', min: 2, max: 4, note: '' },
  { id: 204, name: '文明繪卷 Tapestry', min: 1, max: 5, note: '' },
  { id: 205, name: '龍城對壘 DRAGON CASTLE', min: 2, max: 4, note: '' },
  { id: 206, name: '騎士紋章 Barony', min: 2, max: 4, note: '' },
  { id: 207, name: '拯救北極熊', min: 1, max: 4, note: '' },
  { id: 208, name: '我的村莊 My Village', min: 2, max: 4, note: '' },
  { id: 209, name: '拉密', min: 2, max: 4, note: '益智' },
  { id: 210, name: '拉密-變臉', min: 2, max: 4, note: '益智' },
  { id: 211, name: '台北大空襲', min: 2, max: 4, note: '台灣原創' },
  { id: 212, name: '地產大亨-瑪莉歐', min: 2, max: 6, note: '' },
  { id: 213, name: '地產大亨-航海王', min: 2, max: 6, note: '' },
  { id: 214, name: '地產大亨-七龍珠', min: 2, max: 6, note: '' },
  { id: 215, name: '地產大亨-美少女戰士', min: 2, max: 6, note: '' },
  { id: 216, name: '我是大老闆', min: 3, max: 6, note: '' },
  { id: 217, name: '鍛骰物語 Dice Forge', min: 2, max: 4, note: '' },
  { id: 218, name: '逃離亞特蘭提斯 Survive：Escape from Atlantis！', min: 2, max: 6, note: '' },
  { id: 219, name: '展翅翱翔 Wingspan', min: 1, max: 5, note: '' },
  { id: 220, name: '皇輿爭霸 Dominion', min: 2, max: 4, note: '' },
  { id: 221, name: '碰撞機器人 RICOCHET ROBOTS', min: 1, max: 100, note: '' },
  { id: 222, name: '駱駝大賽', min: 3, max: 8, note: '歡樂' },
  { id: 223, name: '馬王爭霸 LONG SHOT', min: 3, max: 8, note: '' },
  { id: 224, name: '雨後新香 Petrichor', min: 1, max: 5, note: '' },
  { id: 225, name: '森生不息 Living Forest', min: 2, max: 4, note: '' },
  { id: 226, name: '一千零一夜 Tales of the Arabian Night', min: 2, max: 4, note: '' },
  { id: 227, name: '聖托里尼 Santorini', min: 2, max: 4, note: '' },
  { id: 228, name: '郎中闖江湖 The Quacks of Quedlinburg', min: 2, max: 4, note: '' },
  { id: 229, name: '殖民火星 Terraforming Mars', min: 1, max: 5, note: '' },
  { id: 230, name: '道場 Dojo Kun', min: 1, max: 4, note: '' },
  { id: 231, name: '奧爾良 Orléans', min: 2, max: 4, note: '' },
  { id: 232, name: '奧爾良-強敵入侵擴充', min: 2, max: 5, note: '' },
  { id: 233, name: '奧爾良-瘟疫入侵擴充', min: 2, max: 5, note: '' },
  { id: 234, name: '龍年', min: 2, max: 5, note: '' },
  { id: 235, name: '枯山水', min: 2, max: 4, note: '' },
  { id: 236, name: '亞魯特學院 Anludim', min: 2, max: 4, note: '' },
  { id: 237, name: '密涅瓦 MINERVA', min: 1, max: 4, note: '' },
  { id: 238, name: '水下城市 Underwater Cities', min: 1, max: 4, note: '' },
  { id: 239, name: '馬可波羅 The Voyages of Marco Polo', min: 2, max: 4, note: '' },
  { id: 240, name: '馬可波羅-擴充', min: 2, max: 4, note: '' },
  { id: 241, name: '馬可波羅-可汗的托付', min: 2, max: 4, note: '' },
  { id: 242, name: '特魯瓦 Troyes', min: 2, max: 4, note: '' },
  { id: 243, name: '木鹿 MERY', min: 1, max: 4, note: '' },
  { id: 244, name: '死亡寒冬 Dead of Winter', min: 2, max: 5, note: '' },
  { id: 245, name: '追隨達爾文', min: 2, max: 5, note: '' },
  { id: 246, name: '終焉帝國', min: 2, max: 4, note: '' },
  { id: 247, name: '南河旅人', min: 1, max: 4, note: '' },
  { id: 248, name: '新阿姆斯特丹 Nieuw Amsterdam', min: 2, max: 5, note: '' },
  { id: 249, name: '拉斯維加斯', min: 2, max: 8, note: '' },
  { id: 250, name: '女巫的佳釀', min: 2, max: 5, note: '' },
  { id: 251, name: '王國軼聞錄 PAPER TALES', min: 2, max: 5, note: '' },
  { id: 252, name: '斯凱島', min: 3, max: 5, note: '' },
  { id: 253, name: '御竹園', min: 2, max: 4, note: '' },
  { id: 254, name: '御竹園-熊孩子擴充', min: 2, max: 4, note: '' },
  { id: 255, name: '伊斯坦堡', min: 3, max: 5, note: '' },
  { id: 256, name: '頭等艙列車', min: 2, max: 4, note: '' },
  { id: 257, name: '權力遊戲 A Game of Throne', min: 3, max: 6, note: '' },
  { id: 258, name: '塔樓 Talo', min: 2, max: 4, note: '家庭' },
  { id: 259, name: '蒙巴薩 Mombasa', min: 2, max: 4, note: '' },
  { id: 260, name: '英雄止步', min: 1, max: 4, note: '' },
  { id: 261, name: '英雄止步-會長的復仇擴充', min: 1, max: 4, note: '' },
  { id: 262, name: '英雄止步-偉大的沉睡者擴充', min: 1, max: 4, note: '' },
  { id: 263, name: '阿納克遺蹟 Lost Ruins Of Arnak', min: 1, max: 4, note: '' },
  { id: 264, name: '電力公司', min: 2, max: 4, note: '' },
  { id: 265, name: '電力公司-北歐地圖', min: 2, max: 4, note: '' },
  { id: 266, name: '電力公司-英國地圖', min: 2, max: 4, note: '' },
  { id: 267, name: '電力公司-澳洲地圖', min: 2, max: 4, note: '' },
  { id: 268, name: '電力公司-印度地圖', min: 2, max: 4, note: '' },
  { id: 269, name: '火線任務：閃燃瞬間 FLASH POINT：FIRE RESCUE', min: 2, max: 6, note: '' },
  { id: 270, name: '騎士學院', min: 2, max: 5, note: '' },
  { id: 271, name: '談鬼俱樂部', min: 3, max: 5, note: '台灣原創' },
  { id: 272, name: '盆景大師', min: 1, max: 4, note: '' },
  { id: 273, name: '布魯日 Brügge', min: 2, max: 5, note: '' },
  { id: 274, name: '骰築英雄', min: 1, max: 4, note: '' },
  { id: 275, name: '骰築英雄-怪獸與爪牙擴充', min: 1, max: 4, note: '' },
  { id: 276, name: '鐵道任務', min: 2, max: 5, note: '' },
  { id: 277, name: '夢想家園', min: 2, max: 4, note: '' },
  { id: 278, name: '印加聖谷 Urubamba Valley', min: 2, max: 5, note: '' },
  { id: 279, name: '叔叔的遺囑', min: 2, max: 5, note: '' },
  { id: 280, name: '驢橋', min: 3, max: 6, note: '記憶' },
  { id: 281, name: '歷史巨輪 Through the Ages', min: 2, max: 4, note: '' },
  { id: 282, name: '妙探尋兇 CLUEDO', min: 3, max: 6, note: '推理' },
  { id: 283, name: '叢林智慧棋 Bumuntu', min: 2, max: 5, note: '' },
  { id: 284, name: '國王堡傳奇 Kingsburg', min: 2, max: 5, note: '' },
  { id: 285, name: '諾丁漢警長', min: 3, max: 5, note: '' },
  { id: 286, name: 'CV人生履歷', min: 2, max: 4, note: '' },
  { id: 287, name: 'CV撰寫文明史', min: 2, max: 5, note: '' },
  { id: 288, name: '爆珠發明', min: 2, max: 4, note: '' },
  { id: 289, name: '古巴：聖地牙哥', min: 2, max: 4, note: '' },
  { id: 290, name: '活在當下 Carpe Diem', min: 2, max: 4, note: '' },
  { id: 291, name: '俄羅斯鐵路 Russian railroads', min: 2, max: 4, note: '' },
  { id: 292, name: '農家樂', min: 1, max: 4, note: '' },
  { id: 293, name: '農家樂-閤家歡樂版', min: 1, max: 4, note: '' },
  { id: 294, name: '太陽神的祭司 Priests of RA', min: 2, max: 5, note: '' },
  { id: 295, name: '石器時代', min: 2, max: 4, note: '' },
  { id: 296, name: '石器時代-時尚擴充', min: 2, max: 5, note: '' },
  { id: 297, name: '石器時代-兒童版', min: 2, max: 4, note: '家庭' },
  { id: 298, name: '五大部落 Five Tribes', min: 2, max: 4, note: '' },
  { id: 299, name: '蓋亞計劃 Gaia Project', min: 1, max: 4, note: '' },
  { id: 300, name: '蓋亞計劃-失落的艦隊擴充', min: 1, max: 4, note: '' },
];

function generateInfo(game) {
    let content = `這是一款適合 ${game.min || '-'}-${game.max} 人的${game.note || '挑戰性'}桌遊。`;
    let time = "60 min";
    let age = "12+";

    if (game.note === '歡樂' || game.note === '家庭' || game.note === '記憶') {
        time = "20-30 min";
        age = "7+";
    } else if (game.note === '益智' || game.note === '推理') {
        time = "45-90 min";
        age = "10+";
    } else if (game.note === '台灣原創') {
        time = "45-60 min";
        age = "12+";
    }

    if (game.name.includes('地產大亨')) {
        content = "經典的大富翁遊戲，這次加入了受歡迎的動漫角色！透過交易皮土地、建設房屋，成為最後的贏家。";
        time = "45-90 min";
        age = "8+";
    } else if (game.name.includes('農家樂')) {
        content = "你是一名農夫，必須與家人共同打拼，擴建房舍、開墾田地、飼養牲畜，確保在收割季節有足夠的糧食。";
        time = "90-120 min";
        age = "12+";
    } else if (game.name.includes('電力公司')) {
        content = "在區域市場中競標電廠，購買燃料，並擴張電網。你能否有效地管理資金與資源，成為最大的電力霸主？";
        time = "120 min";
        age = "12+";
    } else if (game.name.includes('拉密')) {
        content = "全球知名的數字排列遊戲。考驗邏輯與觀察力，將手中的牌結合成合法的組合。";
        time = "20-30 min";
        age = "8+";
    } else if (game.name.includes('駱駝大賽')) {
        content = "在瘋狂的駱駝賽跑中下注！看看哪隻駱駝會遙遙領先，哪隻又會疊在別人的背上。";
        time = "30-45 min";
        age = "8+";
    } else if (game.name.includes('展翅翱翔')) {
        content = "扮演鳥類愛好者，透過收集食物、築巢、產卵，吸引各種獨特的鳥類來到你的保護區。";
        time = "40-70 min";
        age = "10+";
    }

    return { content: content.slice(0, 500), time: time.slice(0, 50), age: age.slice(0, 50) };
}

async function importData() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Starting third batch import with truncation...');

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
        console.log('Third batch import successful!');
        process.exit(0);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Third batch import failed:', err);
        process.exit(1);
    } finally {
        client.release();
    }
}

importData();
