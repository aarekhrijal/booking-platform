import { useState, useEffect } from 'react'

function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBookings = () => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:5000/api/bookings/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleCancel = async (id) => {
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:5000/api/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    loadBookings()
  }

  if (loading) return <p>Loading your bookings...</p>

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.length === 0 && <p>You have no bookings yet.</p>}
      {bookings.map(booking => (
        <div key={booking.id}>
          <h3>{booking.service.name}</h3>
          <p>{booking.date.slice(0, 10)} at {booking.startTime}</p>
          <p>Status: {booking.status}</p>
          {booking.status === 'CONFIRMED' && (
            <button onClick={() => handleCancel(booking.id)}>Cancel</button>
          )}
        </div>
      ))}
    </div>
  )
}

export default MyBookingsPage