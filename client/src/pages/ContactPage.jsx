import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const REASONS = ['General Inquiry', 'Booking Help', 'Service Question', 'Feedback', 'Partnership', 'Other']

function ContactPage() {
  const [hours, setHours] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: REASONS[0], subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/api/schedule/working-hours')
      .then(res => res.json())
      .then(setHours)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[300px] bg-cover bg-center flex items-center justify-center text-center" style={{ backgroundImage: "url('/contact-hero.png')" }}>
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative px-6">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium">GET IN TOUCH</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">We'd Love to Hear From You</h1>
          <p className="text-slate-300 mt-4 max-w-xl mx-auto">
            Have a question, need help with your booking, or simply want to know more? We're here for you.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="bg-black">
        <div className="max-w-5xl mx-auto px-6 py-16 grid gap-4 md:grid-cols-4">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 text-center">
            <p className="text-2xl">📍</p>
            <h3 className="text-white font-semibold mt-2">Visit Us</h3>
            <p className="text-slate-400 text-sm mt-1">Rijal's Handsome Parlor</p>
            <p className="text-slate-400 text-sm">Kathmandu, Nepal</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 text-center">
            <p className="text-2xl">📞</p>
            <h3 className="text-white font-semibold mt-2">Call Us</h3>
            <p className="text-slate-400 text-sm mt-1">+977-98XXXXXXXX</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 text-center">
            <p className="text-2xl">✉</p>
            <h3 className="text-white font-semibold mt-2">Email Us</h3>
            <p className="text-slate-400 text-sm mt-1">hello@rijalshandsome.com</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 text-center">
            <p className="text-2xl">🕐</p>
            <h3 className="text-white font-semibold mt-2">Opening Hours</h3>
            <div className="mt-1">
              {hours.map(day => (
                <p key={day.dayOfWeek} className="text-slate-400 text-xs">
                  {DAY_NAMES[day.dayOfWeek]}: {day.isOpen ? `${day.startTime}–${day.endTime}` : 'Closed'}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-zinc-950">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium text-center">CONTACT FORM</p>
          <h2 className="font-heading text-3xl font-bold text-white mt-2 text-center">Send Us a Message</h2>

          {submitted ? (
            <div className="bg-zinc-900 border border-amber-400/30 rounded-lg p-8 mt-8 text-center">
              <p className="text-amber-400 text-lg font-semibold">Thank you!</p>
              <p className="text-slate-400 mt-2">We've received your message and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-8">
              <input
                placeholder="Full Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-slate-100"
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-slate-100"
              />
              <input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-slate-100"
              />
              <select
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-slate-100"
              >
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <input
                placeholder="Subject *"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-slate-100"
              />
              <textarea
                placeholder="Message *"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-slate-100"
              />
              <button type="submit" className="bg-amber-400 text-black rounded px-4 py-3 font-medium hover:bg-amber-300 mt-1">
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="relative py-24 text-center px-6 bg-cover bg-center" style={{ backgroundImage: "url('/cta-bg.png')" }}>
  <div className="absolute inset-0 bg-black/75" />
  <div className="relative">
    <h2 className="font-heading text-3xl font-bold text-white">Ready for Your Next Look?</h2>
    <p className="text-slate-300 mt-2">Skip the wait and book your preferred service online.</p>
    <Link to="/book" className="inline-block mt-6 bg-amber-400 text-black px-6 py-3 rounded font-medium hover:bg-amber-300">
      Book an Appointment →
    </Link>
  </div>
</div>

      {/* Location / Map */}
      <div className="bg-black">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium text-center">FIND US</p>
          <h2 className="font-heading text-3xl font-bold text-white mt-2 text-center mb-10">Find Us</h2>

          <div className="bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
            <iframe
              title="location map"
              className="w-full h-72"
              src="https://www.google.com/maps?q=Kathmandu,Nepal&output=embed"
            />
            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-white font-medium">Rijal's Handsome Parlor, Kathmandu, Nepal</p>
                <p className="text-slate-400 text-sm mt-1">Near [nearby landmark] — easy access, street parking available</p>
              </div>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Kathmandu,Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-400 text-black px-4 py-2 rounded font-medium hover:bg-amber-300 text-sm shrink-0 text-center"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage