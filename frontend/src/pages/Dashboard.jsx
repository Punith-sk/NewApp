import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const [tradeCount, setTradeCount] = useState(0)
  const [portfolioValue, setPortfolioValue] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tradesRes, portfolioRes] = await Promise.all([
          api.get('/trades/my'),
          api.get('/portfolio')
        ])
        setTradeCount(tradesRes.data.length)
        setPortfolioValue(portfolioRes.data.totalCurrentValue)
      } catch {
        // silently fail on stats
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Welcome back, {user?.name}! 👋</h1>
        <p style={{ color: '#555' }}>Your virtual trading journey starts here. You have ₹1,00,000 to start with.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px' }}>Cash Balance</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50', margin: 0 }}>
            ₹{Number(user?.balance || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px' }}>Portfolio Value</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196F3', margin: 0 }}>
            ₹{portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px' }}>Total Trades</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF9800', margin: 0 }}>{tradeCount}</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/trading"><button className="btn btn-primary">Start Trading</button></Link>
          <Link to="/portfolio"><button className="btn btn-secondary">View Portfolio</button></Link>
          <Link to="/leaderboard"><button className="btn" style={{ background: '#FF9800', color: 'white' }}>Leaderboard</button></Link>
          <Link to="/community"><button className="btn" style={{ background: '#9C27B0', color: 'white' }}>Community</button></Link>
        </div>
      </div>
    </div>
  )
}
