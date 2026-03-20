import styles from '../styles/components/Footer.module.scss'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* 左側：地址、電話、信箱 */}
        <div className={styles.footerLeft}>
          <p className={styles.footerLine}>
            <span className={styles.footerLabel}>地址</span> 松鼠窩桌遊館 · 三重區重新路一段 78 號 2 樓（捷運台北橋站步行約 2 分鐘）
          </p>
          <p className={styles.footerLine}>
            <span className={styles.footerLabel}>電話</span>{' '}
            <a href="tel:0229747867">(02) 2974-7867</a>
          </p>
          <p className={styles.footerLine}>
            <span className={styles.footerLabel}>信箱</span>{' '}
            <a href="mailto:boardgame.squirrel@gmail.com">boardgame.squirrel@gmail.com</a>
          </p>
          <p className={styles.copyright}>
            © {year} 窩作夥 · 保留一切權利
          </p>
        </div>

        {/* 右側：社群連結、蝦皮 */}
        <div className={styles.footerRight}>
          <div className={styles.socialLinks}>
            <a href="https://www.facebook.com/bg.squirrel/?locale=zh_TW" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>FB · 松鼠窩 桌遊聚會空間</a>
            <a href="https://www.facebook.com/p/%E6%9D%BE%E9%BC%A0%E7%AA%A9%E5%AF%B6%E5%8F%AF%E5%A4%A2%E9%81%93%E9%A4%A8%E7%AA%A9%E4%BD%9C%E5%A4%A5-61556917814247/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>FB · 松鼠窩寶可夢道館＆窩作夥</a>
            <a href="https://www.instagram.com/songshuwo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>IG · 松鼠窩寶可夢道館＆窩作夥</a>
          </div>
          <a
            href="https://shopee.tw/%E3%80%90%E7%AA%A9%E4%BD%9C%E5%A4%A5%E3%80%91RSS%E7%89%8C%E5%A5%97-65*90-%E5%AF%B6%E5%8F%AF%E5%A4%A2%E5%B0%88%E7%94%A8-%E7%AC%AC%E4%B8%80%E5%B1%A4%E5%8D%A1%E5%A5%97-65X90-%E4%BF%9D%E8%AD%B7%E5%A5%97-100%E5%BC%B5%E5%85%A5-%E5%AF%B6%E5%8F%AF%E5%A4%A2-PTCG-%E7%89%8C%E5%A5%97-%E5%8D%A1%E5%A5%97-i.4716388.5037608792"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shopeeLink}
          >
            蝦皮賣場 · 商品詳情
          </a>
        </div>
      </div>
    </footer>
  )
}
