import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

function LookupBookingPage() {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [cancelled, setCancelled] = useState(false)
  const inputRefs = useRef([])

  const otp = digits.join('')

  const handleDigitChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return

    const newDigits = [...digits]
    newDigits[index] = value
    setDigits(newDigits)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
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

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return

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

  const bookingId = booking ? `#RHP-${booking.id.toString().padStart(4, '0')}` : ''

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left: hero + OTP entry */}
      <div className="relative bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative px-8 py-16 md:px-16 w-full">
          <span className="inline-block border border-amber-400/40 text-amber-400 text-xs tracking-[0.2em] px-3 py-1 rounded-full">
            FIND MY BOOKING
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-6">Find Your Booking</h1>
          <p className="text-slate-400 mt-4">
            Enter the booking code you received when you booked your appointment.
          </p>

          <div className="bg-zinc-900/80 border border-white/10 rounded-lg p-6 mt-8">
            <h3 className="text-white font-semibold">Enter Code</h3>
            <p className="text-slate-500 text-sm mt-1">We showed you a 6-digit code when you booked.</p>

            <div className="flex gap-2 mt-4">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl bg-zinc-950 border border-white/20 rounded text-white focus:border-amber-400 focus:outline-none"
                />
              ))}
            </div>

            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

            <button
              onClick={handleVerify}
              disabled={otp.length !== 6}
              className="w-full bg-amber-400 text-black rounded px-4 py-3 font-medium hover:bg-amber-300 mt-6 disabled:opacity-40"
            >
              Find Booking
            </button>

            <p className="text-slate-500 text-xs mt-4 flex items-center gap-1">
              🛡 Your booking details are secure and private.
            </p>
          </div>
        </div>
      </div>

      {/* Right: booking details */}
      <div className="bg-zinc-950 flex items-center justify-center p-8">
        {!booking ? (
          <p className="text-slate-600 text-center max-w-xs">
            Enter your 6-digit booking code to view your appointment details here.
          </p>
        ) : (
          <div className="w-full max-w-md">
            {!cancelled && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</div>
                <div>
                  <p className="text-green-400 font-medium text-sm">Booking Found!</p>
                  <p className="text-slate-500 text-xs">Here are your booking details.</p>
                </div>
              </div>
            )}

            <div className="bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
              {booking.service?.imageUrl && (
                <img src={booking.service.imageUrl} alt={booking.service.name} className="w-full h-40 object-cover" />
              )}

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 text-xs tracking-widest">BOOKING ID</p>
                    <p className="text-white font-bold text-lg">{bookingId}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                    'bg-zinc-700 text-slate-300'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <p className="text-slate-400 text-sm mt-3">
                  📅 {booking.date.slice(0, 10)} &nbsp; 🕐 {booking.startTime}
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Booked on {booking.createdAt.slice(0, 10)} at {booking.createdAt.slice(11, 16)}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/10">
                  <div>
                    <p className="text-slate-500 text-xs">Service</p>
                    <p className="text-white text-sm font-medium">{booking.service?.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Price</p>
                    <p className="text-white text-sm font-medium">NPR {booking.totalPrice}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Barber</p>
                    <p className="text-white text-sm font-medium">{booking.barber?.name || 'No Preference'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Location</p>
                    <p className="text-white text-sm font-medium">Rijal's Handsome Parlor</p>
                  </div>
                </div>

                <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3 mt-5 text-xs text-amber-200">
                  Please arrive 5–10 minutes before your appointment.
                </div>

                {booking.status === 'CONFIRMED' && (
                  <button
                    onClick={handleCancel}
                    className="w-full mt-4 border border-red-800 text-red-400 rounded px-4 py-2.5 text-sm hover:bg-red-950"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LookupBookingPage