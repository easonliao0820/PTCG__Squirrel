import pool from './api/db.js';

const larpData = [
  { id: 1, name: '群星落幕時', role: '3人/3女', type: '未來', publisher: 'K的遊戲', remark: '' },
  { id: 2, name: '不要回答', role: '3人/2男1女', type: '現代/刑偵', publisher: 'X超游會', remark: '' },
  { id: 3, name: '嫌疑人X沒有現身', role: '3人/2男1女', type: '現代/刑偵', publisher: 'K的遊戲', remark: '' },
  { id: 4, name: '躲貓貓', role: '3人/3男', type: '恐怖', publisher: '偵星謀', remark: '' },
  { id: 5, name: '塵封往事', role: '4人/2男2女', type: '現代', publisher: '晴宇文化', remark: '' },
  { id: 6, name: '覺醒', role: '4人/3男1女', type: '未來', publisher: 'K的遊戲', remark: '' },
  { id: 7, name: '怪胎公館', role: '4人/3男1女', type: '現代/還原', publisher: '驚人院', remark: '' },
  { id: 8, name: '太空來電', role: '4人/2男2女', type: '未來', publisher: '驚人院', remark: '' },
  { id: 9, name: '鼹之鼠', role: '4人2男2女', type: '民初', publisher: '讀心神探', remark: '' },
  { id: 10, name: '落櫻成殤', role: '4人/2男2女', type: '校園', publisher: '劇謀探', remark: '' },
  { id: 11, name: '海的那邊是什麼', role: '4人/2男2女', type: '現代/機制', publisher: '驚人院', remark: '' },
  { id: 12, name: '江湖', role: '4人/2男2女', type: '古代', publisher: '劇謀探', remark: '' },
  { id: 13, name: '我是你領導', role: '4人/2男2女', type: '現代', publisher: '劇謀探', remark: '' },
  { id: 14, name: '望雀', role: '4人/3男1女', type: '古代', publisher: 'K的遊戲', remark: '' },
  { id: 15, name: '敦煌', role: '4人/2男2女', type: '歷史情懷', publisher: '劇愛玩', remark: '聯名敦煌美術研究所' },
  { id: 16, name: '失控玩家', role: '4人/3男1女', type: '未來/變格', publisher: 'X超游會', remark: '' },
  { id: 17, name: '花花森林', role: '4人/4隻動物', type: '歡樂/機制', publisher: '狐說叭道', remark: '' },
  { id: 18, name: '龍門客棧', role: '4人/2男2女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 19, name: '危城之下', role: '4人/2男2女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 20, name: '夜訪德古拉', role: '4人/2男2女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 21, name: '消失的姐妹', role: '4人/2男2女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 22, name: '打工人的24小時', role: '4人/不拘', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 23, name: '哪吒之魔童詭誕日', role: '4人/3男1女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 24, name: '無間旅途', role: '4人/不拘', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 25, name: '神秘不老泉', role: '4人/2男2女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 26, name: '禁閉兇間', role: '5人/4男1女', type: '現代', publisher: '鬼書遊戲', remark: '有聲' },
  { id: 27, name: '屠龍之征', role: '5人/5男', type: '架空/思辨', publisher: 'K的遊戲', remark: '有繁化' },
  { id: 28, name: '誰與爭瘋', role: '5人/4男1女', type: '現代/歡樂', publisher: 'K的遊戲', remark: '' },
  { id: 29, name: '生日快樂', role: '5人/3男2女', type: '現代/還原', publisher: 'K的遊戲', remark: '純卡牌' },
  { id: 30, name: '謐夜', role: '5人/3男2女', type: '現代', publisher: '劇謀探', remark: '' },
  { id: 31, name: '瘋人塔', role: '5人/3男2女', type: '古代', publisher: 'K的遊戲', remark: '' },
  { id: 32, name: '迷失航班', role: '5人/3男2女', type: '現代', publisher: 'K的遊戲', remark: '' },
  { id: 33, name: '白無垢', role: '5人/2男3女', type: '日式', publisher: '明星大偵探', remark: '' },
  { id: 34, name: '夢回谷', role: '5人/3男2女', type: '還原', publisher: '劇謀探', remark: '' },
  { id: 35, name: '後天魔之謎', role: '5人/3男2女', type: '古代/變格', publisher: 'K的遊戲', remark: '' },
  { id: 36, name: '死因相館', role: '5人/4男1女', type: '港風/還原', publisher: '探靈冊', remark: '' },
  { id: 37, name: '妖貓出長安', role: '5人/3男2女', type: '古代', publisher: 'K的遊戲', remark: '' },
  { id: 38, name: '六民繪卷', role: '5人/3男2女', type: '古代/立意', publisher: 'K的遊戲', remark: '' },
  { id: 39, name: '驚魂青金村', role: '5人/3男2女', type: '現代/還原', publisher: 'K的遊戲', remark: '' },
  { id: 40, name: '再見蘇西', role: '5人/3男2女', type: '校園', publisher: 'K的遊戲', remark: '' },
  { id: 41, name: '一則訃告', role: '5人/2男3女', type: '架空', publisher: '明星大偵探', remark: '' },
  { id: 42, name: '宮廷欲孽', role: '5人/2男3女', type: '古代/後宮', publisher: '劇謀探', remark: '' },
  { id: 43, name: '梁溪詭影', role: '5人/2男3女', type: '民初/恐怖', publisher: 'K的遊戲', remark: '' },
  { id: 44, name: '星火號', role: '5人/3男2女', type: '未來', publisher: 'K的遊戲', remark: '' },
  { id: 45, name: '廣平戲社', role: '5人/2男3女', type: '民初', publisher: '驚人院', remark: '' },
  { id: 46, name: '神秘來客', role: '5人/1男4女', type: '現代', publisher: '讀心神探', remark: '' },
  { id: 47, name: '第三雙眼睛', role: '5人/3男2女', type: '韓風', publisher: '明星大偵探', remark: '' },
  { id: 48, name: '娘娘千歲', role: '5人/5女', type: '古代/後宮', publisher: 'K的遊戲', remark: '' },
  { id: 49, name: '百鬼夜巡', role: '5人/5隻妖怪', type: '日式/變格', publisher: '晴宇文化', remark: '' },
  { id: 50, name: '誠如惡魔低語', role: '5人/3男2女', type: '現代/變格', publisher: 'K的遊戲', remark: '' },
  { id: 51, name: '鎂光下的罪惡', role: '5人/3男2女', type: '現代', publisher: '劇謀探', remark: '' },
  { id: 52, name: '雲山道清', role: '5人/3男2女', type: '古代', publisher: '劇謀探', remark: '' },
  { id: 53, name: '七月半', role: '5人/2男1女2不拘', type: '恐怖/還原', publisher: '真相檔案', remark: '' },
  { id: 54, name: '惡念', role: '5人/5個靈體', type: '還原', publisher: '明星大偵探', remark: '' },
  { id: 55, name: '石庚村', role: '5人/3男2女', type: '恐怖', publisher: '明星大偵探', remark: '' },
  { id: 56, name: '郡主太受歡迎了怎麼辦', role: '5人/3男2女', type: '古代/機制', publisher: 'K的遊戲', remark: '' },
  { id: 57, name: '紅皇帝修道院', role: '5人/3男2女', type: '歐風', publisher: '探靈冊', remark: '' },
  { id: 58, name: '彩虹實驗室', role: '5人/3男2女', type: '現代', publisher: '明星大偵探', remark: '' },
  { id: 59, name: '出雲川', role: '5人/3男2女', type: '日式', publisher: '探靈冊', remark: '' },
  { id: 60, name: '嵬', role: '5人/3男2女', type: '現代', publisher: 'K的遊戲', remark: '' },
  { id: 61, name: '小白船上的哭聲', role: '5人/3男2女', type: '現代/還原', publisher: 'K的遊戲', remark: '' },
  { id: 62, name: '大笨鐘', role: '5人/3男2女', type: '現代/情感', publisher: '明星大偵探', remark: '' },
  { id: 63, name: '璇璣賜福', role: '5人/3男2女', type: '古代/機制', publisher: '明星大偵探', remark: '' },
  { id: 64, name: '玉闕樓台', role: '5人/3男2女', type: '古代/變格', publisher: '探靈冊', remark: '' },
  { id: 65, name: '逆轉命運游戲', role: '5人/5男', type: '機制/還原', publisher: 'K的遊戲', remark: '' },
  { id: 66, name: '金翅鳥謎局', role: '5人/3男2女', type: '現代', publisher: '探靈冊', remark: '' },
  { id: 67, name: '巴黎懸疑事件', role: '5人/4男1女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 68, name: '夜幕之下', role: '5人/2男3女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 69, name: '豐都夜游', role: '5人/不拘', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 70, name: '公主和親', role: '5人/4男1女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 71, name: '仙主隕落', role: '5人/3男2女', type: '小小劇本', publisher: '我是大刑偵', remark: '' },
  { id: 72, name: '日穆西山', role: '5人/3男2女', type: '小小劇本', publisher: '我是大刑偵', remark: '' },
  { id: 73, name: '神跡', role: '5人/3男2女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 74, name: '花魁秘聞', role: '5人/3男2女', type: '小小劇本', publisher: '我是大刑偵', remark: '' },
  { id: 75, name: '被遺棄的真相', role: '5人/3男2女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 76, name: '完美社區', role: '5-6人/2男3女1NPC', type: '現代', publisher: '心靈角落', remark: '' },
  { id: 77, name: '櫻花樹下的約定', role: '5-6人/2男3女1NPC', type: '校園', publisher: '摩埃創意', remark: '台灣原創' },
  { id: 78, name: '遊輪謎影', role: '6人/4男2女', type: '現代', publisher: 'K的遊戲', remark: '有繁化' },
  { id: 79, name: '殺死巫師', role: '6人/3男2女1貓', type: '變格', publisher: 'K的遊戲', remark: '有繁化' },
  { id: 80, name: '隱秘關係', role: '6人/3男3女', type: '現代', publisher: 'K的遊戲', remark: '' },
  { id: 81, name: '大疫', role: '6人/3男3女', type: '近未來', publisher: 'K的遊戲', remark: '' },
  { id: 82, name: '血祭', role: '6人/3男3女', type: '現代', publisher: '劇謀探', remark: '' },
  { id: 83, name: '臨淵客棧', role: '6人/3男3女', type: '古代', publisher: 'K的遊戲', remark: '' },
  { id: 84, name: '未知旅程', role: '6人/4男2女', type: '未來', publisher: '明星大偵探', remark: '' },
  { id: 85, name: '通靈扇', role: '6人/3男3女', type: '現代', publisher: '劇謀探', remark: '' },
  { id: 86, name: '惡之源', role: '6人/3男3女', type: '現代', publisher: '讀心神探', remark: '' },
  { id: 87, name: '海爾波普', role: '6人/4男2女', type: '韓風', publisher: '明星大偵探', remark: '' },
  { id: 88, name: '陰陽師', role: '6人/5男1女', type: '日式/變格', publisher: '劇謀探', remark: '' },
  { id: 89, name: '復仇之翼', role: '6人/3男3女', type: '架空', publisher: '明星大偵探', remark: '' },
  { id: 90, name: '有貓則靈', role: '6人/4男2女', type: '日式', publisher: '明星大偵探', remark: '' },
  { id: 91, name: '謊言城', role: '6人/3男3女', type: '還原', publisher: '明星大偵探', remark: '' },
  { id: 92, name: '墻頭馬上', role: '6人/3男3女', type: '古代/情感', publisher: '咪咕挑燈', remark: '' },
  { id: 93, name: '皮囊之下', role: '6人/5男1女', type: '現代', publisher: 'X超游會', remark: '' },
  { id: 94, name: '娘娘千歲2女帝攻略', role: '6人/5女1NPC', type: '古代', publisher: 'K的遊戲', remark: '' },
  { id: 95, name: '唐人街', role: '6人/3男3女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 96, name: '月圓之時', role: '6人/4男2女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 97, name: '地球流浪者', role: '6人/3男3女', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 98, name: '租界風雲', role: '7人/4男3女', type: '民初/機制', publisher: '劇謀探', remark: '' },
  { id: 99, name: '黑夜傳說', role: '7人/7個故事人物', type: '架空', publisher: 'K的遊戲', remark: '' },
  { id: 100, name: '划落天際的流星', role: '7人/4男3女', type: '還原/情感', publisher: '劇謀探', remark: '' },
  { id: 101, name: '諜影風沙', role: '7人/4男3女', type: '民初', publisher: '劇謀探', remark: '' },
  { id: 102, name: '惡魔契約', role: '7人/4男3女', type: '架空', publisher: '明星大偵探', remark: '' },
  { id: 103, name: '十里紅妝', role: '7人/4男3女', type: '古代', publisher: '劇謀探', remark: '' },
  { id: 104, name: '誰是蚩尤臥底', role: '7人/3男2女2不拘', type: '阿瓦隆', publisher: 'K的遊戲', remark: '聯名《夢幻西游》' },
  { id: 105, name: '黑暗雲端', role: '8人/4男4女', type: '古代', publisher: '劇謀探', remark: '' },
  { id: 106, name: '神秘邀請函', role: '8人/不拘', type: '小小劇本', publisher: '破案現場', remark: '' },
  { id: 107, name: '局中局', role: '9人/4男5女', type: '小小劇本', publisher: '破案現場', remark: '無線索' },
];

async function importData() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Starting LARP import (v2)...');

        for (const larp of larpData) {
            const name = larp.name.slice(0, 30);
            const publisher = larp.publisher.slice(0, 30);
            const remark = larp.remark.slice(0, 100);
            const role = larp.role.slice(0, 30);
            
            // Insert into lapr (id, name, role, publisher, remark)
            const result = await client.query(
                'INSERT INTO lapr (id, name, role, publisher, remark) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [larp.id, name, role, publisher, remark]
            );
            const larpId = result.rows[0].id;

            // Handle Tags
            const tags = larp.type.split(/[\/, ]/).filter(t => t.trim() !== '');
            if (larp.remark.includes('台灣原創')) tags.push('台灣原創');
            
            for (const title of tags) {
                let tagRes = await client.query('SELECT id FROM tag WHERE title = $1', [title]);
                let tagId;
                if (tagRes.rows.length === 0) {
                    const newTag = await client.query('INSERT INTO tag (title) VALUES ($1) RETURNING id', [title]);
                    tagId = newTag.rows[0].id;
                } else {
                    tagId = tagRes.rows[0].id;
                }
                await client.query('INSERT INTO "playTag" (class, "classId", "tagId") VALUES ($1, $2, $3)', ['lapr', larpId, tagId]);
            }
        }

        await client.query('COMMIT');
        console.log('LARP import successful!');
        process.exit(0);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('LARP import failed:', err);
        process.exit(1);
    } finally {
        client.release();
    }
}

importData();
