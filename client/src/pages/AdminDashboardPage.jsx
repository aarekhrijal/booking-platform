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

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div>
        <p>Total bookings: {stats.totalBookings}</p>
        <p>Pending: {stats.pendingBookings}</p>
        <p>Cancelled: {stats.cancelledBookings}</p>
        <p>Revenue: NPR {stats.revenue}</p>
      </div>

      <h2>All Bookings</h2>
      {bookings.map(b => (
        <div key={b.id}>
          <p>{b.customer.name} — {b.service.name}</p>
          <p>{b.date.slice(0, 10)} at {b.startTime} — {b.status}</p>
          {b.status === 'CONFIRMED' && (
            <button onClick={() => handleComplete(b.id)}>Mark Completed</button>
          )}
        </div>
      ))}
    </div>
  )
}

export default AdminDashboardPage