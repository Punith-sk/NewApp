import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const STOCKS = [
  { symbol: 'AAPL', price: 175, name: 'Apple Inc.' },
  { symbol: 'GOOGL', price: 2800, name: 'Alphabet Inc.' },
  { symbol: 'MSFT', price: 380, name: 'Microsoft Corp.' },
  { symbol: 'TSLA', price: 250, name: 'Tesla Inc.' },
  { symbol: 'AMZN', price: 185, name: 'Amazon.com Inc.' },
  { symbol: 'RELIANCE', price: 2500, name: 'Reliance Industries' },
  { symbol: 'TCS', price: 3700, name: 'Tata Consultancy Services' },
  { symbol: 'INFY', price: 1500, name: 'Infosys Ltd.' },
  { symbol: 'HDFC', price: 1650, name: 'HDFC Bank' },
  { symbol: 'WIPRO', price: 450, name: 'Wipro Ltd.' },
]

export default function Trading() {
  const { user, updateBalance } = useAuth()
  const [quantities, setQuantities] = useState({})
  const [messages, setMessages] = useState({})

  const setQty = (symbol, value) => {
    setQuantities((prev) => ({ ...prev, [symbol]: value }))
  }

  const setMsg = (symbol, msg, type) => {
    setMessages((prev) => ({ ...prev, [symbol]: { msg, type } }))
    setTimeout(() => setMessages((prev) => ({ ...prev, [symbol]: null })), 3000)
  }

  const handleTrade = async (symbol, type) => {
    const qty = parseInt(quantities[symbol] || '0')
    if (!qty || qty <= 0) {
      setMsg(symbol, 'Enter a valid quantity', 'error')
      return
    }
    try {
      const res = await api.post(`/trades/${type}`, { symbol, quantity: qty })
      updateBalance(res.data.balance)
      setMsg(symbol, res.data.message, 'success')
      setQty(symbol, '')
    } catch (err) {
      setMsg(symbol, err.response?.data?.message || 'Trade failed', 'error')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Trading</h1>
        <p>Cash Balance: <strong>₹{Number(user?.balance || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></p>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th>Price (₹)</th>
              <th>Quantity</th>
              <th>Actions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {STOCKS.map(({ symbol, price, name }) => (
              <tr key={symbol}>
                <td><strong>{symbol}</strong></td>
                <td>{name}</td>
                <td>₹{price.toLocaleString('en-IN')}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    style={{ width: '80px', marginBottom: 0 }}
                    value={quantities[symbol] || ''}
                    onChange={(e) => setQty(symbol, e.target.value)}
                    placeholder="Qty"
                  />
                </td>
                <td style={{ display: 'flex', gap: '8px', paddingTop: '12px' }}>
                  <button className="btn btn-primary" onClick={() => handleTrade(symbol, 'buy')}>Buy</button>
                  <button className="btn btn-danger" onClick={() => handleTrade(symbol, 'sell')}>Sell</button>
                </td>
                <td>
                  {messages[symbol] && (
                    <span className={messages[symbol].type === 'error' ? 'error' : 'success'}>
                      {messages[symbol].msg}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
