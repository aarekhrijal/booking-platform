import { useState, useEffect } from 'react'

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])

  const token = localStorage.getItem('token')

  const loadData = () => {
    fetch('http://localhost:5000/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setStats)

    fetch('http://localhost:5000/api/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setBookings)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleComplete = async (id) => {
    await fetch(`http://localhost:5000/api/bookings/${id}/complete`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    loadData()
  }

  if (!stats) return <p>Loading dashboard...</p>

if (!stats) return <p className="text-center mt-16 text-slate-400">Loading dashboard...</p>

return (
  <div className="max-w-3xl mx-auto px-6 py-12">
    <h1 className="text-2xl font-bold text-slate-100 mb-6">Admin Dashboard</h1>

    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-400 text-sm">Total</p>
        <p className="text-slate-100 text-2xl font-bold">{stats.totalBookings}</p>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-400 text-sm">Pending</p>
        <p className="text-slate-100 text-2xl font-bold">{stats.pendingBookings}</p>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-400 text-sm">Cancelled</p>
        <p className="text-slate-100 text-2xl font-bold">{stats.cancelledBookings}</p>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-400 text-sm">Revenue</p>
        <p className="text-slate-100 text-2xl font-bold">NPR {stats.revenue}</p>
      </div>
    </div>

    <h2 className="text-lg font-semibold text-slate-100 mb-3">All Bookings</h2>
    <div className="grid gap-3">
      {bookings.map(b => (
        <div key={b.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-slate-100">{b.customer.name} — {b.service.name}</p>
            <p className="text-slate-400 text-sm">{b.date.slice(0, 10)} at {b.startTime} — {b.status}</p>
          </div>
          {b.status === 'CONFIRMED' && (
            <button onClick={() => handleComplete(b.id)} className="bg-slate-700 text-slate-100 text-sm px-3 py-1.5 rounded hover:bg-slate-600">
              Mark Completed
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
)
}

export default AdminDashboardPage