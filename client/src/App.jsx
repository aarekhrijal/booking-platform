import { useState, useEffect } from 'react'

function App() {
  const [mode, setMode] = useState('register') // 'register' or 'login'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const url = mode === 'register'
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login'

    const body = mode === 'register'
      ? { name, email, password }
      : { email, password }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.name}</h1>
        <p>Role: {user.role}</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    )
  }

  return (
    <div>
      <h1>{mode === 'register' ? 'Sign Up' : 'Log In'}</h1>

      <button onClick={() => setMode('register')}>Register</button>
      <button onClick={() => setMode('login')}>Log In</button>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          {mode === 'register' ? 'Register' : 'Log In'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default App