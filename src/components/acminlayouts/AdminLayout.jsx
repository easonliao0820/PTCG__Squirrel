import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import '../../styles/components/AdminLayout.scss'

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
