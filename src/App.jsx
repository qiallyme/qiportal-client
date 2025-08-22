import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Header from './components/Header.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute roleRequired="client">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roleRequired="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/cdn-cgi/access/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
