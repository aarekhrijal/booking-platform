import { useState, useEffect } from 'react'

function BookingPage() {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState('')
  const [guestName, setGuestName] = useState('')
const [guestEmail, setGuestEmail] = useState('')
const [guestPhone, setGuestPhone] = useState('')
const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
  }, [])

  useEffect(() => {
    if (!selectedService || !date) {
      setSlots([])
      return
    }

    fetch(`http://localhost:5000/api/availability?date=${date}&serviceId=${selectedService}`)
      .then(res => res.json())
      .then(data => setSlots(data))
  }, [selectedService, date])

  const handleBook = async () => {
    setError('')
    const token = localStorage.getItem('token')

    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
body: JSON.stringify({
  serviceId: Number(selectedService),
  date,
  startTime: selectedSlot,
  guestName,
  guestEmail,
  guestPhone
})
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    setConfirmation(data)
  }

  // BookingPage.jsx — replace just the returned JSX (everything above it stays as-is)
if (confirmation) {
  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-100">Booking Confirmed!</h1>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-6 text-left">
        <p className="text-slate-300">Date: {confirmation.date.slice(0, 10)}</p>
        <p className="text-slate-300">Time: {confirmation.startTime}</p>
        <p className="text-slate-300">Status: {confirmation.status}</p>
      </div>
    </div>
  )
}

return (
  <div className="max-w-xl mx-auto px-6 py-12">
    <h1 className="text-2xl font-bold text-slate-100 mb-6">Book an Appointment</h1>

    <div className="flex flex-col gap-3">
      <select
        value={selectedService}
        onChange={(e) => { setSelectedService(e.target.value); setSelectedSlot(null) }}
        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
      >
        <option value="">-- Choose a service --</option>
        {services.map(service => (
          <option key={service.id} value={service.id}>
            {service.name} ({service.duration} min — NPR {service.price})
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => { setDate(e.target.value); setSelectedSlot(null) }}
        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
      />
    </div>

    <div className="grid grid-cols-4 gap-2 mt-6">
      {slots.map(slot => (
        <button
          key={slot}
          onClick={() => setSelectedSlot(slot)}
          className={`px-3 py-2 rounded border ${
            selectedSlot === slot
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {slot}
        </button>
      ))}
    </div>

{!isLoggedIn && selectedSlot && (
  <div className="flex flex-col gap-3 mt-6">
    <input
      placeholder="Your Name"
      value={guestName}
      onChange={(e) => setGuestName(e.target.value)}
      className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
    />
    <input
      placeholder="Email"
      value={guestEmail}
      onChange={(e) => setGuestEmail(e.target.value)}
      className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
    />
    <input
      placeholder="Phone Number"
      value={guestPhone}
      onChange={(e) => setGuestPhone(e.target.value)}
      className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
    />
  </div>
)}

{selectedSlot && (
  <button
    onClick={handleBook}
    className="mt-6 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-500 w-full"
  >
    Confirm booking for {selectedSlot}
  </button>
)}

    {error && <p className="text-red-400 mt-3">{error}</p>}
  </div>
)
}

export default BookingPage