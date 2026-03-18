import styles from '../../styles/pages/PlayPage.module.scss';

const PlayPage = () => {
  const games = [
    { name: "拉密（Rummikub）", time: "60-90min", players: "3-4人", category: "策略", age: "10+", image: "/images/boardgame/boardgame1.jpeg" },
    { name: "黃牌", time: "30min", players: "2-4人", category: "策略", age: "10+", image: "/images/boardgame/boardgame2.jpeg" },
    { name: "瞎掰王 9UPPER", time: "30min", players: "3-10人", category: "派對", age: "8+", image: "/images/boardgame/boardgame3.jpeg" },
    { name: "狼人殺", time: "15min", players: "2-5人", category: "派對", age: "7+", image: "/images/boardgame/boardgame4.jpeg" },
    { name: "字字轉機（ANOMIA）", time: "30-60min", players: "8-18人", category: "陣營", age: "12+", image: "/images/boardgame/boardgame5.jpeg" },
    { name: "電車難題", time: "30min", players: "5-10人", category: "陣營", age: "12+", image: "/images/boardgame/boardgame6.jpeg" },
    { name: "說書人迪士尼Dixit Disney", time: "20min", players: "2-4人", category: "小品", age: "10+", image: "/images/boardgame/boardgame7.jpeg" },
    { name: "與貓的距離", time: "30min", players: "3-6人", category: "派對", age: "8+", image: "/images/boardgame/boardgame8.jpeg" },
    { name: "一刻館", time: "45min", players: "2-4人", category: "策略", age: "12+", image: "/images/boardgame/boardgame9.jpeg" },
    { name: "地產大亨", time: "60-120min", players: "2-6人", category: "經典", age: "8+", image: "/images/boardgame/boardgame10.jpeg" },
    { name: "壽司走走", time: "20min", players: "2-5人", category: "派對", age: "8+", image: "/images/boardgame/boardgame11.jpeg" },
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
              <div className={styles.tagGrid}>
                <div className={styles.tag}>遊玩時長：{game.time}</div>
                <div className={styles.tag}>建議組合：{game.category}</div>
                <div className={styles.tag}>建議人數：{game.players}</div>
                <div className={styles.tag}>建議年齡：{game.age}</div>
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