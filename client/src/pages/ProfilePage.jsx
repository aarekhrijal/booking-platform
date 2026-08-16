import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ProfilePage({ user, setUser, onLogout }) {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const [bookings, setBookings] = useState([])

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhotoUrl(user.photoUrl || '')
    }
  }, [user])

  useEffect(() => {
    fetch('http://localhost:5000/api/bookings/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setBookings)
  }, [])

  if (!user) {
    return <p className="text-center mt-16 text-slate-400">Loading...</p>
  }

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    upcoming: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  }

  const recent = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  const handlePhotoSelect = async (file) => {
    setUploadingPhoto(true)
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })

    const data = await response.json()
    setUploadingPhoto(false)
    if (response.ok) setPhotoUrl(data.url)
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    const response = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name, email, photoUrl })
    })

    const data = await response.json()

    if (!response.ok) {
      setProfileError(data.error)
      return
    }

    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    setProfileSuccess('Profile updated.')
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    const response = await fetch('http://localhost:5000/api/auth/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword })
    })

    const data = await response.json()

    if (!response.ok) {
      setPasswordError(data.error)
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setPasswordSuccess('Password updated.')
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12 grid gap-6 md:grid-cols-3">
        {/* Main column */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white">My Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your personal information.</p>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {photoUrl ? (
                  <img src={photoUrl} alt={name} className="w-20 h-20 rounded-full object-cover border-2 border-amber-400/40" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-amber-400/40 flex items-center justify-center text-amber-400 text-2xl">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center cursor-pointer text-black text-xs">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handlePhotoSelect(e.target.files[0])}
                  />
                </label>
              </div>
              <div>
                <h2 className="text-white font-semibold text-xl">{name}</h2>
                <p className="text-slate-500 text-sm">{email}</p>
                {uploadingPhoto && <p className="text-amber-400 text-xs mt-1">Uploading photo...</p>}
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="flex flex-col gap-3 mt-6">
              <div>
                <label className="text-slate-400 text-xs">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100 mt-1 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100 mt-1 focus:border-amber-400 focus:outline-none"
                />
              </div>
              {profileError && <p className="text-red-400 text-sm">{profileError}</p>}
              {profileSuccess && <p className="text-green-400 text-sm">{profileSuccess}</p>}
              <button type="submit" className="bg-amber-400 text-black rounded px-4 py-2.5 font-medium hover:bg-amber-300 text-sm w-fit">
                Save Profile
              </button>
            </form>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold">Change Password</h3>
            <form onSubmit={handlePasswordSave} className="flex flex-col gap-3 mt-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
              />
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-400 text-sm">{passwordSuccess}</p>}
              <button type="submit" className="bg-zinc-800 text-white rounded px-4 py-2.5 font-medium hover:bg-zinc-700 text-sm w-fit">
                Update Password
              </button>
            </form>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">Recent Bookings</h3>
              <Link to="/my-bookings" className="text-amber-400 text-sm hover:underline">View All →</Link>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {recent.length === 0 && <p className="text-slate-500 text-sm">No bookings yet.</p>}
              {recent.map(b => (
                <div key={b.id} className="flex items-center gap-3 border-t border-white/5 pt-3 first:border-0 first:pt-0">
                  <div className="w-12 h-12 rounded bg-zinc-800 overflow-hidden shrink-0">
                    {b.service?.imageUrl && <img src={b.service.imageUrl} alt={b.service.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{b.service?.name}</p>
                    <p className="text-slate-500 text-xs">{b.date.slice(0, 10)} — {b.startTime}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    b.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                    b.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-700 text-slate-300'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-5">
            <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-1">
              <Link to="/book" className="text-slate-300 hover:text-amber-400 text-sm py-2 border-b border-white/5">Book Appointment →</Link>
              <Link to="/my-bookings" className="text-slate-300 hover:text-amber-400 text-sm py-2">My Bookings →</Link>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-lg p-5">
            <h3 className="text-white font-semibold text-sm mb-3">Account Summary</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Total Bookings</span><span className="text-white">{stats.total}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Completed</span><span className="text-white">{stats.completed}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Upcoming</span><span className="text-white">{stats.upcoming}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Cancelled</span><span className="text-white">{stats.cancelled}</span></div>
            </div>
          </div>

          <button
            onClick={() => { onLogout(); navigate('/') }}
            className="bg-zinc-900 border border-red-900/50 text-red-400 rounded-lg px-4 py-3 text-sm hover:bg-red-950"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage