import { useState, useEffect } from 'react'

function BookingPage() {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState('')

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
        startTime: selectedSlot
      })
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    setConfirmation(data)
  }

  if (confirmation) {
    return (
      <div>
        <h1>Booking Confirmed!</h1>
        <p>Date: {confirmation.date.slice(0, 10)}</p>
        <p>Time: {confirmation.startTime}</p>
        <p>Status: {confirmation.status}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Book an Appointment</h1>

      <select value={selectedService} onChange={(e) => { setSelectedService(e.target.value); setSelectedSlot(null) }}>
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
      />

      <div>
        {slots.map(slot => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            style={{ fontWeight: selectedSlot === slot ? 'bold' : 'normal' }}
          >
            {slot}
          </button>
        ))}
      </div>

      {selectedSlot && (
        <button onClick={handleBook}>Confirm booking for {selectedSlot}</button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default BookingPage