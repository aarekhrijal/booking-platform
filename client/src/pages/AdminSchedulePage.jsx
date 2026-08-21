import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function AdminSchedulePage({ user, onLogout }) {
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
    fetch(`${API_URL}/api/schedule/working-hours`)
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
    await fetch(`${API_URL}/api/schedule/working-hours`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ hours })
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const timeToMinutes = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  const daysOpen = hours.filter(d => d.isOpen).length
  const totalHours = hours.reduce((sum, d) => {
    if (!d.isOpen) return sum
    return sum + (timeToMinutes(d.endTime) - timeToMinutes(d.startTime)) / 60
  }, 0)

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
        <div className="relative h-40 bg-cover bg-center flex items-end" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="relative p-6">
            <h1 className="font-heading text-2xl font-bold text-white">Working Hours</h1>
            <p className="text-slate-300 text-sm mt-1">Set the days and hours your business is open.</p>
          </div>
        </div>

        <div className="p-6 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Days Open</p>
              <p className="text-white text-2xl font-bold mt-1">{daysOpen} / 7</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Total Weekly Hours</p>
              <p className="text-white text-2xl font-bold mt-1">{totalHours}h</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Status</p>
              <p className="text-green-400 text-2xl font-bold mt-1">Active</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-lg mt-6 p-5">
            <div className="grid gap-2">
              {hours.map(day => (
                <div key={day.dayOfWeek} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                  <span className="text-white w-28 shrink-0">{DAY_NAMES[day.dayOfWeek]}</span>

                  <label className="flex items-center gap-2 text-slate-300 text-sm w-20 shrink-0">
                    <input
                      type="checkbox"
                      checked={day.isOpen}
                      onChange={(e) => updateDay(day.dayOfWeek, 'isOpen', e.target.checked)}
                      className="accent-amber-400"
                    />
                    Open
                  </label>

                  {day.isOpen ? (
                    <>
                      <input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => updateDay(day.dayOfWeek, 'startTime', e.target.value)}
                        className="bg-zinc-950 border border-white/10 rounded px-2 py-1.5 text-slate-100 text-sm"
                      />
                      <span className="text-slate-500 text-sm">to</span>
                      <input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => updateDay(day.dayOfWeek, 'endTime', e.target.value)}
                        className="bg-zinc-950 border border-white/10 rounded px-2 py-1.5 text-slate-100 text-sm"
                      />
                    </>
                  ) : (
                    <span className="text-slate-600 text-sm">Closed</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button onClick={handleSave} className="bg-amber-400 text-black rounded px-4 py-2.5 font-medium hover:bg-amber-300 text-sm">
                Save Schedule
              </button>
              {saved && <p className="text-green-400 text-sm">Saved!</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminSchedulePage