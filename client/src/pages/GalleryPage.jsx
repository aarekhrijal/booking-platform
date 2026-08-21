import { API_URL } from '../config'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const FILTERS = ['All', 'Haircuts', 'Beard', 'Styling', 'Interior', 'Experience']

const BEFORE_AFTER = [
  { label: 'Haircut Transformation', before: '/ba-1-before.png', after: '/ba-1-after.png' },
  { label: 'Beard Transformation', before: '/ba-2-before.png', after: '/ba-2-after.png' },
  { label: 'Hair Styling', before: '/ba-3-before.png', after: '/ba-3-after.png' },
]

function BeforeAfterSlider({ before, after, label }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const updatePosition = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect()
    const percent = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, percent)))
  }

  const handleMouseDown = () => { dragging.current = true }
  const handleMouseUp = () => { dragging.current = false }
  const handleMouseMove = (e) => {
    if (dragging.current) updatePosition(e.clientX)
  }
  const handleTouchMove = (e) => {
    updatePosition(e.touches[0].clientX)
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="relative w-full h-72 rounded-lg overflow-hidden select-none cursor-ew-resize border border-white/10"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <img src={after} alt={`${label} after`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={before} alt={`${label} before`} className="w-full h-72 object-cover" style={{ width: containerRef.current?.offsetWidth || '100%' }} />
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-black text-xs font-bold">
            ↔
          </div>
        </div>
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Before</span>
        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">After</span>
      </div>
      <p className="text-slate-400 text-sm mt-2 text-center">{label}</p>
    </div>
  )
}

function GalleryPage() {
  const [images, setImages] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then(res => res.json())
      .then(setImages)
  }, [])

  const filteredImages = activeFilter === 'All'
    ? images
    : images.filter(img => img.category === activeFilter)

  return (
    <div className="bg-black">
      {/* Hero */}
      <div className="relative h-[300px] bg-cover bg-center flex items-center justify-center text-center" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative px-6">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium">OUR GALLERY</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">Style. Craft. Confidence.</h1>
          <p className="text-slate-300 mt-4 max-w-xl mx-auto">
            Take a look inside Rijal's Handsome Parlor and explore our work, our space, and the details
            behind the experience.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                activeFilter === f
                  ? 'bg-amber-400 text-black border-amber-400'
                  : 'text-white/80 border-white/20 hover:border-amber-400/50 hover:text-amber-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-10">
          {filteredImages.map(image => (
            <div key={image.id} className="rounded-lg overflow-hidden border border-white/10">
              <img src={image.imageUrl} alt={image.caption || image.category} className="w-full h-56 object-cover" />
              {image.caption && (
                <p className="text-slate-400 text-sm p-2 bg-zinc-900">{image.caption}</p>
              )}
            </div>
          ))}
          {filteredImages.length === 0 && (
            <p className="text-slate-500 col-span-3 text-center py-10">No photos in this category yet.</p>
          )}
        </div>
      </div>

      {/* Before & After */}
      <div className="bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-medium text-center">THE TRANSFORMATION</p>
          <h2 className="font-heading text-3xl font-bold text-white mt-2 text-center mb-2">The Transformation</h2>
          <p className="text-slate-500 text-sm text-center mb-10">Drag the slider to compare</p>

          <div className="grid gap-8 md:grid-cols-3">
            {BEFORE_AFTER.map((item, i) => (
              <BeforeAfterSlider key={i} before={item.before} after={item.after} label={item.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div
        className="relative py-24 text-center px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/cta-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative">
          <h2 className="font-heading text-3xl font-bold text-white">Seen Enough?</h2>
          <p className="text-slate-300 mt-2">Your next look is waiting.</p>
          <Link to="/book" className="inline-block mt-6 bg-amber-400 text-black px-6 py-3 rounded font-medium hover:bg-amber-300">
            Book an Appointment →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GalleryPage