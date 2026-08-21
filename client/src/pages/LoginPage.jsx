import { API_URL } from '../config'
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

    const response = await fetch(`${API_URL}/api/auth/login`, {
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
    <div className="min-h-screen grid md:grid-cols-2 bg-black">
      <div className="relative bg-cover bg-center hidden md:block" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="flex flex-col justify-center px-8 md:px-16 py-16">
        <div className="max-w-sm mx-auto w-full">
          <p className="text-amber-400 tracking-[0.3em] text-xs font-medium text-center">WELCOME BACK</p>
          <h1 className="font-heading text-3xl font-bold text-white mt-3 text-center">Log In to Your Account</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">Sign in to manage your bookings and profile.</p>

          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-lg p-6 mt-8 flex flex-col gap-4">
            <div>
              <label className="text-white text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2.5 text-slate-100 mt-1.5 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2.5 text-slate-100 mt-1.5 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" className="bg-amber-400 text-black rounded px-4 py-3 font-medium hover:bg-amber-300 mt-1">
              Log In →
            </button>
          </form>

          <p className="text-slate-400 text-sm mt-6 text-center">
            Don't have an account? <Link to="/register" className="text-amber-400 hover:underline">Sign Up</Link>
          </p>

          <div className="grid grid-cols-3 gap-3 mt-10">
            <div className="text-center">
              <p className="text-amber-400 text-lg">🛡</p>
              <p className="text-white text-xs font-medium mt-1">Secure & Private</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Your data is safe with us</p>
            </div>
            <div className="text-center">
              <p className="text-amber-400 text-lg">📅</p>
              <p className="text-white text-xs font-medium mt-1">Easy Booking</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Book anytime, anywhere</p>
            </div>
            <div className="text-center">
              <p className="text-amber-400 text-lg">🕐</p>
              <p className="text-white text-xs font-medium mt-1">Manage Bookings</p>
              <p className="text-slate-500 text-[11px] mt-0.5">View or cancel with ease</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage