import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Portfolio() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/portfolio')
        setData(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load portfolio')
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  if (loading) return <div className="container"><p>Loading portfolio...</p></div>
  if (error) return <div className="container"><p className="error">{error}</p></div>

  const { holdings, totalInvestment, totalCurrentValue, totalPnL } = data

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>My Portfolio</h1>
      </div>

      {holdings.length === 0 ? (
        <div className="card"><p>No holdings yet. Start trading to build your portfolio!</p></div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Avg Price (₹)</th>
                <th>Current Price (₹)</th>
                <th>Investment (₹)</th>
                <th>Current Value (₹)</th>
                <th>P&amp;L (₹)</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.symbol}>
                  <td><strong>{h.symbol}</strong></td>
                  <td>{h.quantity}</td>
                  <td>{h.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td>{h.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td>{h.investment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td>{h.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className={h.pnl >= 0 ? 'profit' : 'loss'}>
                    {h.pnl >= 0 ? '+' : ''}{h.pnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 'bold', borderTop: '2px solid #333' }}>
                <td colSpan="4">Total</td>
                <td>{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td>{totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td className={totalPnL >= 0 ? 'profit' : 'loss'}>
                  {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
