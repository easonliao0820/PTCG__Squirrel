import React, { useRef, useState } from 'react';
import styles from '../styles/pages/Services.module.scss';

// 咖啡
const COFFEE_ICON = '/images/icon/coffee_LOGO.png';
const COFFEE_MENU1 = '/images/location/menu.jpg';
const COFFEE_MENU2 = '/images/location/menu2.jpg';
// 寶可夢
const PTCG_ICON = '/images/icon/ptcg_LOGO.png';
const DEFAULT_IMG = '/images/pokemon/turtwig.png';
const TURTWING_IMG = '/images/pokemon/turtwig.png';
const PIKACHU_IMG = '/images/pokemon/pikachu.png';
const EEVEE_IMG = '/images/pokemon/eevee.png';
const MIMIKYU_IMG = '/images/pokemon/mimikyu.png';
const WHIMSICOTT_IMG = '/images/pokemon/whimsicott.png';
// 超人力霸王
const UCG_ICON = '/images/icon/ucg_LOGO.png';
const UCG_MAIN_IMG = '/images/location/ultraman_main.png';
const UCG_POST1_IMG = '/images/location/ultraman_post1.jpg';
const UCG_POST2_IMG = '/images/location/ultraman_post2.jpg';
const UCG_CARDS_IMG = '/images/location/ultraman_cards.jpg';
// 桌遊
const BOARDGAME_ICON = '/images/icon/tablegame_LOGO.png';
const MAIN_MASCOT = '/images/logo-squirrel-detective.png';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('咖啡餐飲');
  const [zoomImg, setZoomImg] = useState(null);

  const coffeeRef = useRef(null);
  const ptcgRef = useRef(null);
  const ultraRef = useRef(null);
  const boardGameRef = useRef(null);

  const categories = [
    { name: 'PTCG', ref: ptcgRef, id: 'ptcg' },
    { name: '咖啡餐飲', ref: coffeeRef, id: 'coffee' },
    { name: '超人力霸王', ref: ultraRef, id: 'ultra' },
    { name: '桌遊', ref: boardGameRef, id: 'boardgame' }
  ];

  const scrollToSection = (category) => {
    setActiveCategory(category.name);
    category.ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className={styles.servicesContainer}>
      <h2 className={styles.pageTitle}>服務介紹</h2>

      <div className={styles.filterBar}>
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`${styles.filterBtn} ${styles[cat.id]} ${activeCategory === cat.name ? styles.active : ''}`}
            onClick={() => scrollToSection(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>



      {/* 1. PTCG 區塊 */}
      <section ref={ptcgRef} className={`${styles.serviceSection} ${styles.ptcgSection}`}>
        <div className={styles.logoCircle}>
          <img src={PTCG_ICON} alt="PTCG Logo" />
        </div>

        <div className={styles.ptcgTopLayout}>
          <div className={styles.leftCol}>
            <div className={styles.ptcgArticleBox}>
              <div className={styles.gymLogoContainer}>
                <img src={DEFAULT_IMG} alt="Gym Logo" />
              </div>
              <div className={styles.articleContent}>
                <p>官方認證教室</p>
              </div>
            </div>
            <div className={styles.mascotRow}>
              <img src={EEVEE_IMG} alt="Eevee" />
              <img src={WHIMSICOTT_IMG} alt="Whimsicott" />
              <img src={MIMIKYU_IMG} alt="Mimikyu" />
              <img src={TURTWING_IMG} alt="Turtwig" />
              <img src={PIKACHU_IMG} alt="Pikachu" />
            </div>
          </div>
          <div className={styles.rightCol}>
            <div className={styles.squareCarousel}>
              <img src={DEFAULT_IMG} alt="Activity Calendar" />
              <div className={styles.carouselDots}>
                <span className={styles.active}></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cardShowcaseGrid}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.cardItem}>JPG</div>
          ))}
        </div>
      </section>

      {/* 2. 咖啡區塊 */}
      <section ref={coffeeRef} className={`${styles.serviceSection} ${styles.coffeeSection}`}>
        <div className={styles.logoCircle}>
          <img src={COFFEE_ICON} alt="Coffee Logo" />
        </div>
        <div className={styles.coffeeGrid}>
          <div className={`${styles.gridItem} ${styles.zoomable}`} onClick={() => setZoomImg(COFFEE_MENU1)}>
            <img src={COFFEE_MENU1} alt="Menu" />
          </div>
          <div className={styles.gridItem}>
            <div className={styles.placeholderBox}>內文</div>
          </div>
          <div className={`${styles.gridItem} ${styles.rowSpan2} ${styles.zoomable}`} onClick={() => setZoomImg(COFFEE_MENU2)}>
            <img src={COFFEE_MENU2} alt="Menu2" />
          </div>
          <div className={styles.splitSubGrid}>
            <div className={styles.gridItem}>
              <img src={DEFAULT_IMG} alt="Coffee Sub 1" />
            </div>
            <div className={styles.gridItem}>
              <img src={DEFAULT_IMG} alt="Coffee Sub 2" />
            </div>
          </div>
          <div className={styles.splitSubGrid}>
            <div className={styles.gridItem}>
              <img src={DEFAULT_IMG} alt="Coffee Sub 3" />
            </div>
            <div className={styles.gridItem}>
              <img src={DEFAULT_IMG} alt="Coffee Sub 4" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. 超人力霸王區塊 */}
      <section ref={ultraRef} className={`${styles.serviceSection} ${styles.ultraSection}`}>
        <div className={styles.ultraLogoOverlay}>
          <img src={UCG_ICON} alt="Ultra Logo" />
        </div>
        <div className={styles.ultraLayout}>
          <div className={styles.badgeColumn}>
            <div className={`${styles.ultraBadge} ${styles.redBadge}`}>
              <img src={UCG_MAIN_IMG} alt="Ultra League" />
            </div>
            <div className={`${styles.ultraBadge} ${styles.whiteBadge}`}>
              <img src={UCG_CARDS_IMG} alt="Card Game" />
            </div>
          </div>
          <div className={styles.ultraDescriptionBox}>
            <div className={styles.innerArticle}>
              內文
            </div>
          </div>
          <div className={styles.ultraPosterFrame}>
            <img src={UCG_POST1_IMG} alt="Ultra Poster 1" />
            <img src={UCG_POST2_IMG} alt="Ultra Poster 2" />
          </div>
        </div>
      </section>

      {/* 4. 桌遊區塊 */}
      <section ref={boardGameRef} className={`${styles.serviceSection} ${styles.boardGameSection}`}>
        <div className={styles.logoCircle}>
          <img src={BOARDGAME_ICON} alt="Board Game Logo" />
        </div>
        <div className={styles.boardGameLayout}>
          <div className={styles.boxArtGrid}>
            <div className={styles.boxArt}>JPG</div>
            <div className={styles.boxArt}>JPG</div>
            <div className={styles.boxArt}>JPG</div>
            <div className={styles.boxArt}>JPG</div>
          </div>
          <div className={styles.boardGameDescription}>
            內文
          </div>
          <div className={styles.boxArtGrid}>
            <div className={styles.boxArt}>JPG</div>
            <div className={styles.boxArt}>JPG</div>
            <div className={styles.boxArt}>JPG</div>
            <div className={styles.boxArt}>JPG</div>
          </div>
        </div>
      </section>

      {/* 圖片放大彈窗 (Modal) */}
      {zoomImg && (
        <div className={styles.modalOverlay} onClick={() => setZoomImg(null)}>
          <div className={styles.closeBtn}>×</div>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={zoomImg} alt="Zoomed" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;