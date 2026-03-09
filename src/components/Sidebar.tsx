import { NavLink } from 'react-router-dom'
import './Sidebar.scss'

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
      // 依據截圖，在側邊欄顯示為「活動/比賽消息」
      { to: '/admin/activity/news', label: '活動/比賽消息' },
    ],
  },
  {
    title: '商品',
    items: [
      { to: '/admin/products/merchandise', label: '周邊商品' },
      { to: '/admin/products/boardgames', label: '桌遊' },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <NavLink to="/admin/dashboard" className="brand-link">
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
    </aside>
  )
}
