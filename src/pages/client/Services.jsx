import React, { useRef, useState, useEffect } from 'react';
import styles from '../../styles/pages/Services.module.scss';

// 咖啡
const COFFEE_ICON = '/images/icon/coffee_LOGO.png';
const COFFEE_MENU1 = '/images/location/menu.jpg';
const COFFEE_MENU2 = '/images/location/menu2.jpg';
const FOOD_IMG1 = '/images/allofservice/food1.png';
const FOOD_IMG2 = '/images/allofservice/food2.png';
const FOOD_IMG3 = '/images/allofservice/food3.png';
const FOOD_IMG4 = '/images/allofservice/food4.png';
// 寶可夢
const PTCG_ICON = '/images/icon/ptcg_LOGO.png';
const DEFAULT_IMG = '/images/pokemon/turtwig.png';
const TURTWING_IMG = '/images/pokemon/turtwig.png';
const PIKACHU_IMG = '/images/pokemon/pikachu.png';
const EEVEE_IMG = '/images/pokemon/eevee.png';
const MIMIKYU_IMG = '/images/pokemon/mimikyu.png';
const WHIMSICOTT_IMG = '/images/pokemon/whimsicott.png';

const PTCG_IMAGES = [
  '/images/allofservice/pokemon_1.jpg',
  '/images/allofservice/pokemon_2.jpg',
  '/images/allofservice/pokemon_3.jpg',
  '/images/allofservice/pokemon_4.jpg',
  '/images/allofservice/pokemon_5.jpg',
  '/images/allofservice/pokemon_6.jpg',
  '/images/allofservice/pokemon_7.jpg',
  '/images/allofservice/pokemon_8.jpg',
];
// 超人力霸王
const UCG_ICON = '/images/icon/ucg_LOGO.png';
const UCG_MAIN_IMG = '/images/location/ultraman_main.png';
const UCG_POST1_IMG = '/images/location/ultraman_post1.jpg';
const UCG_POST2_IMG = '/images/location/ultraman_post2.jpg';
const UCG_CARDS_IMG = '/images/location/ultraman_cards.jpg';
// 桌遊
const BOARDGAME_ICON = '/images/icon/tablegame_LOGO.png';
const BOARDGAME_IMG1 = '/images/allofservice/boardgame1.jpeg';
const BOARDGAME_IMG2 = '/images/allofservice/boardgame2.jpeg';
const BOARDGAME_IMG3 = '/images/allofservice/boardgame3.jpeg';
const BOARDGAME_IMG4 = '/images/allofservice/boardgame4.jpg';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('ptcg');
  const [zoomImg, setZoomImg] = useState(null);
  const [latestCalendar, setLatestCalendar] = useState(null);

  useEffect(() => {
    const fetchLatestCalendar = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/calendar');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // 排序找最新年份與月份
            const sorted = data.sort((a, b) => {
              if (b.year !== a.year) return b.year - a.year;
              return b.month - a.month;
            });
            setLatestCalendar(sorted[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch calendar:', error);
      }
    };
    fetchLatestCalendar();
  }, []);

  const coffeeRef = useRef(null);
  const ptcgRef = useRef(null);
  const ultraRef = useRef(null);
  const boardGameRef = useRef(null);

  const categories = [
    { name: 'PTCG', ref: ptcgRef, id: 'ptcg' },
    { name: '咖啡餐飲', ref: coffeeRef, id: 'coffee' },
    { name: '超人力霸王', ref: ultraRef, id: 'ultra' },
    { name: '桌遊/劇本殺', ref: boardGameRef, id: 'boardgame' }
  ];

  const scrollToSection = (category) => {
    setActiveCategory(category.id);
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
            className={`${styles.filterBtn} ${styles[cat.id]} ${activeCategory === cat.id ? styles.active : ''}`}
            onClick={() => scrollToSection(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <section ref={ptcgRef} className={`${styles.serviceSection} ${styles.ptcgSection}`}>
        <div className={styles.logoCircle}>
          <img src={PTCG_ICON} alt="PTCG Logo" />
        </div>

        <div className={styles.ptcgTopLayout}>
          <div className={styles.leftCol}>
            <div className={styles.ptcgArticleBox}>
              <div className={styles.articleContent}>
                <p>
                  松鼠窩桌遊館是各位訓練家的冒險起點！我們是官方認證的 PTCG 教室/道館，致力於打造一個集結熱情與交流的高品質空間。現場備有最新的牌組擴充包、豐富的單卡收藏與精美周邊，滿足您的各項需求。
                </p>
                <p>
                  不論您是想從零開始學習的新手，或是追求更高層次對戰的高手，都能在此享受最純粹的對戰樂趣。誠摯邀請各位訓練家加入我們的行列，與志同道合的同好開啟冒險！
                </p>
                <p>
                   此外，松鼠窩會不定期舉辦各類型的精彩活動與賽事，熱情的老闆總是會想方設法「激發大家的戰鬥欲」，準備驚喜與挑戰讓每一場對局都熱血沸騰！千萬別錯過這些充滿樂趣與熱血的時刻！
                </p>
                <p>
                  現場更有提供「牌組租借服務」，就算沒帶牌或是想嘗試不同打法的玩家，都能在此隨時開啟一場精彩的對局！
                </p>
              </div>
            </div>
          </div>
          <div className={styles.rightCol}>
            <div className={styles.squareCarousel}>
              <img 
                src={latestCalendar ? latestCalendar.imageUrl : DEFAULT_IMG} 
                alt="Latest Calendar" 
                onClick={() => setZoomImg(latestCalendar ? latestCalendar.imageUrl : DEFAULT_IMG)}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title="點擊放大觀看最新行事曆"
              />
            </div>
            <div className={styles.mascotRow}>
              <img src={EEVEE_IMG} alt="Eevee" />
              <img src={WHIMSICOTT_IMG} alt="Whimsicott" />
              <img src={MIMIKYU_IMG} alt="Mimikyu" />
              <img src={TURTWING_IMG} alt="Turtwig" />
              <img src={PIKACHU_IMG} alt="Pikachu" />
            </div>
          </div>
        </div>

        <div className={styles.cardShowcaseGrid}>
          {PTCG_IMAGES.map((img, i) => (
            <div key={i} className={styles.cardItem} onClick={() => setZoomImg(img)}>
               <img src={img} alt={`Pokemon Card ${i + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <section ref={boardGameRef} className={`${styles.serviceSection} ${styles.boardGameSection}`}>
        <div className={styles.logoCircle}>
          <img className={styles.logoCircleImg} src={BOARDGAME_ICON} alt="Board Game Logo" />
        </div>
        <div className={styles.boardGameLayout}>
          <div className={styles.boxArtGrid}>
            <div className={`${styles.boxArt} ${styles.zoomable}`} onClick={() => setZoomImg(BOARDGAME_IMG1)}>
              <img src={BOARDGAME_IMG1} alt="Board Game 1" />
            </div>
            <div className={`${styles.boxArt} ${styles.zoomable}`} onClick={() => setZoomImg(BOARDGAME_IMG2)}>
              <img src={BOARDGAME_IMG3} alt="Board Game 3" />
            </div>
          </div>

          <div className={styles.boardGameDescription}>
            <article className={styles.descText}>
              <p>
                松鼠窩嚴選百款國內外熱門桌遊與多部優質劇本殺，從輕鬆上手的派對遊戲、深情動人的情感劇本到燒腦的推理機制，滿足各種年齡層與聚會需求。無論是假日好友齊聚切磋，或是想體驗不同人生的沉浸式劇場，您都能在這裡找到專屬的樂趣。
              </p>
              <p>
                我們提供舒適寬敞的遊玩空間與專業的教學服務，即便從未接觸過桌遊或劇本殺，也能在我們的引導下快速投入。現場更支援各項活動包場預約，致力於打造一個讓每位玩家都能暫時忘卻煩惱、流連忘返的休閒聖地！
              </p>
              <p>
                建議來電預約，以確保有足夠的座位與人員服務，如有需要我們也歡迎預約包場!
              </p>
            </article>
          </div>

          <div className={styles.boxArtGrid}>
            <div className={`${styles.boxArt} ${styles.zoomable}`} onClick={() => setZoomImg(BOARDGAME_IMG3)}>
              <img src={BOARDGAME_IMG2} alt="Board Game 2" />
            </div>
            <div className={`${styles.boxArt} ${styles.zoomable}`} onClick={() => setZoomImg(BOARDGAME_IMG4)}>
              <img src={BOARDGAME_IMG4} alt="Board Game 4" />
            </div>
          </div>
        </div>
      </section>

      <section ref={coffeeRef} className={`${styles.serviceSection} ${styles.coffeeSection}`}>
        <div className={styles.logoCircle}>
          <img src={COFFEE_ICON} alt="Coffee Logo" />
        </div>
        <div className={styles.coffeeGrid}>
          <div className={`${styles.gridItem} ${styles.zoomable}`} onClick={() => setZoomImg(COFFEE_MENU1)}>
            <img src={COFFEE_MENU1} alt="Menu 1" />
          </div>
          <div className={`${styles.gridItem} ${styles.textItem}`}>
            <article className={styles.descText}>
              <p>
                松鼠窩提供咖啡與各式飲料，讓您在沈浸於桌遊對戰的同時，也能品嚐到豐富的飲品。
              </p>
              <p>
                此外，現場備有現烤輕食與多款點心，無論是解饞的小點心還是飽腹的套餐，我們會為每位冒險者提供美味的能量補給！
              </p>
            </article>
          </div>
          <div className={`${styles.gridItem} ${styles.rowSpan2} ${styles.zoomable}`} onClick={() => setZoomImg(COFFEE_MENU2)}>
            <img src={COFFEE_MENU2} alt="Menu 2" />
          </div>
          <div className={styles.splitSubGrid}>
            <div className={styles.gridItem}>
              <img src={FOOD_IMG3} alt="Food 3" />
            </div>
            <div className={styles.gridItem}>
              <img src={FOOD_IMG4} alt="Food 4" />
            </div>
          </div>
          <div className={styles.splitSubGrid}>
            <div className={styles.gridItem}>
              <img src={FOOD_IMG1} alt="Food 1" />
            </div>
            <div className={styles.gridItem}>
              <img src={FOOD_IMG2} alt="Food 2" />
            </div>
          </div>
        </div>
      </section>

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
            <article className={styles.descText}>
              <p>
                《超人力霸王集換式卡牌遊戲》是一款將經典特攝英雄與現代卡牌策略完美結合的競技遊戲。玩家將扮演守護宇宙的指揮官，呼喚歷代強大的超人力霸王，透過獨特的攻防系統與技能發動，在卡牌對戰中還原影視作品般的史詩對決。
              </p>
              <p>
                松鼠窩有超人力霸王卡牌文化，會不定期舉辦官方認證賽事與新手交流會。我們誠摯邀請各位卡友一同前來切磋技藝，在熱鬧的氛圍中感受跨越時空的英雄魅力！
              </p>
            </article>
          </div>
          <div className={styles.ultraPosterFrame}>
            <img src={UCG_POST1_IMG} alt="Ultra Poster 1" />
            <img src={UCG_POST2_IMG} alt="Ultra Poster 2" />
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