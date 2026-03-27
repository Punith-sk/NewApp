import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '10px' }}>TradersHub</span>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/trading">Trading</Link>
      <Link to="/portfolio">Portfolio</Link>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/community">Community</Link>
      {user && (
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>{user.name} | ₹{Number(user.balance).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </span>
      )}
    </nav>
  )
}
