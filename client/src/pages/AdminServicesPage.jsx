import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const PAGE_SIZE = 8
const CATEGORIES = ['General', 'Haircut', 'Beard', 'Shave', 'Haircare', 'Skincare', 'Massage', 'Nails']

function AdminServicesPage({ user, onLogout }) {
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', category: 'General', duration: '', price: '', imageUrl: '' })
  const [newForm, setNewForm] = useState({ name: '', description: '', category: 'General', duration: '', price: '', imageUrl: '' })
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)

  const token = localStorage.getItem('token')

  const loadData = () => {
    fetch(`${API_URL}/api/services/all`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(setServices)
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
    if (response.ok) setState(prev => ({ ...prev, imageUrl: data.url }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await fetch(`${API_URL}/api/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        ...newForm,
        duration: Number(newForm.duration),
        price: Number(newForm.price)
      })
    })
    setNewForm({ name: '', description: '', category: 'General', duration: '', price: '', imageUrl: '' })
    setShowForm(false)
    loadData()
  }

  const startEdit = (service) => {
    setEditingId(service.id)
    setForm({
      name: service.name,
      description: service.description || '',
      category: service.category || 'General',
      duration: service.duration,
      price: service.price,
      imageUrl: service.imageUrl || ''
    })
  }

  const handleSaveEdit = async (id, isActive) => {
    await fetch(`${API_URL}/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...form, duration: Number(form.duration), price: Number(form.price), isActive })
    })
    setEditingId(null)
    loadData()
  }

  const runToggle = async (service) => {
    await fetch(`${API_URL}/api/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...service, isActive: !service.isActive })
    })
    loadData()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service permanently? This cannot be undone.')) return
    const response = await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    const data = await response.json()
    if (!response.ok) { alert(data.error); return }
    loadData()
  }

  const bookingCountFor = (serviceId) => bookings.filter(b => b.serviceId === serviceId).length

  const filtered = services.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== 'All' && s.category !== categoryFilter) return false
    if (statusFilter === 'Active' && !s.isActive) return false
    if (statusFilter === 'Inactive' && s.isActive) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeCount = services.filter(s => s.isActive).length
  const avgPrice = services.length ? Math.round(services.reduce((s, x) => s + x.price, 0) / services.length) : 0
  const mostPopular = services.map(s => ({ ...s, count: bookingCountFor(s.id) })).sort((a, b) => b.count - a.count)[0]

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
        <div className="relative h-40 bg-cover bg-center flex items-end" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="relative p-6 flex justify-between items-end w-full">
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">Services</h1>
              <p className="text-slate-300 text-sm mt-1">Manage your services, pricing and availability.</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-amber-400 text-black px-4 py-2 rounded font-medium hover:bg-amber-300 text-sm">
              + Add New Service
            </button>
          </div>
        </div>

        <div className="p-6 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Total Services</p>
              <p className="text-white text-2xl font-bold mt-1">{services.length}</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Avg. Price</p>
              <p className="text-white text-2xl font-bold mt-1">NPR {avgPrice}</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Most Popular</p>
              <p className="text-white text-xl font-bold mt-1">{mostPopular?.name || '—'}</p>
              <p className="text-slate-600 text-xs">{mostPopular ? `${mostPopular.count} bookings` : ''}</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Active Services</p>
              <p className="text-white text-2xl font-bold mt-1">{activeCount} / {services.length}</p>
            </div>
          </div>

          {showForm && (
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 mt-6">
              <h2 className="text-white font-semibold mb-3">Add New Service</h2>
              <form onSubmit={handleCreate} className="flex flex-col gap-2 max-w-md">
                <input placeholder="Name" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                <input placeholder="Description" value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                <select value={newForm.category} onChange={(e) => setNewForm({ ...newForm, category: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Duration (min)" type="number" value={newForm.duration} onChange={(e) => setNewForm({ ...newForm, duration: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                <input placeholder="Price" type="number" value={newForm.price} onChange={(e) => setNewForm({ ...newForm, price: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], setNewForm)} className="text-slate-300 text-sm" />
                {newForm.imageUrl && <img src={newForm.imageUrl} alt="preview" className="w-16 h-16 object-cover rounded mt-1" />}
                <button type="submit" disabled={uploading} className="bg-amber-400 text-black rounded px-3 py-2 font-medium hover:bg-amber-300 mt-1 disabled:opacity-50 w-fit">
                  {uploading ? 'Uploading...' : 'Create Service'}
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
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }} className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100">
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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
                  <th className="p-4">Service</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Bookings</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(service => (
                  <tr key={service.id} className="border-b border-white/5 hover:bg-white/5 align-top">
                    {editingId === service.id ? (
                      <td colSpan={7} className="p-4">
                        <div className="flex flex-col gap-2 max-w-md">
                          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                          <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], setForm)} className="text-slate-300 text-sm" />
                          {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-16 h-16 object-cover rounded" />}
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveEdit(service.id, service.isActive)} disabled={uploading} className="bg-amber-400 text-black px-3 py-1.5 rounded text-sm">Save</button>
                            <button onClick={() => setEditingId(null)} className="bg-zinc-800 text-white px-3 py-1.5 rounded text-sm">Cancel</button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden shrink-0">
                              {service.imageUrl && <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="text-white">{service.name}</p>
                              <p className="text-slate-500 text-xs">{service.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4"><span className="bg-zinc-800 text-slate-300 text-xs px-2 py-1 rounded">{service.category}</span></td>
                        <td className="p-4 text-slate-300">{service.duration} mins</td>
                        <td className="p-4 text-white">NPR {service.price}</td>
                        <td className="p-4 text-slate-300">{bookingCountFor(service.id)}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${service.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(service)} className="text-blue-400 hover:underline text-xs">Edit</button>
                            <button onClick={() => runToggle(service)} className="text-slate-400 hover:underline text-xs">{service.isActive ? 'Deactivate' : 'Activate'}</button>
                            <button onClick={() => handleDelete(service.id)} className="text-red-400 hover:underline text-xs">Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">No services match your filters.</td></tr>
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

export default AdminServicesPage