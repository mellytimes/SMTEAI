import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import ComponentsPage from './pages/ComponentsPage.jsx'
import NotFound from './components/NotFound.jsx'
import ChangeLog from './components/ChangeLog.jsx'
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ComponentsPage />} />
        <Route path="/changelog" element={<ChangeLog />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SpeedInsights />
    </>
  )
}

export default App
