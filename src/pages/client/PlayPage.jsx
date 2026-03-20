import styles from '../../styles/pages/PlayPage.module.scss';
import { AiFillClockCircle, AiOutlineUser, AiOutlineDashboard, AiOutlineTags } from "react-icons/ai";

const PlayPage = () => {
  const games = [
    { name: "拉密（Rummikub）", description: "號稱「以色列麻將」，透過數字邏輯與排列組合，將手中的牌全部出完。規則簡單但極具深度。", time: "30-60min", players: "2-4人", category: "經典/策略", age: "7+", image: "/images/boardgame/boardgame1.jpeg" },
    { name: "黃牌", description: "成人限定的填空遊戲！用各種無節操、無底線的辭彙填滿句子，考驗朋友圈的默契與下限。", time: "20-45min", players: "4-10人", category: "派對/18禁", age: "18+", image: "/images/boardgame/boardgame2.jpeg" },
    { name: "瞎掰王 9UPPER", description: "只有一個真話，其他全是瞎掰！考驗演技與瞎掰能力的噴飯派對遊戲，你能分辨誰在說謊嗎？", time: "20-30min", players: "3-9人", category: "派對", age: "9+", image: "/images/boardgame/boardgame3.jpeg" },
    { name: "狼人殺", description: "經典的隱藏身分推理遊戲。村民與狼人的生死較量，考驗邏輯、口才與心理博弈。", time: "30-120min", players: "8-18人", category: "推理/陣營", age: "10+", image: "/images/boardgame/boardgame4.jpeg" },
    { name: "字字轉機（ANOMIA）", time: "30min", description: "反應力大考驗！當你與他人的符號相同時，要在瞬間喊出對方類別的單字。緊張刺激、歡笑不斷。", players: "3-6人", category: "派對/反應", age: "10+", image: "/images/boardgame/boardgame5.jpeg" },
    { name: "電車難題", description: "道德淪喪的抉擇遊戲。你該救軌道上的無辜者，還是撞向那些讓人討厭的人物？全看你的人品。", time: "15-90min", players: "3-13人", category: "派對/社會", age: "15+", image: "/images/boardgame/boardgame6.jpeg" },
    { name: "說書人迪士尼", description: "用唯美的畫作講故事。結合迪士尼經典角色與場景，透過聯想與猜謎感受童話世界的魔力。", time: "30min", players: "3-6人", category: "派對/想像", age: "8+", image: "/images/boardgame/boardgame7.jpeg" },
    { name: "與貓的距離", description: "可愛到不行的吸貓遊戲！透過各種道具吸引貓咪靠近，看誰最後能獲得最多貓咪的青睞。", time: "15-40min", players: "2-6人", category: "派對", age: "8+", image: "/images/boardgame/boardgame8.jpeg" },
    { name: "冒險少女公會", description: "美少女牌組構築遊戲。帶領戰士、法師與牧師，打造最強公會，擊敗強大的地城首領。", time: "45-75min", players: "2-4人", category: "策略/牌組構築", age: "14+", image: "/images/boardgame/boardgame9.jpeg" },
    { name: "迷因在說話", description: "用文字與配圖創造最有趣的迷因！考驗你的幽默感，誰才是當代迷因之王？", time: "20-30min", players: "2-6人", category: "派對/迷因", age: "13+", image: "/images/boardgame/boardgame10.jpeg" },
    { name: "電力公司", description: "德式策略遊戲經典。透過競標發電廠、購買燃料與連結城市，目標成為提供最多電力的電力大亨。", time: "120min", players: "2-6人", category: "策略", age: "12+", image: "/images/boardgame/boardgame11.jpeg" },
  ];

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>搜尋店有桌遊</h2>

      {/* 搜尋區 */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <input type="text" placeholder="搜尋桌遊名稱..." className={styles.searchInput} />
          <button className={styles.searchBtn}>搜尋按鈕</button>
        </div>

        {/* 下拉選單區 */}
        <div className={styles.filterRow}>
          {['建議人數', '建議組合', '建議時常', '建議年齡'].map((label) => (
            <div key={label} className={styles.filterGroup}>
              <span className={styles.filterLabel}>{label}：</span>
              <select className={styles.selectBox}>
                <option>下拉選單</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* 桌遊卡片網格 */}
      <div className={styles.gameGrid}>
        {games.map((game, index) => (
          <div key={index} className={styles.gameCard}>
            <div className={styles.imageBox}>
              <img src={game.image} alt={game.name} />
            </div>
            <div className={styles.infoBox}>
              <h3 className={styles.gameName}>{game.name}</h3>
              <p className={styles.gameDesc}>{game.description}</p>
              <div className={styles.tagGrid}>
                <div className={styles.tag}><AiFillClockCircle /> {game.time}</div>
                <div className={styles.tag}><AiOutlineTags /> {game.category}</div>
                <div className={styles.tag}><AiOutlineUser /> {game.players}</div>
                <div className={styles.tag}><AiOutlineDashboard /> {game.age}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 分頁按鈕 */}
      <div className={styles.pagination}>
        <span>&lt;</span>
        <span className={styles.active}>1</span>
        <span>2</span>
        <span>3</span>
        <span>&gt;</span>
      </div>
    </div>
  );
};

export default PlayPage;