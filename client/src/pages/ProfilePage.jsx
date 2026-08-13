import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ProfilePage({ user, setUser, onLogout }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
  if (user) {
    setName(user.name)
    setEmail(user.email)
  }
}, [user])

if (!user) {
  return <p className="text-center mt-16 text-slate-400">Loading...</p>
}

  const token = localStorage.getItem('token')

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    const response = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name, email })
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
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">My Profile</h1>

      <form onSubmit={handleProfileSave} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-500">
          Save Profile
        </button>
      </form>
      {profileError && <p className="text-red-400 mt-2 text-sm">{profileError}</p>}
      {profileSuccess && <p className="text-green-400 mt-2 text-sm">{profileSuccess}</p>}

      <h2 className="text-lg font-semibold text-slate-100 mt-10 mb-3">Change Password</h2>
      <form onSubmit={handlePasswordSave} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-500">
          Update Password
        </button>
      </form>
      {passwordError && <p className="text-red-400 mt-2 text-sm">{passwordError}</p>}
      {passwordSuccess && <p className="text-green-400 mt-2 text-sm">{passwordSuccess}</p>}
      <div className="mt-10 pt-6 border-t border-slate-800">
  <button
    onClick={() => { onLogout(); navigate('/') }}
    className="bg-slate-700 text-slate-100 px-3 py-2 rounded hover:bg-slate-600"
  >
    Log out
  </button>
</div>
    </div>
    
  )
}

export default ProfilePage