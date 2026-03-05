import React, { useRef, useState } from 'react';
import styles from '../styles/pages/Services.module.scss';

const DEFAULT_IMG = '/images/location/turtwig.png';
const COFFEE_ICON = '/images/icon/coffee_LOGO.png';
const PTCG_ICON = '/images/icon/ptcg_LOGO.png';
const UCG_ICON = '/images/icon/ucg_LOGO.png'; // 超人力霸王
const BOARDGAME_ICON = '/images/icon/tablegame_LOGO.png';
const MAIN_MASCOT = '/images/logo-squirrel-detective.png';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('咖啡餐飲');

  const coffeeRef = useRef(null);
  const ptcgRef = useRef(null);
  const ultraRef = useRef(null);
  const boardGameRef = useRef(null);

  const categories = [
    { name: '咖啡餐飲', ref: coffeeRef },
    { name: 'PTCG', ref: ptcgRef },
    { name: '超人力霸王', ref: ultraRef },
    { name: '桌遊', ref: boardGameRef }
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
            className={`${styles.filterBtn} ${activeCategory === cat.name ? styles.active : ''}`}
            onClick={() => scrollToSection(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 1. 咖啡區塊 */}
      <section ref={coffeeRef} className={`${styles.serviceSection} ${styles.coffeeSection}`}>
        <div className={styles.logoCircle}>
          <img src={COFFEE_ICON} alt="Coffee Logo" />
        </div>
        <div className={styles.coffeeGrid}>
          <div className={styles.gridItem}>
            <img src={DEFAULT_IMG} alt="Menu 1" />
          </div>
          <div className={styles.gridItem}>
            <div className={styles.placeholderBox}>內文</div>
          </div>
          <div className={`${styles.gridItem} ${styles.rowSpan2}`}>
            <img src={DEFAULT_IMG} alt="Vertical Menu" />
          </div>
          <div className={styles.gridItem}>
            <div className={styles.placeholderBox}>內文</div>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.placeholderBox}>內文</div>
          </div>
        </div>
      </section>

      {/* 2. PTCG 區塊 */}
      <section ref={ptcgRef} className={`${styles.serviceSection} ${styles.ptcgSection}`}>
        <div className={styles.logoCircle}>
          <img src={PTCG_ICON} alt="PTCG Logo" />
        </div>

        <div className={styles.mascotHeader}>
          <div className={styles.yellowCircle}>
            <img src={MAIN_MASCOT} alt="PTCG Main" />
          </div>
          <img src={DEFAULT_IMG} alt="Eevee" className={styles.eevee} />
          <img src={DEFAULT_IMG} alt="Pikachu" className={styles.pikachu} />
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
              <img src={DEFAULT_IMG} alt="Whimsicott" />
              <img src={DEFAULT_IMG} alt="Mimikyu" />
              <img src={DEFAULT_IMG} alt="Turtwig" />
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

      {/* 3. 超人力霸王區塊 */}
      <section ref={ultraRef} className={`${styles.serviceSection} ${styles.ultraSection}`}>
        <div className={styles.ultraLogoOverlay}>
          <img src={UCG_ICON} alt="Ultra Logo" />
        </div>
        <div className={styles.ultraLayout}>
          <div className={styles.badgeColumn}>
            <div className={`${styles.ultraBadge} ${styles.redBadge}`}>
              <img src={DEFAULT_IMG} alt="Ultra League" />
            </div>
            <div className={`${styles.ultraBadge} ${styles.whiteBadge}`}>
              <img src={DEFAULT_IMG} alt="Card Game" />
            </div>
          </div>
          <div className={styles.ultraDescriptionBox}>
            <div className={styles.innerArticle}>
              內文
            </div>
          </div>
          <div className={styles.ultraPosterFrame}>
            <img src={DEFAULT_IMG} alt="Ultra Poster" />
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
    </div>
  );
};

export default Services;