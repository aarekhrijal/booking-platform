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

  if (loading) {
    return <p>Loading services...</p>
  }

  return (
    <div>
      <h1>Our Services</h1>
      {services.map(service => (
        <div key={service.id}>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <p>{service.duration} minutes — NPR {service.price}</p>
        </div>
      ))}
    </div>
  )
}

export default ServicesPage