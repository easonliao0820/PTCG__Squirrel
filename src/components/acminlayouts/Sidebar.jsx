import { NavLink, useNavigate, Link } from 'react-router-dom'
import '../../styles/components/Sidebar.scss'

const nav = [
  {
    title: '基本資料',
    items: [
      { to: '/admin/calendar', label: '行事曆' },
    ],
  },
  {
    title: '活動',
    items: [
      { to: '/admin/activity/news', label: '活動/比賽消息' },
    ],
  },
  {
    title: '商品',
    items: [
      // { to: '/admin/products/merchandise', label: '周邊商品' },
      { to: '/admin/products/boardgames', label: '桌遊' },
      { to: '/admin/products/lapr', label: '劇本殺' },
    ],
  },
]

export function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    localStorage.removeItem('adminUser')
    onClose?.()
    navigate('/login')
  }

  return (
    <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/admin/dashboard" className="brand-link" onClick={() => onClose?.()}>
          松鼠窩後台
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        {nav.map((section) => (
          <div key={section.title} className="nav-section">
            <h2 className="section-title">
              {section.title}
            </h2>
            <ul className="nav-list">
              {section.items.map((item) => (
                <li key={item.to} className="nav-item">
                  <NavLink
                    to={item.to}
                    onClick={() => onClose?.()}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          登出
        </button>
        <Link to="/" className="home-link">
          回到首頁
        </Link>
      </div>
    </aside>
  )
}
