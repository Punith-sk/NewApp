import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Trading from './pages/Trading'
import Portfolio from './pages/Portfolio'
import Leaderboard from './pages/Leaderboard'
import Community from './pages/Community'

const RootRedirect = () => {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/trading" element={<PrivateRoute><Trading /></PrivateRoute>} />
        <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
