import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard')
        setLeaders(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  if (loading) return <div className="container"><p>Loading leaderboard...</p></div>
  if (error) return <div className="container"><p className="error">{error}</p></div>

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>🏆 Leaderboard</h1>
        <p style={{ color: '#555' }}>Top traders ranked by profit percentage.</p>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Balance (₹)</th>
              <th>Portfolio Value (₹)</th>
              <th>Total Value (₹)</th>
              <th>Profit %</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, idx) => {
              const isCurrentUser = user && leader.id === user.id
              return (
                <tr
                  key={leader.id}
                  style={isCurrentUser ? { background: '#e8f5e9', fontWeight: 'bold' } : {}}
                >
                  <td>{idx + 1}</td>
                  <td>{leader.name}{isCurrentUser ? ' (You)' : ''}</td>
                  <td>{leader.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td>{leader.portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td>{leader.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className={leader.profitPct >= 0 ? 'profit' : 'loss'}>
                    {leader.profitPct >= 0 ? '+' : ''}{leader.profitPct}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
