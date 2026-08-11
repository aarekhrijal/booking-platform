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
  <div className="max-w-xl mx-auto px-6 py-12">
    <h1 className="text-2xl font-bold text-slate-100 mb-6">Working Hours</h1>

    <div className="grid gap-2">
      {hours.map(day => (
        <div key={day.dayOfWeek} className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-4">
          <span className="text-slate-100 w-24">{DAY_NAMES[day.dayOfWeek]}</span>

          <label className="flex items-center gap-1.5 text-slate-300 text-sm">
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
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 text-sm"
              />
              <span className="text-slate-500">to</span>
              <input
                type="time"
                value={day.endTime}
                onChange={(e) => updateDay(day.dayOfWeek, 'endTime', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 text-sm"
              />
            </>
          )}
        </div>
      ))}
    </div>

    <button onClick={handleSave} className="mt-6 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-500">
      Save Schedule
    </button>
    {saved && <p className="text-green-400 mt-2">Saved!</p>}
  </div>
)

}

export default AdminSchedulePage