import { useState, useEffect } from 'react'

function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:5000/api/dashboard/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-center mt-16 text-slate-400">Loading users...</p>

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Customers</h1>

      <div className="grid gap-4">
        {users.map(u => (
          <div key={u.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-slate-100 font-semibold">{u.name}</h3>
            <p className="text-slate-400 text-sm">{u.email}</p>
            <p className="text-slate-500 text-xs mt-1">
              {u.bookings.length} booking{u.bookings.length !== 1 ? 's' : ''}
            </p>

            {u.bookings.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {u.bookings.map(b => (
                  <div key={b.id} className="bg-slate-900 rounded p-2 text-sm">
                    <span className="text-slate-300">{b.service.name}</span>
                    <span className="text-slate-500"> — {b.date.slice(0, 10)} at {b.startTime} — {b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminUsersPage