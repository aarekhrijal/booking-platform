import { useState, useEffect } from 'react'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function AdminSchedulePage() {
  const [hours, setHours] = useState(
    DAY_NAMES.map((name, index) => ({
      dayOfWeek: index,
      startTime: '09:00',
      endTime: '17:00',
      isOpen: index !== 0
    }))
  )
  const [saved, setSaved] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch('http://localhost:5000/api/schedule/working-hours')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) return

        setHours(prevHours =>
          prevHours.map(day => {
            const savedDay = data.find(d => d.dayOfWeek === day.dayOfWeek)
            return savedDay || day
          })
        )
      })
  }, [])

  const updateDay = (dayOfWeek, field, value) => {
    setHours(prevHours =>
      prevHours.map(day =>
        day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day
      )
    )
  }

  const handleSave = async () => {
    await fetch('http://localhost:5000/api/schedule/working-hours', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ hours })
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1>Working Hours</h1>

      {hours.map(day => (
        <div key={day.dayOfWeek}>
          <span>{DAY_NAMES[day.dayOfWeek]}</span>

          <label>
            <input
              type="checkbox"
              checked={day.isOpen}
              onChange={(e) => updateDay(day.dayOfWeek, 'isOpen', e.target.checked)}
            />
            Open
          </label>

          {day.isOpen && (
            <>
              <input
                type="time"
                value={day.startTime}
                onChange={(e) => updateDay(day.dayOfWeek, 'startTime', e.target.value)}
              />
              <span> to </span>
              <input
                type="time"
                value={day.endTime}
                onChange={(e) => updateDay(day.dayOfWeek, 'endTime', e.target.value)}
              />
            </>
          )}
        </div>
      ))}

      <button onClick={handleSave}>Save Schedule</button>
      {saved && <p>Saved!</p>}
    </div>
  )
}

export default AdminSchedulePage