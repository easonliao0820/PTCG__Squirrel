import styles from '../../styles/pages/home/Intro.module.scss';

const Intro = () => {
  return (
    <section className={styles.intro}>
      <div className={styles.container}>
        {/* 上半部：斜切圖 + 標題與內文 */}
        <div className={styles.topRow}>
          {/* 左側：斜對切圖片 */}
          <div className={styles.diagonalGrid}>
            <div className={styles.imageOne}>
              <img src="/images/location/env-1.png" alt="店內環境1" />
            </div>
            <div className={styles.imageTwo}>
              <img src="/images/location/env-2.png" alt="店內環境2" />
            </div>
          </div>

          {/* 右側：標題與大方塊 */}
          <div className={styles.content}>
            <h3 className={styles.sectionTitle}>店內風格與氛圍</h3>
            <div className={styles.descriptionBox}>
              <p>
                這裡不僅僅是卡牌店，更是玩家們的第二個家。
                我們營造了舒適的對戰空間，配備專業的照明與寬敞的桌面，
                讓每一場對局都能在最棒的氛圍下進行。
              </p>
            </div>
            {/* 下半部：三連小圖 */}
            <div className={styles.bottomRow}>
              <div className={styles.smallImgBox}>
                <img src="/images/location/env-3.png" alt="環境3" />
              </div>
              <div className={styles.smallImgBox}>
                <img src="/images/location/env-4.png" alt="環境4" />
              </div>
              <div className={styles.smallImgBox}>
                <img src="/images/location/env-4.png" alt="環境5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;