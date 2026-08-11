import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function LoginPage({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    onAuth(data)
    navigate('/')
  }

return (
  <div className="max-w-sm mx-auto px-6 py-16">
    <h1 className="text-2xl font-bold text-slate-100 mb-6">Log In</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 placeholder-slate-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 placeholder-slate-500"
      />
      <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-500 mt-2">
        Log In
      </button>
    </form>
    {error && <p className="text-red-400 mt-3">{error}</p>}
    <p className="text-slate-400 mt-4 text-sm">
      Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
    </p>
  </div>
)
}

export default LoginPage