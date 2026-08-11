import { useState, useEffect } from 'react'

function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-center mt-16 text-slate-400">Loading services...</p>

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Our Services</h1>
      <div className="grid gap-4">
        {services.map(service => (
          <div key={service.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100">{service.name}</h3>
            <p className="text-slate-400 mt-1">{service.description}</p>
            <p className="text-slate-300 mt-2 font-medium">
              {service.duration} minutes — NPR {service.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServicesPage