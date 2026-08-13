import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import ConfirmDialog from '@/components/ConfirmDialog'

function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)

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

const handleCancel = (id) => {
  setConfirmId(id)
}

const confirmCancel = async () => {
  const token = localStorage.getItem('token')
  await fetch(`http://localhost:5000/api/bookings/${confirmId}/cancel`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  loadBookings()
}

  if (loading) return <p>Loading your bookings...</p>

if (loading) return <p className="text-center mt-16 text-slate-400">Loading your bookings...</p>

return (
  <div className="max-w-2xl mx-auto px-6 py-12">
    <h1 className="text-2xl font-bold text-slate-100 mb-6">My Bookings</h1>
    {bookings.length === 0 && <p className="text-slate-400">You have no bookings yet.</p>}
    <div className="grid gap-3">
      {bookings.map(booking => (
        <div key={booking.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-slate-100 font-semibold">{booking.service.name}</h3>
            <p className="text-slate-400 text-sm">{booking.date.slice(0, 10)} at {booking.startTime}</p>
                <p className="text-slate-500 text-xs mt-0.5">Code: <span className="font-mono text-slate-300">{booking.otp}</span></p>
            <Badge variant={
  booking.status === 'CONFIRMED' ? 'default' :
  booking.status === 'CANCELLED' ? 'destructive' :
  'secondary'
}>
  {booking.status}
</Badge>
          </div>
          {booking.status === 'CONFIRMED' && (
            <button onClick={() => handleCancel(booking.id)} className="text-red-400 hover:underline text-sm">
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
    <ConfirmDialog
  open={confirmId !== null}
  onOpenChange={(open) => !open && setConfirmId(null)}
  title="Cancel this booking?"
  description="This action cannot be undone."
  onConfirm={confirmCancel}
/>
  </div>
)
}

export default MyBookingsPage