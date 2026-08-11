import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function RegisterPage({ onAuth }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    onAuth(data)
    navigate('/')
  }

// RegisterPage.jsx — replace just the returned JSX
return (
  <div className="max-w-sm mx-auto px-6 py-16">
    <h1 className="text-2xl font-bold text-slate-100 mb-6">Sign Up</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 placeholder-slate-500"
      />
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
        Register
      </button>
    </form>
    {error && <p className="text-red-400 mt-3">{error}</p>}
    <p className="text-slate-400 mt-4 text-sm">
      Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Log in</Link>
    </p>
  </div>
)
}

export default RegisterPage