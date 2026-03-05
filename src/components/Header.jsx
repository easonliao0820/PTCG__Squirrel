import { Link } from 'react-router-dom'
import styles from '../styles/components/Header.module.scss'

const navItems = [
  { to: '/', label: '首頁', type: 'route' },
  { to: '/services', label: '服務介紹', type: 'route' },
  { to: '/events', label: '活動排程', type: 'route' },
  { to: '/board_gmaes', label: '桌遊品項', type: 'route' },
  { to: '/schedule', label: '販售周邊', type: 'route' },
]

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src="/images/logo-wozuoguo.png" alt="窩作夥" className={styles.logoImg} />
          <span>窩作夥</span>
        </Link>
        <nav className={styles.nav}>
          {navItems.map(({ to, label, type }) =>
            type === 'anchor' ? (
              <a key={to} href={to} className={styles.navLink}>
                {label}
              </a>
            ) : (
              <Link key={to} to={to} className={styles.navLink}>
                {label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
