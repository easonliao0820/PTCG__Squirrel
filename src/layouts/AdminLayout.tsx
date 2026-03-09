import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-stone-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8 lg:p-12">
        <div className="max-w-5xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
