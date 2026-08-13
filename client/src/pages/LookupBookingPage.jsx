import { useState } from 'react'
import ConfirmDialog from '@/components/ConfirmDialog'

function LookupBookingPage() {
  const [otp, setOtp] = useState('')
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [cancelled, setCancelled] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleLookup = async (e) => {
    e.preventDefault()
    setError('')
    setBooking(null)

    const response = await fetch('http://localhost:5000/api/bookings/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp })
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    setBooking(data)
  }

const handleCancel = () => {
  setConfirmOpen(true)
}

const confirmCancel = async () => {
  const response = await fetch('http://localhost:5000/api/bookings/lookup/cancel', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp })
  })

  const data = await response.json()

  if (!response.ok) {
    setError(data.error)
    return
  }

  setBooking(data)
  setCancelled(true)
}

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Find My Booking</h1>
      <p className="text-slate-400 text-sm mb-6">
        Enter your booking code and the email you booked with.
      </p>

      <form onSubmit={handleLookup} className="flex flex-col gap-3">
  <input
    placeholder="Booking Code (e.g. 123456)"
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
    className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
  />
  <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-500">
    Find Booking
  </button>
</form>

      {error && <p className="text-red-400 mt-3">{error}</p>}

      {booking && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-6">
          <h3 className="text-slate-100 font-semibold">{booking.service?.name}</h3>
          <p className="text-slate-400 text-sm">{booking.date.slice(0, 10)} at {booking.startTime}</p>
          <p className="text-slate-300 text-sm mt-1">Status: {booking.status}</p>

          {booking.status === 'CONFIRMED' && !cancelled && (
            <button
              onClick={handleCancel}
              className="mt-4 bg-red-900 text-red-200 text-sm px-3 py-1.5 rounded hover:bg-red-800"
            >
              Cancel This Booking
            </button>
          )}
        </div>
      )}
      <ConfirmDialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title="Cancel this booking?"
  description="This action cannot be undone."
  onConfirm={confirmCancel}
/>
    </div>
  )
}

export default LookupBookingPage