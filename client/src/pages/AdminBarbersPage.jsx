import { useState, useEffect } from 'react'

function AdminBarbersPage() {
  const [barbers, setBarbers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', title: '', experience: '', rating: '', photoUrl: '' })
  const [newForm, setNewForm] = useState({ name: '', title: '', experience: '', rating: '', photoUrl: '' })
  const [uploading, setUploading] = useState(false)

  const token = localStorage.getItem('token')

  const loadBarbers = () => {
    fetch('http://localhost:5000/api/barbers/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setBarbers)
  }

  useEffect(() => {
    loadBarbers()
  }, [])

  const uploadImage = async (file, setState) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })

    const data = await response.json()
    setUploading(false)

    if (response.ok) {
      setState(prev => ({ ...prev, photoUrl: data.url }))
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await fetch('http://localhost:5000/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        name: newForm.name,
        title: newForm.title,
        experience: newForm.experience,
        rating: newForm.rating,
        photoUrl: newForm.photoUrl
      })
    })
    setNewForm({ name: '', title: '', experience: '', rating: '', photoUrl: '' })
    loadBarbers()
  }

  const startEdit = (barber) => {
    setEditingId(barber.id)
    setForm({
      name: barber.name,
      title: barber.title,
      experience: barber.experience,
      rating: barber.rating,
      photoUrl: barber.photoUrl || ''
    })
  }

  const handleSaveEdit = async (id, isActive) => {
    await fetch(`http://localhost:5000/api/barbers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...form, isActive })
    })
    setEditingId(null)
    loadBarbers()
  }

  const toggleActive = async (barber) => {
    await fetch(`http://localhost:5000/api/barbers/${barber.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...barber, isActive: !barber.isActive })
    })
    loadBarbers()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this barber permanently?')) return
    await fetch(`http://localhost:5000/api/barbers/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    loadBarbers()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Manage Barbers</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-8">
        <h2 className="text-slate-100 font-semibold mb-3">Add New Barber</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-2">
          <input placeholder="Name" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
          <input placeholder="Title (e.g. Senior Barber)" value={newForm.title} onChange={(e) => setNewForm({ ...newForm, title: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
          <input placeholder="Experience (e.g. 12 years experience)" value={newForm.experience} onChange={(e) => setNewForm({ ...newForm, experience: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
          <input placeholder="Rating (e.g. 4.9)" type="number" step="0.1" value={newForm.rating} onChange={(e) => setNewForm({ ...newForm, rating: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], setNewForm)}
            className="text-slate-300 text-sm"
          />
          {newForm.photoUrl && (
            <img src={newForm.photoUrl} alt="preview" className="w-20 h-20 object-cover rounded-full mt-1" />
          )}

          <button type="submit" disabled={uploading} className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-500 mt-1 disabled:opacity-50">
            {uploading ? 'Uploading image...' : 'Add Barber'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-slate-100 mb-3">All Barbers</h2>
      <div className="grid gap-3">
        {barbers.map(barber => (
          <div key={barber.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            {editingId === barber.id ? (
              <div className="flex flex-col gap-2">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], setForm)}
                  className="text-slate-300 text-sm"
                />
                {form.photoUrl && (
                  <img src={form.photoUrl} alt="preview" className="w-20 h-20 object-cover rounded-full mt-1" />
                )}

                <div className="flex gap-2 mt-1">
                  <button onClick={() => handleSaveEdit(barber.id, barber.isActive)} disabled={uploading} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-500 text-sm disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingId(null)} className="bg-slate-700 text-slate-100 px-3 py-1.5 rounded hover:bg-slate-600 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3 items-center">
                  {barber.photoUrl ? (
                    <img src={barber.photoUrl} alt={barber.name} className="w-14 h-14 object-cover rounded-full" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-700" />
                  )}
                  <div>
                    <h3 className="text-slate-100 font-semibold">{barber.name} {!barber.isActive && <span className="text-slate-500">(inactive)</span>}</h3>
                    <p className="text-slate-400 text-sm">{barber.title} — ⭐ {barber.rating}</p>
                    <p className="text-slate-500 text-sm">{barber.experience}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(barber)} className="text-blue-400 hover:underline text-sm">Edit</button>
                  <button onClick={() => toggleActive(barber)} className="text-slate-400 hover:underline text-sm">
                    {barber.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(barber.id)} className="text-red-400 hover:underline text-sm">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminBarbersPage