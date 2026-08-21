import { API_URL } from '../config'
import { useState, useEffect } from 'react'

const STEPS = [
  { num: 1, icon: '✂', title: 'Choose Service', subtitle: 'Select your service' },
  { num: 2, icon: '◈', title: 'Choose Barber', subtitle: 'Select your barber' },
  { num: 3, icon: '📅', title: 'Date & Time', subtitle: 'Pick a date and time' },
  { num: 4, icon: '📝', title: 'Your Details', subtitle: 'Enter your details' },
  { num: 5, icon: '✓', title: 'Confirm Booking', subtitle: 'Review & confirm' },
]

function BookingPage() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedBarber, setSelectedBarber] = useState('none')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [guestName, setGuestName] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState('')

  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    fetch(`${API_URL}/api/services`).then(res => res.json()).then(setServices)
    fetch(`${API_URL}/api/barbers`).then(res => res.json()).then(setBarbers)
  }, [])

  useEffect(() => {
    if (!selectedService || !date) {
      setSlots([])
      return
    }
    fetch(`${API_URL}/api/availability?date=${date}&serviceId=${selectedService.id}`)
      .then(res => res.json())
      .then(setSlots)
  }, [selectedService, date])

  const canGoNext = () => {
    if (step === 1) return !!selectedService
    if (step === 2) return true // barber is optional
    if (step === 3) return !!date && !!selectedSlot
    if (step === 4) return isLoggedIn || !!guestName
    return true
  }

  const handleBook = async () => {
    setError('')
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        serviceId: selectedService.id,
        barberId: selectedBarber === 'none' ? null : selectedBarber,
        date,
        startTime: selectedSlot,
        guestName
      })
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    setConfirmation(data)
  }

  const selectedBarberObj = barbers.find(b => b.id === selectedBarber)

  if (confirmation) {
    return (
      <div className="bg-black min-h-screen">
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <h1 className="font-heading text-3xl font-bold text-white">Booking Confirmed!</h1>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 mt-6 text-left">
            <p className="text-slate-300">Date: {confirmation.date.slice(0, 10)}</p>
            <p className="text-slate-300">Time: {confirmation.startTime}</p>
            <p className="text-slate-300">Status: {confirmation.status}</p>
          </div>
          <div className="bg-amber-950 border border-amber-800 rounded-lg p-4 mt-4 text-left">
            <p className="text-amber-200 text-sm font-medium">Your booking code:</p>
            <p className="text-amber-100 text-3xl font-bold tracking-widest mt-1">{confirmation.otp}</p>
            <p className="text-amber-300 text-sm mt-2">
              Please save this code somewhere safe. You'll need to show it when you arrive.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black">
      {/* Hero */}
      <div className="relative h-[260px] bg-cover bg-center flex items-center justify-center text-center" style={{ backgroundImage: "url('/book-hero.png')" }}>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-[220px_1fr_300px] gap-8">
        {/* Left: step list */}
        <div className="flex flex-col gap-6">
          {STEPS.map(s => (
            <div key={s.num} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                step === s.num ? 'bg-amber-400 text-black' : step > s.num ? 'bg-amber-400/20 text-amber-400' : 'bg-zinc-800 text-slate-500'
              }`}>
                {step > s.num ? '✓' : s.num}
              </div>
              <div>
                <p className={`text-sm font-medium ${step === s.num ? 'text-amber-400' : 'text-white/80'}`}>{s.title}</p>
                <p className="text-slate-500 text-xs">{s.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Center: step content */}
        <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
          {step === 1 && (
            <div>
              <h2 className="font-heading text-xl font-bold text-white">1. Choose Service</h2>
              <p className="text-slate-500 text-sm mt-1">Select the service you want to book</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`text-left rounded-lg overflow-hidden border transition-colors ${
                      selectedService?.id === service.id ? 'border-amber-400' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="relative h-28 bg-zinc-800">
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-400 text-2xl">✂</div>
                      )}
                      {selectedService?.id === service.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-black text-sm">✓</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-white text-sm font-semibold">{service.name}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-slate-500 text-xs">⏱ {service.duration} mins</span>
                        <span className="text-amber-400 text-xs font-medium">NPR {service.price}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-heading text-xl font-bold text-white">2. Choose Barber</h2>
              <p className="text-slate-500 text-sm mt-1">Select your preferred barber, or no preference</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => setSelectedBarber('none')}
                  className={`rounded-lg border p-4 text-center transition-colors ${
                    selectedBarber === 'none' ? 'border-amber-400' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-zinc-800 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 text-xl">
                    ?
                  </div>
                  <p className="text-white text-sm font-semibold mt-3">No Preference</p>
                  <p className="text-slate-500 text-xs mt-1">Any available barber</p>
                </button>

                {barbers.map(barber => (
                  <button
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber.id)}
                    className={`rounded-lg border p-4 text-center transition-colors ${
                      selectedBarber === barber.id ? 'border-amber-400' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {barber.photoUrl ? (
                      <img src={barber.photoUrl} alt={barber.name} className="w-14 h-14 rounded-full object-cover mx-auto" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-amber-400">✂</div>
                    )}
                    <p className="text-white text-sm font-semibold mt-3">{barber.name}</p>
                    <p className="text-slate-500 text-xs mt-1">{barber.title} — ⭐ {barber.rating}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-heading text-xl font-bold text-white">3. Date & Time</h2>
              <p className="text-slate-500 text-sm mt-1">Pick a date and available time slot</p>

              <input
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); setSelectedSlot(null) }}
                className="bg-zinc-800 border border-white/10 rounded px-3 py-2 text-slate-100 mt-4"
              />

              <div className="grid grid-cols-4 gap-2 mt-4">
                {slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-3 py-2 rounded border text-sm ${
                      selectedSlot === slot
                        ? 'bg-amber-400 border-amber-400 text-black'
                        : 'bg-zinc-800 border-white/10 text-slate-200 hover:border-amber-400/50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
                {date && slots.length === 0 && (
                  <p className="text-slate-500 text-sm col-span-4">No available times on this date.</p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-heading text-xl font-bold text-white">4. Your Details</h2>
              <p className="text-slate-500 text-sm mt-1">
                {isLoggedIn ? "We'll use your account details for this booking." : 'Enter your name to continue as a guest.'}
              </p>
              {!isLoggedIn && (
                <input
                  placeholder="Your Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-zinc-800 border border-white/10 rounded px-3 py-2 text-slate-100 mt-4 w-full"
                />
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-heading text-xl font-bold text-white">5. Confirm Booking</h2>
              <p className="text-slate-500 text-sm mt-1">Review your booking before confirming</p>

              <div className="mt-6 flex flex-col gap-2 text-sm">
                <p className="text-slate-300">Service: <span className="text-white">{selectedService?.name}</span></p>
                <p className="text-slate-300">Barber: <span className="text-white">{selectedBarberObj ? selectedBarberObj.name : 'No Preference'}</span></p>
                <p className="text-slate-300">Date: <span className="text-white">{date}</span></p>
                <p className="text-slate-300">Time: <span className="text-white">{selectedSlot}</span></p>
                {!isLoggedIn && <p className="text-slate-300">Name: <span className="text-white">{guestName}</span></p>}
              </div>

              {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

              <button onClick={handleBook} className="mt-6 bg-amber-400 text-black rounded px-4 py-3 font-medium hover:bg-amber-300 w-full">
                Confirm Booking
              </button>
            </div>
          )}

          {/* Step navigation */}
          {step < 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="text-slate-400 hover:text-white text-sm disabled:opacity-30"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canGoNext()}
                className="bg-amber-400 text-black px-5 py-2 rounded font-medium hover:bg-amber-300 disabled:opacity-30 text-sm"
              >
                Next Step →
              </button>
            </div>
          )}
        </div>

        {/* Right: summary */}
        <div className="bg-zinc-900 border border-white/10 rounded-lg p-5 h-fit">
          <h3 className="text-amber-400 text-xs tracking-widest font-medium">BOOKING SUMMARY</h3>
          <div className="flex flex-col gap-3 mt-4 text-sm">
            <p className="text-slate-300">✂ {selectedService ? selectedService.name : <span className="text-slate-600">Not selected</span>}</p>
            <p className="text-slate-300">◈ {selectedBarberObj ? selectedBarberObj.name : selectedBarber === 'none' ? 'No Preference' : <span className="text-slate-600">Not selected</span>}</p>
            <p className="text-slate-300">📅 {date || <span className="text-slate-600">Not selected</span>}</p>
            <p className="text-slate-300">🕐 {selectedSlot || <span className="text-slate-600">Not selected</span>}</p>
          </div>

          <div className="border-t border-white/10 mt-4 pt-4">
            <p className="text-slate-500 text-xs tracking-widest">TOTAL AMOUNT</p>
            <p className="text-amber-400 text-2xl font-bold mt-1">NPR {selectedService?.price || 0}</p>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3 mt-4 text-xs text-amber-200">
            <p className="font-medium mb-1">ℹ Appointment Policy</p>
            Please arrive 5–10 minutes before your appointment. You can cancel using your booking code.
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage