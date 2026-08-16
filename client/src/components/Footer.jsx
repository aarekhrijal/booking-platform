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
          <div className="flex gap-3 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.5.5.7.3 1.2.6 1.7 1.1.5.5.9 1 1.1 1.7.3.7.4 1.4.5 2.5.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1.1-.2 1.8-.5 2.5-.3.7-.6 1.2-1.1 1.7-.5.5-1 .9-1.7 1.1-.7.3-1.4.4-2.5.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1.1 0-1.8-.2-2.5-.5-.7-.3-1.2-.6-1.7-1.1-.5-.5-.9-1-1.1-1.7-.3-.7-.4-1.4-.5-2.5C2 15.1 2 14.7 2 12s0-3.1.1-4.1c0-1.1.2-1.8.5-2.5.3-.7.6-1.2 1.1-1.7.5-.5 1-.9 1.7-1.1.7-.3 1.4-.4 2.5-.5C8.9 2 9.3 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z"/></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16.6 5.8c-.9-1-1.4-2.2-1.4-3.6h-3.1v13.6c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .6 0 .9.1V9.7c-.3 0-.6-.1-.9-.1-3.4 0-6.1 2.7-6.1 6.1s2.7 6.1 6.1 6.1 6.1-2.7 6.1-6.1V9.4c1.2.9 2.7 1.4 4.3 1.4V7.7c-1 0-1.9-.3-2.7-.9-.5-.3-.9-.7-1.3-1z"/></svg>
            </a>
          </div>
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