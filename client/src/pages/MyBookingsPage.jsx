import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import ConfirmDialog from '@/components/ConfirmDialog'

const TABS = ['Upcoming', 'Past', 'Cancelled']

function MyBookingsPage({ user }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Upcoming')
  const [confirmId, setConfirmId] = useState(null)

  const loadBookings = () => {
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/api/bookings/my`, {
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

  const confirmCancel = async () => {
    const token = localStorage.getItem('token')
    await fetch(`${API_URL}/api/bookings/${confirmId}/cancel`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    loadBookings()
  }

  const isPast = (booking) => {
    const dt = new Date(`${booking.date.slice(0, 10)}T${booking.startTime}`)
    return dt < new Date()
  }

  const filtered = bookings.filter(b => {
    if (activeTab === 'Cancelled') return b.status === 'CANCELLED'
    if (activeTab === 'Past') return b.status === 'COMPLETED' || b.status === 'NO_SHOW' || (b.status === 'CONFIRMED' && isPast(b))
    return b.status === 'CONFIRMED' && !isPast(b)
  })

  if (loading) return <p className="text-center mt-16 text-slate-400">Loading your bookings...</p>

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-sm">Welcome back,</p>
            <h1 className="font-heading text-3xl font-bold text-white">{user.name}</h1>
          </div>
          <Link to="/book" className="bg-amber-400 text-black px-4 py-2.5 rounded font-medium hover:bg-amber-300 text-sm">
            + New Booking
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="font-heading text-2xl font-bold text-white">My Bookings</h2>
          <p className="text-slate-500 text-sm mt-1">View and manage your upcoming and past appointments.</p>
        </div>

        <div className="flex gap-6 mt-6 border-b border-white/10">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'text-amber-400 border-amber-400' : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {filtered.length === 0 && (
            <p className="text-slate-500 text-center py-12">No bookings in this category.</p>
          )}

          {filtered.map(booking => (
            <div key={booking.id} className="bg-zinc-900 border border-white/10 rounded-lg p-5 flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                {booking.service?.imageUrl ? (
                  <img src={booking.service.imageUrl} alt={booking.service.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-400 text-2xl">✂</div>
                )}
              </div>

              <div className="flex-1">
                <Badge variant={
                  booking.status === 'CONFIRMED' ? 'default' :
                  booking.status === 'CANCELLED' ? 'destructive' : 'secondary'
                }>
                  {booking.status === 'CONFIRMED' && isPast(booking) ? 'PAST' : booking.status}
                </Badge>
                <h3 className="text-white font-semibold text-lg mt-2">{booking.service?.name}</h3>

                <div className="flex items-center gap-2 mt-2">
                  {booking.barber?.photoUrl ? (
                    <img src={booking.barber.photoUrl} alt={booking.barber.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-zinc-800" />
                  )}
                  <div>
                    <p className="text-white text-sm">{booking.barber?.name || 'No Preference'}</p>
                    {booking.barber && <p className="text-slate-500 text-xs">{booking.barber.title}</p>}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2 text-sm">
                <p className="text-slate-300 flex items-center gap-2">📅 {booking.date.slice(0, 10)}</p>
                <p className="text-slate-300 flex items-center gap-2">🕐 {booking.startTime}</p>
                <p className="text-slate-300 flex items-center gap-2">📍 Rijal's Handsome Parlor</p>
                <p className="text-slate-500 text-xs">Thamel, Kathmandu, Nepal</p>
              </div>

              <div className="flex flex-col gap-2 justify-center md:w-40 shrink-0">
                {booking.status === 'CONFIRMED' && !isPast(booking) && (
                  <button
                    onClick={() => setConfirmId(booking.id)}
                    className="border border-red-800 text-red-400 rounded px-3 py-2 text-sm hover:bg-red-950"
                  >
                    Cancel Booking
                  </button>
                )}
                {(booking.status === 'COMPLETED' || booking.status === 'NO_SHOW' || booking.status === 'CANCELLED') && (
                  <Link to="/book" className="border border-amber-400/40 text-amber-400 rounded px-3 py-2 text-sm hover:bg-amber-400 hover:text-black text-center">
                    Book Again
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-lg p-5 mt-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white font-medium">Need help with your booking?</p>
            <p className="text-slate-500 text-sm">We're here to help you.</p>
          </div>
          <Link to="/contact" className="border border-white/20 text-white px-4 py-2 rounded text-sm hover:border-amber-400 hover:text-amber-400">
            Contact Us
          </Link>
        </div>
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