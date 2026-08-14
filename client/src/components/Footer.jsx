import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer
      className="relative bg-cover bg-center border-t border-white/10"
      style={{ backgroundImage: "url('/footer-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative max-w-5xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-heading text-white font-semibold mb-2">Rijal's Handsome Parlor</h3>
          <p className="text-slate-400 text-sm">
            Quality haircuts, styling, and grooming — book online, no calls needed.
          </p>
        </div>

        <div>
          <h4 className="text-amber-400 font-medium mb-2 text-sm tracking-wide">Quick Links</h4>
          <div className="flex flex-col gap-1">
            <Link to="/" className="text-slate-400 hover:text-amber-400 text-sm">Home</Link>
            <Link to="/book" className="text-slate-400 hover:text-amber-400 text-sm">Book Now</Link>
            <Link to="/about" className="text-slate-400 hover:text-amber-400 text-sm">About</Link>
            <Link to="/contact" className="text-slate-400 hover:text-amber-400 text-sm">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="text-amber-400 font-medium mb-2 text-sm tracking-wide">Contact</h4>
          <p className="text-slate-400 text-sm">+977-XXXXXXXXXX</p>
          <p className="text-slate-400 text-sm">contact@rijalshandsomeparlor.com</p>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-4 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} Rijal's Handsome Parlor. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer