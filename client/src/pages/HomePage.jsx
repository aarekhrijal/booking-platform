import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


const TESTIMONIALS = [
  { name: 'Priya Sharma', text: 'Best haircut I\'ve had in years. Booking online was so easy too.' },
  { name: 'Anish Gurung', text: 'Great service, friendly staff, and no waiting around. Highly recommend.' },
  { name: 'Sunita Rai', text: 'The facial was amazing, and I loved being able to pick my own time slot.' },
]


function HomePage({ user, onLogout }) {
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

  return (
    <div>
      <div
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/hero.png')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center px-6">
          {user ? (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Welcome back, {user.name}
              </h1>
              <p className="mt-4 text-slate-200 text-lg">
                Ready for your next appointment?
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Rijal's Handsome Parlor
              </h1>
              <p className="mt-4 text-slate-200 text-lg">
                Book your appointment online — no calls needed.
              </p>
            </>
          )}
          <Link
            to="/book"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500"
          >
            Book Now
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Our Services</h2>

        {loading ? (
          <p className="text-slate-400">Loading services...</p>
        ) : (
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
        )}
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
  <h2 className="text-2xl font-bold text-slate-100 mb-6">What Our Customers Say</h2>
  <div className="grid gap-4 md:grid-cols-3">
    {TESTIMONIALS.map((t, index) => (
      <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-300 italic">"{t.text}"</p>
        <p className="text-slate-400 mt-3 text-sm font-medium">— {t.name}</p>
      </div>
    ))}
  </div>
</div>

    </div>
  )
}

export default HomePage