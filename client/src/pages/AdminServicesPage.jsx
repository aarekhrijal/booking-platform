import { useState, useEffect } from 'react'

function AdminServicesPage() {
  const [services, setServices] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', duration: '', price: '', imageUrl: '' })
  const [newForm, setNewForm] = useState({ name: '', description: '', duration: '', price: '', imageUrl: '' })
  const [uploading, setUploading] = useState(false)

  const token = localStorage.getItem('token')

  const loadServices = () => {
    fetch('http://localhost:5000/api/services/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setServices)
  }

  useEffect(() => {
    loadServices()
  }, [])

  const uploadImage = async (file, setTarget, setState) => {
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
      setState(prev => ({ ...prev, imageUrl: data.url }))
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await fetch('http://localhost:5000/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        name: newForm.name,
        description: newForm.description,
        duration: Number(newForm.duration),
        price: Number(newForm.price),
        imageUrl: newForm.imageUrl
      })
    })
    setNewForm({ name: '', description: '', duration: '', price: '', imageUrl: '' })
    loadServices()
  }

  const startEdit = (service) => {
    setEditingId(service.id)
    setForm({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      imageUrl: service.imageUrl || ''
    })
  }

  const handleSaveEdit = async (id, isActive) => {
    await fetch(`http://localhost:5000/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        duration: Number(form.duration),
        price: Number(form.price),
        isActive,
        imageUrl: form.imageUrl
      })
    })
    setEditingId(null)
    loadServices()
  }

  const runToggle = async (service) => {
    await fetch(`http://localhost:5000/api/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        isActive: !service.isActive,
        imageUrl: service.imageUrl
      })
    })
    loadServices()
  }

  const handleDelete = async (id) => {
  if (!window.confirm('Delete this service permanently? This cannot be undone.')) return

  const response = await fetch(`http://localhost:5000/api/services/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })

  const data = await response.json()

  if (!response.ok) {
    alert(data.error)
    return
  }

  loadServices()
}

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Manage Services</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-8">
        <h2 className="text-slate-100 font-semibold mb-3">Add New Service</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-2">
          <input placeholder="Name" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
          <input placeholder="Description" value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
          <input placeholder="Duration (min)" type="number" value={newForm.duration} onChange={(e) => setNewForm({ ...newForm, duration: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
          <input placeholder="Price" type="number" value={newForm.price} onChange={(e) => setNewForm({ ...newForm, price: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], null, setNewForm)}
            className="text-slate-300 text-sm"
          />
          {newForm.imageUrl && (
            <img src={newForm.imageUrl} alt="preview" className="w-24 h-24 object-cover rounded mt-1" />
          )}

          <button type="submit" disabled={uploading} className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-500 mt-1 disabled:opacity-50">
            {uploading ? 'Uploading image...' : 'Create Service'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-slate-100 mb-3">All Services</h2>
      <div className="grid gap-3">
        {services.map(service => (
          <div key={service.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            {editingId === service.id ? (
              <div className="flex flex-col gap-2">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], null, setForm)}
                  className="text-slate-300 text-sm"
                />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="preview" className="w-24 h-24 object-cover rounded mt-1" />
                )}

                <div className="flex gap-2 mt-1">
                  <button onClick={() => handleSaveEdit(service.id, service.isActive)} disabled={uploading} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-500 text-sm disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingId(null)} className="bg-slate-700 text-slate-100 px-3 py-1.5 rounded hover:bg-slate-600 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3">
                  {service.imageUrl && (
                    <img src={service.imageUrl} alt={service.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div>
                    <h3 className="text-slate-100 font-semibold">{service.name} {!service.isActive && <span className="text-slate-500">(inactive)</span>}</h3>
                    <p className="text-slate-400 text-sm">{service.description}</p>
                    <p className="text-slate-300 text-sm mt-1">{service.duration} min — NPR {service.price}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(service)} className="text-blue-400 hover:underline text-sm">Edit</button>
                  <button onClick={() => runToggle(service)} className="text-slate-400 hover:underline text-sm">
                    <button onClick={() => handleDelete(service.id)} className="text-red-400 hover:underline text-sm">
  Delete
</button>
                    {service.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminServicesPage