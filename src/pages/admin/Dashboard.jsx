import { Link } from 'react-router-dom'
import '../../styles/pages/admin/Dashboard.scss'

const quickLinks = [
  { to: '/admin/calendar', label: '行事曆', desc: '以月份管理行事曆圖片' },
  { to: '/admin/activity/news', label: '活動消息', desc: '店家活動消息編輯與圖片' },
  { to: '/admin/activity/competition', label: '比賽消息', desc: 'PTCG、超人力霸王、活動成果' },
  { to: '/admin/products/merchandise', label: '周邊商品', desc: '周邊商品管理' },
  { to: '/admin/products/boardgames', label: '桌遊', desc: '種類與租借價格規定' },
]

export function Dashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">松鼠窩後台</h1>
        <p className="dashboard-subtitle">請從左側選單或下方快速進入各功能。</p>
      </div>

      <div className="quick-links-grid">
        {quickLinks.map(({ to, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="quick-link-card"
          >
            <h2 className="card-title">{label}</h2>
            <p className="card-desc">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
