import { Routes, Route, Navigate } from 'react-router-dom'
// 前台組件 (Layout & Pages)
import Layout from './components/Layout'
import Home from './pages/client/Home'
import BoardGames from './pages/client/BoardGames'
import Events from './pages/client/Events'
import Services from './pages/client/Services'

// 後台組件 (Layout & Pages)
import { AdminLayout } from './components/acminlayouts/AdminLayout'
import { Dashboard } from './pages/admin/Dashboard'
import { CalendarPage } from './pages/admin/calendar/CalendarPage'
import { ActivityNewsPage } from './pages/admin/activity/ActivityNewsPage'
import { CompetitionPage } from './pages/admin/activity/CompetitionPage' // 您上傳的檔案
import { MerchandisePage } from './pages/admin/products/MerchandisePage'
import { BoardGamesPage } from './pages/admin/products/BoardGamesPage'
import { CardsPage } from './pages/admin/products/CardsPage' // 您上傳的檔案

function App() {
  return (
    // <BrowserRouter>
      <Routes>
        {/* --- 前台路由區塊 --- */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="board_games" element={<BoardGames />} />
          <Route path="events" element={<Events />} />
          <Route path="services" element={<Services />} />
        </Route>

        {/* --- 後台路由區塊 (路徑前綴為 /admin) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* 進入 /admin 時自動轉跳到 dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<CalendarPage />} />
          
          {/* 活動管理子路徑 */}
          <Route path="activity">
            <Route path="news" element={<ActivityNewsPage />} />
            <Route path="competition" element={<CompetitionPage />} />
          </Route>
          
          {/* 商品管理子路徑 */}
          <Route path="products">
            <Route path="merchandise" element={<MerchandisePage />} />
            <Route path="boardgames" element={<BoardGamesPage />} />
            <Route path="cards" element={<CardsPage />} />
          </Route>
        </Route>

        {/* 全域防呆：找不到路徑時回首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    // </BrowserRouter>
  )
}

export default App