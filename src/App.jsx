import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BoardGames from './pages/BoardGames'
import Events from './pages/Events'
import Services from './pages/Services'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="board_gmaes" element={<BoardGames />} />
        <Route path="events" element={<Events />} />
        <Route path="services" element={<Services/>} />
      </Route>
    </Routes>
  )
}

export default App