import React from 'react';
import styles from '../styles/pages/Services.module.scss';

const Services = () => {
  return (
    <div className={styles.servicesContainer}>
      <h2 className={styles.pageTitle}>服務介紹</h2>
      
      {/* 1. 咖啡區塊 - 溫暖棕色調 */}
      <section className={`${styles.serviceSection} ${styles.coffeeBg}`}>
        <div className={styles.logoCircle}>
          <img src="咖啡LOGO圖網址" alt="Coffee" />
        </div>
        <div className={styles.contentGrid}>
          <div className={styles.menuImage}>菜單圖片</div>
          <div className={styles.textBlock}>現磨手沖咖啡與在地烘焙點心...</div>
          <div className={styles.subImage}>環境圖</div>
          <div className={styles.textBlock}>營造放鬆的桌遊休憩空間...</div>
          <div className={styles.verticalMenu}>飲品清單</div>
        </div>
      </section>

      {/* 2. PTCG 區塊 - 寶可夢藍黃調與圖片穿插 */}
      <section className={`${styles.serviceSection} ${styles.ptcgBg}`}>
        <div className={styles.logoCircle}>
          <img src="松鼠PTCG圖網址" alt="PTCG" />
        </div>
        <div className={styles.ptcgLayout}>
          <div className={styles.headerRow}>
            <div className={styles.cardInfoText}>
              <h3>最新活動資訊</h3>
              <p>每週末舉辦道館賽，歡迎新手玩家加入...</p>
            </div>
            {/* 輪播圖容器 */}
            <div className={styles.carouselWrapper}>
              <div className={styles.calendarSlide}>活動日曆圖</div>
              {/* 輪播圖點點 */}
              <div className={styles.carouselDots}>
                <span className={styles.dot}></span>
                <span className={`${styles.dot} ${styles.active}`}></span>
                <span className={styles.dot}></span>
              </div>
            </div>
          </div>
          
          {/* 圖片穿插文章區域 */}
          <div className={styles.articleWithImages}>
            <div className={styles.articleItem}>
              <div className={styles.imageBox}>卡牌展示 1</div>
              <p>專業卡牌教學指導</p>
            </div>
            <div className={styles.articleItem}>
              <div className={styles.imageBox}>卡牌展示 2</div>
              <p>完整的對戰環境</p>
            </div>
            <div className={styles.articleItem}>
              <div className={styles.imageBox}>卡牌展示 3</div>
              <p>官方認證裁判駐點</p>
            </div>
            <div className={styles.articleItem}>
              <div className={styles.imageBox}>卡牌展示 4</div>
              <p>多樣化限定周邊販售</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 超人力霸王區塊 - 經典紅白黑 */}
      <section className={`${styles.serviceSection} ${styles.ultraBg}`}>
        <div className={styles.logoCircle}>LOGO</div>
        <div className={styles.ultraLayout}>
          <div className={styles.badgeCol}>
            <div className={styles.badge}>Ultra League</div>
            <div className={styles.badge}>Card Game</div>
          </div>
          <div className={styles.mainInfo}>超人力霸王卡牌對戰區介紹內容...</div>
          <div className={styles.posterArea}>活動海報展示</div>
        </div>
      </section>

      {/* 4. 桌遊區塊 - 森林綠/原木色調 */}
      <section className={`${styles.serviceSection} ${styles.boardGameBg}`}>
        <div className={styles.logoCircle}>
          <img src="桌遊盒裝LOGO網址" alt="BoardGames" />
        </div>
        <div className={styles.bgLayout}>
          <div className={styles.sideImages}>
            <div className={styles.img}>盒裝圖 1</div>
            <div className={styles.img}>盒裝圖 2</div>
          </div>
          <div className={styles.centerDesc}>收錄超過 200 款熱門桌遊...</div>
          <div className={styles.sideImages}>
            <div className={styles.img}>盒裝圖 3</div>
            <div className={styles.img}>盒裝圖 4</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;