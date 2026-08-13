import { useState, useEffect } from 'react'
import ConfirmDialog from '@/components/ConfirmDialog'

function AdminServicesPage() {
  const [services, setServices] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', duration: '', price: '' })
  const [newForm, setNewForm] = useState({ name: '', description: '', duration: '', price: '' })
  const [confirmService, setConfirmService] = useState(null)

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

  const handleCreate = async (e) => {
    e.preventDefault()
    await fetch('http://localhost:5000/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        name: newForm.name,
        description: newForm.description,
        duration: Number(newForm.duration),
        price: Number(newForm.price)
      })
    })
    setNewForm({ name: '', description: '', duration: '', price: '' })
    loadServices()
  }

  const startEdit = (service) => {
    setEditingId(service.id)
    setForm({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price
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
        isActive
      })
    })
    setEditingId(null)
    loadServices()
  }

const toggleActive = async (service) => {
  if (service.isActive) {
    setConfirmService(service)
    return
  }
  await runToggle(service)
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
      isActive: !service.isActive
    })
  })
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
        <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-500 mt-1">Create Service</button>
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
              <div className="flex gap-2 mt-1">
                <button onClick={() => handleSaveEdit(service.id, service.isActive)} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-500 text-sm">Save</button>
                <button onClick={() => setEditingId(null)} className="bg-slate-700 text-slate-100 px-3 py-1.5 rounded hover:bg-slate-600 text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-slate-100 font-semibold">{service.name} {!service.isActive && <span className="text-slate-500">(inactive)</span>}</h3>
                <p className="text-slate-400 text-sm">{service.description}</p>
                <p className="text-slate-300 text-sm mt-1">{service.duration} min — NPR {service.price}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(service)} className="text-blue-400 hover:underline text-sm">Edit</button>
                <button onClick={() => toggleActive(service)} className="text-slate-400 hover:underline text-sm">
                  {service.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
    <ConfirmDialog
  open={confirmService !== null}
  onOpenChange={(open) => !open && setConfirmService(null)}
  title={`Deactivate "${confirmService?.name}"?`}
  description="Customers won't be able to book this service anymore."
  onConfirm={() => runToggle(confirmService)}
/>
  </div>
)
}

export default AdminServicesPage