import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import ComponentsPage from './pages/ComponentsPage.jsx'
import NotFound from './components/NotFound.jsx'
import ChangeLog from './components/ChangeLog.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<ComponentsPage />} />
      <Route path="/changelog" element={<ChangeLog />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
