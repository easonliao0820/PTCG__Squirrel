import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import styles from '../styles/components/Layout.module.scss'

export default function Layout() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
