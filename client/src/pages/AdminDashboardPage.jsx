import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import ConfirmDialog from '@/components/ConfirmDialog'

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [confirmAction, setConfirmAction] = useState(null)

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

  const isPastDue = (booking) => {
  const bookingDateTime = new Date(`${booking.date.slice(0, 10)}T${booking.startTime}`)
  return bookingDateTime < new Date() && booking.status === 'CONFIRMED'
}

  const handleComplete = async (id) => {
    await fetch(`http://localhost:5000/api/bookings/${id}/complete`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    loadData()
  }

const handleNoShow = (id) => {
  setConfirmAction({ id, type: 'noshow' })
}

const handleCancel = (id) => {
  setConfirmAction({ id, type: 'cancel' })
}

const runConfirmedAction = async () => {
  const { id, type } = confirmAction
  const endpoint = type === 'noshow' ? 'no-show' : 'cancel'

  await fetch(`http://localhost:5000/api/bookings/${id}/${endpoint}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  loadData()
}

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
      <p className="text-slate-100">{b.customer ? b.customer.name : b.guestName} — {b.service.name}</p>
      <p className="text-slate-400 text-sm">{b.date.slice(0, 10)} at {b.startTime}</p>
        <p className="text-slate-500 text-xs mt-0.5">Code: <span className="font-mono text-slate-300">{b.otp}</span></p>
      <p className="text-slate-500 text-xs mt-0.5">
  Booked on {b.createdAt.slice(0, 10)} at {b.createdAt.slice(11, 16)}
</p>
      <div className="flex gap-2 mt-1 items-center">
        <Badge variant={
          b.status === 'CONFIRMED' ? 'default' :
          b.status === 'CANCELLED' ? 'destructive' :
          b.status === 'NO_SHOW' ? 'destructive' :
          'secondary'
        }>
          {b.status}
        </Badge>
        {isPastDue(b) && (
          <Badge variant="outline" className="text-amber-400 border-amber-600">Past Due</Badge>
        )}
      </div>
    </div>
    {b.status === 'CONFIRMED' && (
  <div className="flex gap-2">
    <button onClick={() => handleComplete(b.id)} className="bg-slate-700 text-slate-100 text-sm px-3 py-1.5 rounded hover:bg-slate-600">
      Mark Completed
    </button>
    <button onClick={() => handleNoShow(b.id)} className="bg-red-900 text-red-200 text-sm px-3 py-1.5 rounded hover:bg-red-800">
      Mark No-Show
    </button>
    <button onClick={() => handleCancel(b.id)} className="bg-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded hover:bg-slate-600">
      Cancel
    </button>
    <button onClick={() => handleCancel(b.id)} className="bg-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded hover:bg-slate-600">
  Cancel
</button>
  </div>
)}
  </div>
))}
    </div>
    <ConfirmDialog
  open={confirmAction !== null}
  onOpenChange={(open) => !open && setConfirmAction(null)}
  title={confirmAction?.type === 'noshow' ? 'Mark this booking as a no-show?' : 'Cancel this booking?'}
  description="This action cannot be undone."
  onConfirm={runConfirmedAction}
/>
  </div>
)
}

export default AdminDashboardPage