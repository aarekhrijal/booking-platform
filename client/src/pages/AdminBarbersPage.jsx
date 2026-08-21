import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const PAGE_SIZE = 6

function AdminBarbersPage({ user, onLogout }) {
  const [barbers, setBarbers] = useState([])
  const [bookings, setBookings] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', title: '', experience: '', rating: '', photoUrl: '' })
  const [newForm, setNewForm] = useState({ name: '', title: '', experience: '', rating: '', photoUrl: '' })
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)

  const token = localStorage.getItem('token')

  const loadData = () => {
    fetch(`${API_URL}/api/barbers/all`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(setBarbers)
    fetch(`${API_URL}/api/bookings`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(setBookings)
  }

  useEffect(() => { loadData() }, [])

  const uploadImage = async (file, setState) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
    const data = await response.json()
    setUploading(false)
    if (response.ok) setState(prev => ({ ...prev, photoUrl: data.url }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await fetch(`${API_URL}/api/barbers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newForm)
    })
    setNewForm({ name: '', title: '', experience: '', rating: '', photoUrl: '' })
    setShowForm(false)
    loadData()
  }

  const startEdit = (barber) => {
    setEditingId(barber.id)
    setForm({ name: barber.name, title: barber.title, experience: barber.experience, rating: barber.rating, photoUrl: barber.photoUrl || '' })
  }

  const handleSaveEdit = async (id, isActive) => {
    await fetch(`${API_URL}/api/barbers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...form, isActive })
    })
    setEditingId(null)
    loadData()
  }

  const toggleActive = async (barber) => {
    await fetch(`${API_URL}/api/barbers/${barber.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...barber, isActive: !barber.isActive })
    })
    loadData()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this barber permanently?')) return
    await fetch(`${API_URL}/api/barbers/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    loadData()
  }

  const bookingCountFor = (barberId) => bookings.filter(b => b.barberId === barberId).length

  const filtered = barbers.filter(b => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter === 'Active' && !b.isActive) return false
    if (statusFilter === 'Inactive' && b.isActive) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeCount = barbers.filter(b => b.isActive).length
  const now = new Date()
  const bookingsThisMonth = bookings.filter(b => {
    const d = new Date(b.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const avgRating = barbers.length ? (barbers.reduce((s, b) => s + b.rating, 0) / barbers.length).toFixed(1) : 0

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
        <div className="relative h-40 bg-cover bg-center flex items-end" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="relative p-6 flex justify-between items-end w-full">
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">Barbers</h1>
              <p className="text-slate-300 text-sm mt-1">Manage your barbers, their information and performance.</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-amber-400 text-black px-4 py-2 rounded font-medium hover:bg-amber-300 text-sm">
              + Add New Barber
            </button>
          </div>
        </div>

        <div className="p-6 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Total Barbers</p>
              <p className="text-white text-2xl font-bold mt-1">{barbers.length}</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Active Barbers</p>
              <p className="text-white text-2xl font-bold mt-1">{activeCount}</p>
              <p className="text-slate-600 text-xs">{barbers.length ? Math.round((activeCount / barbers.length) * 100) : 0}% of total</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Bookings (This Month)</p>
              <p className="text-white text-2xl font-bold mt-1">{bookingsThisMonth}</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Avg. Rating</p>
              <p className="text-white text-2xl font-bold mt-1">{avgRating} / 5</p>
            </div>
          </div>

          {showForm && (
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 mt-6">
              <h2 className="text-white font-semibold mb-3">Add New Barber</h2>
              <form onSubmit={handleCreate} className="flex flex-col gap-2">
                <input placeholder="Name" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                <input placeholder="Title (e.g. Senior Barber)" value={newForm.title} onChange={(e) => setNewForm({ ...newForm, title: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                <input placeholder="Experience (e.g. 5+ years)" value={newForm.experience} onChange={(e) => setNewForm({ ...newForm, experience: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                <input placeholder="Rating (e.g. 4.9)" type="number" step="0.1" value={newForm.rating} onChange={(e) => setNewForm({ ...newForm, rating: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], setNewForm)} className="text-slate-300 text-sm" />
                {newForm.photoUrl && <img src={newForm.photoUrl} alt="preview" className="w-16 h-16 rounded-full object-cover mt-1" />}
                <button type="submit" disabled={uploading} className="bg-amber-400 text-black rounded px-3 py-2 font-medium hover:bg-amber-300 mt-1 disabled:opacity-50 w-fit">
                  {uploading ? 'Uploading...' : 'Add Barber'}
                </button>
              </form>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            <input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100 flex-1 min-w-[200px]"
            />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-lg mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-amber-400 text-xs border-b border-white/10">
                  <th className="p-4">Barber</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Bookings</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(barber => (
                  <tr key={barber.id} className="border-b border-white/5 hover:bg-white/5 align-top">
                    {editingId === barber.id ? (
                      <td colSpan={7} className="p-4">
                        <div className="flex flex-col gap-2 max-w-md">
                          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                          <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                          <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                          <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], setForm)} className="text-slate-300 text-sm" />
                          {form.photoUrl && <img src={form.photoUrl} alt="preview" className="w-16 h-16 rounded-full object-cover" />}
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveEdit(barber.id, barber.isActive)} disabled={uploading} className="bg-amber-400 text-black px-3 py-1.5 rounded text-sm">Save</button>
                            <button onClick={() => setEditingId(null)} className="bg-zinc-800 text-white px-3 py-1.5 rounded text-sm">Cancel</button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {barber.photoUrl ? (
                              <img src={barber.photoUrl} alt={barber.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400 text-xs">{barber.name.charAt(0).toUpperCase()}</div>
                            )}
                            <p className="text-white">{barber.name}</p>
                          </div>
                        </td>
                        <td className="p-4"><span className="bg-zinc-800 text-slate-300 text-xs px-2 py-1 rounded">{barber.title}</span></td>
                        <td className="p-4 text-slate-300">{barber.experience}</td>
                        <td className="p-4 text-slate-300">{bookingCountFor(barber.id)}</td>
                        <td className="p-4 text-amber-400">★ {barber.rating}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${barber.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {barber.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(barber)} className="text-blue-400 hover:underline text-xs">Edit</button>
                            <button onClick={() => toggleActive(barber)} className="text-slate-400 hover:underline text-xs">{barber.isActive ? 'Deactivate' : 'Activate'}</button>
                            <button onClick={() => handleDelete(barber.id)} className="text-red-400 hover:underline text-xs">Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">No barbers match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-slate-500 text-xs">Showing {pageItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded border border-white/10 text-slate-300 text-sm disabled:opacity-30">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`px-3 py-1.5 rounded text-sm ${page === n ? 'bg-amber-400 text-black' : 'border border-white/10 text-slate-300'}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded border border-white/10 text-slate-300 text-sm disabled:opacity-30">›</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminBarbersPage