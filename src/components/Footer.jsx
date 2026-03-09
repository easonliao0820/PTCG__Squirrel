import styles from '../styles/components/Footer.module.scss'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.footerInfo}>
          <p className={styles.footerLine}>
            <span className={styles.footerLabel}>地址</span> 松鼠窩桌遊館 · 三重區重新路一段 78 號 2 樓（捷運台北橋站步行約 2 分鐘）
          </p>
          <p className={styles.footerLine}>
            <span className={styles.footerLabel}>電話</span>{' '}
            <a href="tel:0229747867">(02) 2974-7867</a>
            <span className={styles.footerLabel}>信箱</span>{' '}
            <a href="mailto:boardgame.squirrel@gmail.com">boardgame.squirrel@gmail.com</a>
          </p>
        </div>
        <a
          href="https://shopee.tw/%E3%80%90%E7%AA%A9%E4%BD%9C%E5%A4%A5%E3%80%91RSS%E7%89%8C%E5%A5%97-65*90-%E5%AF%B6%E5%8F%AF%E5%A4%A2%E5%B0%88%E7%94%A8-%E7%AC%AC%E4%B8%80%E5%B1%A4%E5%8D%A1%E5%A5%97-65X90-%E4%BF%9D%E8%AD%B7%E5%A5%97-100%E5%BC%B5%E5%85%A5-%E5%AF%B6%E5%8F%AF%E5%A4%A2-PTCG-%E7%89%8C%E5%A5%97-%E5%8D%A1%E5%A5%97-i.4716388.5037608792"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shopeeLink}
        >
          蝦皮賣場 · 商品詳情
        </a>
        <p className={styles.copyright}>
          © {year} 窩作夥 · 保留一切權利
        </p>
      </div>
    </footer>
  )
}
