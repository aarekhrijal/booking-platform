import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const VALUES = [
  { icon: '✂', title: 'Craftsmanship', text: 'We pay attention to the smallest details.' },
  { icon: '◆', title: 'Quality', text: 'We use quality products and professional techniques.' },
  { icon: '♡', title: 'Confidence', text: 'Every service should leave you feeling your best.' },
  { icon: '★', title: 'Hospitality', text: 'You should feel comfortable from the moment you walk in.' },
]

const TESTIMONIALS = [
  { text: "The attention to detail was incredible. Easily one of the best grooming experiences I've had.", name: 'Aayush K.' },
  { text: 'Great atmosphere, professional staff, and they actually listened to what I wanted.', name: 'Suman R.' },
  { text: "I've finally found my regular barber.", name: 'Rohan M.' },
]

function BarberAvatar({ photoUrl, name }) {
  if (photoUrl) {
    return <img src={photoUrl} alt={name} className="w-20 h-20 rounded-full object-cover mx-auto" />
  }
  return (
    <div className="w-20 h-20 rounded-full bg-zinc-800 border border-amber-400/30 flex items-center justify-center mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-amber-400">
        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v1.5c0 .7.5 1.2 1.2 1.2h17.2c.7 0 1.2-.5 1.2-1.2v-1.5c0-3.3-6.5-4.9-9.8-4.9z" />
      </svg>
    </div>
  )
}

function AboutPage() {
  const [barbers, setBarbers] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/api/barbers`)
      .then(res => res.json())
      .then(setBarbers)
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[340px] bg-cover bg-center flex items-center justify-center text-center" style={{ backgroundImage: "url('/about-hero.png')" }}>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative px-6">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium">ABOUT RIJAL'S</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">More Than a Haircut</h1>
          <p className="text-slate-300 mt-4 max-w-xl mx-auto">
            At Rijal's Handsome Parlor, grooming is more than a service. It's an experience built around
            confidence, style, and the way you want to feel when you leave our chair.
          </p>
          <Link to="/book" className="inline-block mt-6 bg-amber-400 text-black px-6 py-3 rounded font-medium hover:bg-amber-300">
            Book an Appointment
          </Link>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-black">
        <div className="max-w-5xl mx-auto px-6 py-20 grid gap-10 md:grid-cols-2 items-center">
          <img src="/story.png" alt="Rijal's Handsome Parlor" className="w-full h-80 object-cover rounded-lg border border-white/10" />
          <div>
            <p className="text-amber-400 tracking-[0.3em] text-sm font-medium">OUR STORY</p>
            <h2 className="font-heading text-3xl font-bold text-white mt-2">Where Style Meets Confidence</h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Rijal's Handsome Parlor was created with a simple idea: every person deserves to leave the
              barber chair feeling confident.
            </p>
            <p className="text-slate-400 mt-4 leading-relaxed">
              What started as a passion for modern grooming has grown into a place where craftsmanship,
              comfort, and personal style come together. Our team takes the time to understand every client
              and create a look that feels uniquely theirs.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 py-20 grid gap-6 md:grid-cols-2">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-8">
            <h3 className="font-heading text-xl font-bold text-amber-400">Our Mission</h3>
            <p className="text-slate-400 mt-3">
              To provide exceptional grooming services that help every client look sharp, feel confident,
              and enjoy every visit.
            </p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-8">
            <h3 className="font-heading text-xl font-bold text-amber-400">Our Vision</h3>
            <p className="text-slate-400 mt-3">
              To become a trusted destination for modern men's grooming, known for quality, creativity,
              and an unforgettable experience.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-black">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium text-center">OUR VALUES</p>
          <h2 className="font-heading text-3xl font-bold text-white mt-2 text-center">What We Stand For</h2>
          <div className="grid gap-6 md:grid-cols-4 mt-10">
            {VALUES.map(v => (
              <div key={v.title} className="text-center">
                <div className="w-14 h-14 rounded-full border border-amber-400/40 flex items-center justify-center text-amber-400 text-2xl mx-auto">
                  {v.icon}
                </div>
                <h3 className="text-white font-semibold mt-3">{v.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barbers */}
      <div className="bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium text-center">OUR TEAM</p>
          <h2 className="font-heading text-3xl font-bold text-white mt-2 text-center">Meet The Experts</h2>
          <div className="grid gap-6 md:grid-cols-3 mt-10">
            {barbers.map(barber => (
              <div key={barber.id} className="bg-zinc-900 border border-white/10 rounded-lg p-6 text-center hover:border-amber-400/40 transition-colors">
                <BarberAvatar photoUrl={barber.photoUrl} name={barber.name} />
                <h3 className="text-white font-semibold mt-4">{barber.name}</h3>
                <p className="text-slate-400 text-sm">{barber.title}</p>
                <p className="text-slate-500 text-xs mt-1">{barber.experience}</p>
                <p className="text-amber-400 text-sm mt-2">⭐ {barber.rating}</p>
                <Link to="/book" className="text-white/70 hover:text-amber-400 text-sm mt-3 inline-block">
                  View Profile →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Space */}
      <div className="bg-black">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium text-center">OUR SPACE</p>
          <h2 className="font-heading text-3xl font-bold text-white mt-2 text-center">Designed For Your Comfort</h2>
          <p className="text-slate-400 text-center mt-3 max-w-xl mx-auto">
            From the lighting to the chairs, every detail of Rijal's Handsome Parlor has been designed to
            create a comfortable and modern grooming experience.
          </p>
          <div className="grid gap-4 md:grid-cols-3 mt-10">
            <img src="/space-1.png" alt="Main barber area" className="w-full h-56 object-cover rounded-lg border border-white/10" />
            <img src="/space-2.png" alt="Waiting area" className="w-full h-56 object-cover rounded-lg border border-white/10" />
            <img src="/space-3.png" alt="Grooming stations" className="w-full h-56 object-cover rounded-lg border border-white/10" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-400 py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="font-heading text-3xl font-bold text-black">5+</p>
            <p className="text-black/70 text-sm mt-1">Years of Experience</p>
          </div>
          <div>
            <p className="font-heading text-3xl font-bold text-black">2K+</p>
            <p className="text-black/70 text-sm mt-1">Happy Clients</p>
          </div>
          <div>
            <p className="font-heading text-3xl font-bold text-black">{barbers.length || '10'}+</p>
            <p className="text-black/70 text-sm mt-1">Expert Barbers</p>
          </div>
          <div>
            <p className="font-heading text-3xl font-bold text-black">4.9★</p>
            <p className="text-black/70 text-sm mt-1">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-black">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium text-center">TESTIMONIALS</p>
          <h2 className="font-heading text-3xl font-bold text-white mt-2 text-center">Loved By Our Clients</h2>
          <div className="grid gap-6 md:grid-cols-3 mt-10">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 rounded-lg p-6">
                <p className="text-amber-400 text-sm">⭐⭐⭐⭐⭐</p>
                <p className="text-slate-300 italic mt-3">"{t.text}"</p>
                <p className="text-white/70 text-sm mt-4">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-24 text-center px-6 bg-cover bg-center" style={{ backgroundImage: "url('/cta-bg.png')" }}>
  <div className="absolute inset-0 bg-black/75" />
  <div className="relative">
    <h2 className="font-heading text-3xl font-bold text-white">Ready for Your Next Look?</h2>
    <p className="text-slate-300 mt-2">Book your appointment with Rijal's Handsome Parlor today.</p>
    <Link to="/book" className="inline-block mt-6 bg-amber-400 text-black px-6 py-3 rounded font-medium hover:bg-amber-300">
      Book an Appointment →
    </Link>
  </div>
</div>
    </div>
  )
}

export default AboutPage