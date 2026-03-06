import styles from '../../styles/components/home/Cta.module.scss';

export default function Cta() {
  return (
    <section className={styles.cta}>
      <p className={styles.ctaText}>
        若有任何問題或想預約體驗，歡迎與我們聯絡，期待與您見面。
      </p>
      <div className={styles.links}>
        <a href="https://www.facebook.com/bg.squirrel/?locale=zh_TW" target="_blank" rel="noopener noreferrer">FB :松鼠窩 桌遊聚會空間</a>
        <a href="https://www.facebook.com/p/%E6%9D%BE%E9%BC%A0%E7%AA%A9%E5%AF%B6%E5%8F%AF%E5%A4%A2%E9%81%93%E9%A4%A8%E7%AA%A9%E4%BD%9C%E5%A4%A5-61556917814247/" target="_blank" rel="noopener noreferrer">FB :松鼠窩寶可夢道館&窩作夥</a>
        <a href="https://www.instagram.com/songshuwo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">IG :松鼠窩寶可夢道館&窩作夥</a>
      </div>
    </section>
  )
}
