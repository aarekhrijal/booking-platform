import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const WHY_CHOOSE_US = [
  { icon: '✂', title: 'Expert Barbers', text: 'Skilled professionals who understand modern styles.' },
  { icon: '💎', title: 'Premium Products', text: 'High-quality products chosen for your hair and skin.' },
  { icon: '🪑', title: 'Modern Environment', text: 'A comfortable, sophisticated space designed for you.' },
  { icon: '📅', title: 'Easy Booking', text: 'Book your preferred service and time in just a few clicks.' },
]

const BARBERS = [
  { name: 'Hasan Ali', title: 'Senior Barber', rating: 4.9, experience: '12 years experience' },
  { name: 'Jabed Khan', title: 'Stylist', rating: 4.8, experience: '7 years experience' },
  { name: 'Rohan Sharma', title: 'Master Barber', rating: 5.0, experience: '10 years experience' },
]

const REVIEWS = [
  { name: 'Aayush K.', text: "Best haircut experience I've had. The attention to detail was incredible." },
  { name: 'Priya Sharma', text: "Booking online was so easy, and the service was excellent." },
  { name: 'Anish Gurung', text: "Friendly staff, great atmosphere, no waiting around." },
]

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function BarberAvatar() {
  return (
    <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-slate-400">
        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v1.5c0 .7.5 1.2 1.2 1.2h17.2c.7 0 1.2-.5 1.2-1.2v-1.5c0-3.3-6.5-4.9-9.8-4.9z" />
      </svg>
    </div>
  )
}

function HomePage({ user }) {
  const [services, setServices] = useState([])
  const [hours, setHours] = useState([])
  const location = useLocation()

  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then(res => res.json())
      .then(setServices)

    fetch(`${API_URL}/api/schedule/working-hours`)
      .then(res => res.json())
      .then(setHours)
  }, [])

  useEffect(() => {
    if (location.hash && services.length > 0) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash, services])

  return (
    <div>
{/* Hero */}
<div className="relative h-[640px] bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/hero.png')" }}>
  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.92)_28%,rgba(0,0,0,0.55)_55%,transparent_90%)]" />
  <div className="relative max-w-2xl px-6 md:px-16">
    <p className="text-amber-400 tracking-[0.3em] text-sm font-medium">PREMIUM GROOMING</p>
    <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mt-4 leading-tight">
      Style That<br /><span className="text-amber-400">Speaks For You.</span>
    </h1>
    <div className="flex items-center gap-4 my-6 text-amber-400">
      <div className="h-px bg-amber-400/40 flex-1" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M9.64 7.64a3 3 0 1 0 1.42 1.42l4.24 4.24a3 3 0 1 0 1.06-1.06L11.2 7.9a3 3 0 0 0-1.56-.26zM5 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm14 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM5 17a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM19 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
      <div className="h-px bg-amber-400/40 flex-1" />
    </div>
    <p className="text-slate-300 text-lg">
      Premium grooming, modern style, and an experience crafted around you.
    </p>
    <div className="flex gap-4 mt-8">
      <Link to="/book" className="bg-amber-400 text-black px-6 py-3 rounded font-medium hover:bg-amber-300 flex items-center gap-2">
        Book an Appointment
      </Link>
      <Link to="#services" className="border border-white/30 text-white px-6 py-3 rounded font-medium hover:border-amber-400 hover:text-amber-400 flex items-center gap-2">
        Explore Services →
      </Link>
    </div>
    <div className="flex gap-8 mt-10 text-slate-300 text-sm">
      <span>⭐ 4.9/5 Rating</span>
      <span>2K+ Happy Clients</span>
      <span>5+ Years Experience</span>
    </div>
  </div>
</div>

{/* Why Choose Us bar */}
<div className="bg-black border-t border-white/10">
  <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
    {WHY_CHOOSE_US.map((item, index) => (
      <div key={item.title} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border border-amber-400/40 flex items-center justify-center text-amber-400 text-xl shrink-0">
          {item.icon}
        </div>
        <div>
          <h3 className="text-white text-sm font-semibold">{item.title}</h3>
          <p className="text-slate-400 text-xs">{item.text}</p>
        </div>
      </div>
    ))}
  </div>
</div>
{/* Services */}
<div id="services" className="bg-black scroll-mt-20">
  <div className="max-w-5xl mx-auto px-6 py-20">
    <p className="text-amber-400 tracking-[0.3em] text-sm font-medium">OUR SERVICES</p>
    <h2 className="font-heading text-3xl font-bold text-white mt-2">Tailored Cuts. Timeless Style.</h2>

    <div className="grid gap-6 md:grid-cols-3 mt-10">
      {services.map(service => (
  <div key={service.id} className="bg-zinc-900 border border-white/10 rounded-lg overflow-hidden hover:border-amber-400/40 transition-colors">
    {service.imageUrl ? (
      <img src={service.imageUrl} alt={service.name} className="w-full h-40 object-cover" />
    ) : (
      <div className="w-full h-40 bg-zinc-800 flex items-center justify-center text-amber-400 text-3xl">
        ✂
      </div>
    )}
    <div className="p-6">
      <h3 className="text-white font-semibold">{service.name}</h3>
          <p className="text-slate-400 text-sm mt-1">{service.description}</p>
          <p className="text-amber-400 mt-4 font-medium">{service.duration} min — NPR {service.price}</p>
          <Link to="/book" className="text-white/70 hover:text-amber-400 text-sm mt-3 inline-block">
            Book Now →
          </Link>
          
        </div>
      </div>
      ))}
    </div>
  </div>
  
</div>

{/* Barbers */}
<div id="barbers" className="bg-zinc-950 scroll-mt-20">
  <div className="max-w-5xl mx-auto px-6 py-20">
    <p className="text-amber-400 tracking-[0.3em] text-sm font-medium text-center">OUR TEAM</p>
    <h2 className="font-heading text-3xl font-bold text-white mt-2 text-center">Meet The Experts</h2>

    <div className="grid gap-6 md:grid-cols-3 mt-10">
      {BARBERS.map(barber => (
        <div key={barber.name} className="bg-zinc-900 border border-white/10 rounded-lg p-6 text-center hover:border-amber-400/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border border-amber-400/30 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-amber-400">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v1.5c0 .7.5 1.2 1.2 1.2h17.2c.7 0 1.2-.5 1.2-1.2v-1.5c0-3.3-6.5-4.9-9.8-4.9z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mt-4">{barber.name}</h3>
          <p className="text-slate-400 text-sm">{barber.title}</p>
          <p className="text-amber-400 text-sm mt-2">⭐ {barber.rating}</p>
          <p className="text-slate-500 text-xs mt-1">{barber.experience}</p>
        </div>
      ))}
    </div>
  </div>
</div>

{/* Reviews */}
<div id="reviews" className="bg-black scroll-mt-20">
  <div className="max-w-5xl mx-auto px-6 py-20">
    <p className="text-amber-400 tracking-[0.3em] text-sm font-medium text-center">TESTIMONIALS</p>
    <h2 className="font-heading text-3xl font-bold text-white mt-2 text-center">What Our Clients Say</h2>
    <p className="text-slate-400 text-center mt-2">4.9 / 5 — Based on 500+ reviews</p>

    <div className="grid gap-6 md:grid-cols-3 mt-10">
      {REVIEWS.map((review, index) => (
        <div key={index} className="bg-zinc-900 border border-white/10 rounded-lg p-6">
          <p className="text-amber-400 text-sm">⭐⭐⭐⭐⭐</p>
          <p className="text-slate-300 italic mt-3">"{review.text}"</p>
          <p className="text-white/70 text-sm mt-4">— {review.name}</p>
        </div>
      ))}
    </div>
  </div>
</div>

{/* Special Offer CTA */}
<div
  className="relative py-24 text-center px-6 bg-cover bg-center"
  style={{ backgroundImage: "url('/cta-bg.png')" }}
>
  <div className="absolute inset-0 bg-black/70" />
  <div className="relative">
    <p className="text-amber-400 text-sm font-semibold tracking-widest">10% OFF YOUR FIRST VISIT</p>
    <h2 className="font-heading text-3xl font-bold text-white mt-2">Look Good. Feel Confident.</h2>
    <p className="text-slate-300 mt-2">Your next great look is only one appointment away.</p>
    <Link to="/book" className="inline-block mt-6 bg-amber-400 text-black px-6 py-3 rounded font-medium hover:bg-amber-300">
      Book Your Appointment →
    </Link>
  </div>
</div>

{/* Location + Hours */}
<div className="bg-zinc-950">
  <div className="max-w-5xl mx-auto px-6 py-20 grid gap-10 md:grid-cols-2">
    <div>
      <p className="text-amber-400 tracking-[0.3em] text-sm font-medium">VISIT US</p>
      <h2 className="font-heading text-2xl font-bold text-white mt-2 mb-4">Visit Rijal's</h2>
      <p className="text-slate-400">📍 Kathmandu, Nepal</p>
      <p className="text-slate-400 mt-1">📞 +977-XXXXXXXXXX</p>
      <p className="text-slate-400 mt-1">✉ contact@rijalshandsomeparlor.com</p>

      <h3 className="text-white font-semibold mt-6 mb-2">Opening Hours</h3>
      {hours.map(day => (
        <p key={day.dayOfWeek} className="text-slate-400 text-sm">
          {DAY_NAMES[day.dayOfWeek]}: {day.isOpen ? `${day.startTime} – ${day.endTime}` : 'Closed'}
        </p>
      ))}
    </div>

    <iframe
      title="location map"
      className="w-full h-64 rounded-lg border border-white/10"
      src="https://www.google.com/maps?q=Kathmandu,Nepal&output=embed"
    />
  </div>
</div>
</div>
  )
}

export default HomePage