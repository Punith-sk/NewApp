import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Community() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts')
      setPosts(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const handlePost = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setPosting(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/posts', { content })
      setContent('')
      setSuccess('Post shared!')
      fetchPosts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post')
    } finally {
      setPosting(false)
    }
  }

  const formatDate = (iso) => new Date(iso).toLocaleString()

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Community</h1>
        <p style={{ color: '#555' }}>Share your trading insights and strategies.</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Share a Post</h3>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handlePost}>
          <textarea
            rows="3"
            placeholder="What's your trading insight today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ resize: 'vertical' }}
          />
          <button className="btn btn-primary" type="submit" disabled={posting}>
            {posting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.map((post) => (
          <div className="card" key={post._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>{post.user?.name || 'Unknown'}</strong>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>{formatDate(post.createdAt)}</span>
            </div>
            <p style={{ margin: 0 }}>{post.content}</p>
          </div>
        ))
      )}

      {!loading && posts.length === 0 && (
        <div className="card"><p>No posts yet. Be the first to share!</p></div>
      )}
    </div>
  )
}
