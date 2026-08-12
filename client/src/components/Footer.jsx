import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-16">
      <div className="max-w-5xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-slate-100 font-semibold mb-2">Rijal's Handsome Parlor</h3>
          <p className="text-slate-400 text-sm">
            Quality haircuts, styling, and grooming — book online, no calls needed.
          </p>
        </div>

        <div>
          <h4 className="text-slate-300 font-medium mb-2 text-sm">Quick Links</h4>
          <div className="flex flex-col gap-1">
            <Link to="/book" className="text-slate-400 hover:text-slate-200 text-sm">Book Now</Link>
            <Link to="/about" className="text-slate-400 hover:text-slate-200 text-sm">About</Link>
            <Link to="/contact" className="text-slate-400 hover:text-slate-200 text-sm">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="text-slate-300 font-medium mb-2 text-sm">Contact</h4>
          <p className="text-slate-400 text-sm">+977-XXXXXXXXXX</p>
          <p className="text-slate-400 text-sm">contact@rijalshandsomeparlor.com</p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} Rijal's Handsome Parlor. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer