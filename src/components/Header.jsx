import { Link } from 'react-router-dom'
import styles from '../styles/components/Header.module.scss'

const navItems = [
  { to: '/', label: '首頁', type: 'route' },
  { to: '/services', label: '服務介紹', type: 'route' },
  { to: '/events', label: '所有活動', type: 'route' },
  { to: '/calendar', label: '歷年行事曆', type: 'route' },
  { to: '/playpage', label: '遊玩品項', type: 'route' },
  { to: '/login', label: '管理登入', type: 'route' },
]

export default function Header() {
  const isAuthenticated = localStorage.getItem('adminSession') === 'true'
  const adminUser = localStorage.getItem('adminUser') || '管理員'

  const finalNavItems = navItems.map(item => {
    if (item.to === '/login' && isAuthenticated) {
      return { ...item, to: '/admin/dashboard', label: `${adminUser}管理` }
    }
    return item
  })

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src="/images/logo-squirrel-detective.png" alt="窩作夥" className={styles.logoImg} />
          <span>窩作夥</span>
        </Link>
        <nav className={styles.nav}>
          {finalNavItems.map(({ to, label, type }) => {
            const isLoginBtn = to === '/login' || to === '/admin/dashboard'
            const linkClass = isLoginBtn ? `${styles.navLink} ${styles.loginBtn}` : styles.navLink
            
            return type === 'anchor' ? (
              <a key={to} href={to} className={linkClass}>
                {label}
              </a>
            ) : (
              <Link key={to} to={to} className={linkClass}>
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
