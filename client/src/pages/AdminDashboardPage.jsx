import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import AdminLayout from '../components/AdminLayout'

function AdminDashboardPage({ user, onLogout }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/api/dashboard/overview`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) {
    return (
      <AdminLayout user={user} onLogout={onLogout}>
        <p className="text-slate-400 p-6">Loading dashboard...</p>
      </AdminLayout>
    )
  }

  const Trend = ({ pct }) => (
    <span className={pct >= 0 ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
      {pct >= 0 ? '▲' : '▼'} {Math.abs(pct)}%
    </span>
  )

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
  <div className="relative h-40 bg-cover bg-center flex items-end" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
    <div className="relative p-6">
      <h1 className="font-heading text-2xl font-bold text-white">Welcome back, {user.name} 👋</h1>
      <p className="text-slate-300 text-sm mt-1">Here's what's happening at Rijal's Handsome Parlor today.</p>
    </div>
  </div>

  <div className="p-6 pt-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
            <p className="text-slate-500 text-xs">Total Bookings</p>
            <p className="text-white text-2xl font-bold mt-1">{data.totalBookings}</p>
            <Trend pct={data.bookingsChangePct} />
            <span className="text-slate-600 text-xs"> vs last week</span>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
            <p className="text-slate-500 text-xs">Total Clients</p>
            <p className="text-white text-2xl font-bold mt-1">{data.totalClients}</p>
            <Trend pct={data.clientsChangePct} />
            <span className="text-slate-600 text-xs"> vs last week</span>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
            <p className="text-slate-500 text-xs">Active Barbers</p>
            <p className="text-white text-2xl font-bold mt-1">{data.activeBarbers} / {data.totalBarbers}</p>
            <span className="text-slate-600 text-xs">{data.activeBarbers === data.totalBarbers ? 'All available' : 'Some inactive'}</span>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
            <p className="text-slate-500 text-xs">Avg. Rating</p>
            <p className="text-white text-2xl font-bold mt-1">{data.avgRating} / 5</p>
            <span className="text-slate-600 text-xs">Across active barbers</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Chart */}
          <div className="md:col-span-2 bg-zinc-900 border border-white/10 rounded-lg p-5">
            <h2 className="text-white font-semibold">Bookings Overview</h2>
            <p className="text-slate-500 text-xs mb-4">Last 7 days</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.dailyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="label" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Upcoming bookings */}
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold">Upcoming Bookings</h2>
              <Link to="/admin/bookings" className="text-amber-400 text-xs hover:underline">View All →</Link>
            </div>
            <div className="flex flex-col gap-4">
              {data.upcomingBookings.length === 0 && <p className="text-slate-500 text-sm">Nothing upcoming.</p>}
              {data.upcomingBookings.map(b => (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{b.customer ? b.customer.name : b.guestName}</p>
                    <p className="text-slate-500 text-xs">{b.service.name}</p>
                    <p className="text-slate-600 text-xs">{b.date.slice(0, 10)} · {b.startTime}</p>
                  </div>
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full shrink-0">Confirmed</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Recent bookings table */}
          <div className="md:col-span-1 bg-zinc-900 border border-white/10 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-amber-400 text-xs hover:underline">View All →</Link>
            </div>
            <div className="flex flex-col gap-3">
              {data.recentBookings.map(b => (
                <div key={b.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-white">{b.customer ? b.customer.name : b.guestName}</p>
                    <p className="text-slate-500 text-xs">{b.service.name} — {b.date.slice(0, 10)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    b.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                    b.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-700 text-slate-300'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular services */}
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4">Popular Services</h2>
            <div className="flex flex-col gap-3">
              {data.popularServices.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{s.name}</span>
                    <span className="text-slate-500">{s.percent}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
            <div className="flex flex-col gap-4">
              {data.activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-amber-400">{a.type === 'booking' ? '📅' : '👤'}</span>
                  <div>
                    <p className="text-slate-300 text-sm">{a.text}</p>
                    <p className="text-slate-600 text-xs">{new Date(a.time).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
            </div>

    </AdminLayout>
  )
}

export default AdminDashboardPage