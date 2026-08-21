import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const PAGE_SIZE = 8

function AdminUsersPage({ user, onLogout }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/api/dashboard/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  const now = new Date()
  const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const enrich = (u) => {
    const lastBooking = [...u.bookings].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    const hasUpcoming = u.bookings.some(b => b.status === 'CONFIRMED' && new Date(`${b.date.slice(0, 10)}T${b.startTime}`) >= now)
    const bookedRecently = u.bookings.some(b => new Date(b.createdAt) >= sixtyDaysAgo)
    const isActive = hasUpcoming || bookedRecently
    return { ...u, lastBooking, isActive }
  }

  const enriched = users.map(enrich)

  const totalClients = enriched.length
  const newThisMonth = enriched.filter(u => new Date(u.createdAt) >= startOfMonth).length
  const returning = enriched.filter(u => u.bookings.length > 1).length
  const totalBookings = enriched.reduce((sum, u) => sum + u.bookings.length, 0)
  const avgBookings = totalClients ? (totalBookings / totalClients).toFixed(1) : 0

  const filtered = enriched.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter === 'Active' && !u.isActive) return false
    if (statusFilter === 'Inactive' && u.isActive) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
        <div className="relative h-40 bg-cover bg-center flex items-end" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="relative p-6">
            <h1 className="font-heading text-2xl font-bold text-white">Clients</h1>
            <p className="text-slate-300 text-sm mt-1">Manage your clients and view their booking history.</p>
          </div>
        </div>

        <div className="p-6 pt-6">
          {loading ? (
            <p className="text-slate-400">Loading clients...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
                  <p className="text-slate-500 text-xs">Total Clients</p>
                  <p className="text-white text-2xl font-bold mt-1">{totalClients}</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
                  <p className="text-slate-500 text-xs">New Clients (This Month)</p>
                  <p className="text-white text-2xl font-bold mt-1">{newThisMonth}</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
                  <p className="text-slate-500 text-xs">Returning Clients</p>
                  <p className="text-white text-2xl font-bold mt-1">{returning}</p>
                  <p className="text-slate-600 text-xs">{totalClients ? Math.round((returning / totalClients) * 100) : 0}% of total</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
                  <p className="text-slate-500 text-xs">Avg. Bookings per Client</p>
                  <p className="text-white text-2xl font-bold mt-1">{avgBookings}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100 flex-1 min-w-[220px]"
                />
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100">
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-lg mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-amber-400 text-xs border-b border-white/10">
                      <th className="p-4">Client</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Total Bookings</th>
                      <th className="p-4">Last Visit</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map(u => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {u.photoUrl ? (
                              <img src={u.photoUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400 text-xs">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-white">{u.name}</p>
                              <p className="text-slate-500 text-xs">Joined {u.createdAt.slice(0, 10)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{u.email}</td>
                        <td className="p-4 text-slate-300">{u.bookings.length}</td>
                        <td className="p-4 text-slate-300">
                          {u.lastBooking ? (
                            <>{u.lastBooking.date.slice(0, 10)}<br /><span className="text-slate-500 text-xs">{u.lastBooking.startTime}</span></>
                          ) : '—'}
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {pageItems.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-500">No clients match your filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-slate-500 text-xs">
                  Showing {pageItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded border border-white/10 text-slate-300 text-sm disabled:opacity-30">‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`px-3 py-1.5 rounded text-sm ${page === n ? 'bg-amber-400 text-black' : 'border border-white/10 text-slate-300'}`}
                    >
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded border border-white/10 text-slate-300 text-sm disabled:opacity-30">›</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminUsersPage