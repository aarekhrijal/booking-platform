import { useState, useEffect } from 'react'

function AdminServicesPage() {
  const [services, setServices] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', duration: '', price: '' })
  const [newForm, setNewForm] = useState({ name: '', description: '', duration: '', price: '' })

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
    <div>
      <h1>Manage Services</h1>

      <h2>Add New Service</h2>
      <form onSubmit={handleCreate}>
        <input placeholder="Name" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} />
        <input placeholder="Description" value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} />
        <input placeholder="Duration (min)" type="number" value={newForm.duration} onChange={(e) => setNewForm({ ...newForm, duration: e.target.value })} />
        <input placeholder="Price" type="number" value={newForm.price} onChange={(e) => setNewForm({ ...newForm, price: e.target.value })} />
        <button type="submit">Create Service</button>
      </form>

      <h2>All Services</h2>
      {services.map(service => (
        <div key={service.id}>
          {editingId === service.id ? (
            <div>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <button onClick={() => handleSaveEdit(service.id, service.isActive)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <h3>{service.name} {!service.isActive && '(inactive)'}</h3>
              <p>{service.description}</p>
              <p>{service.duration} min — NPR {service.price}</p>
              <button onClick={() => startEdit(service)}>Edit</button>
              <button onClick={() => toggleActive(service)}>
                {service.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default AdminServicesPage