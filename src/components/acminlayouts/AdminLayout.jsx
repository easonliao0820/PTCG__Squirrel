import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import '../../styles/components/AdminLayout.scss'

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="admin-layout">
      {/* 遮罩，手機版點擊可關閉 */}
      {mobileOpen && (
        <div 
          className="admin-overlay" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      <main className="admin-main">
        {/* 手機版頂部欄位與切換按鈕 */}
        <header className="admin-top-bar">
          <button 
            className="menu-toggle" 
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰ 選單
          </button>
          <span className="top-bar-title">松鼠窩後台</span>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
