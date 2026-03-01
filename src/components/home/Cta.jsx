import styles from '../../styles/pages/home/Cta.module.scss'

export default function Cta() {
  return (
    <section className={styles.cta}>
      <h2 className={styles.ctaTitle}>歡迎來店</h2>
      <p className={styles.ctaText}>
        若有任何問題或想預約體驗，歡迎與我們聯絡，期待與您見面。
      </p>
    </section>
  )
}
