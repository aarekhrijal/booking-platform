import { Link, useNavigate, useLocation } from 'react-router-dom'

const CUSTOMER_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

function ProfileIcon() {
  return (
    <Link to="/profile" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center shrink-0 border border-amber-400/30">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-400">
        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v1.5c0 .7.5 1.2 1.2 1.2h17.2c.7 0 1.2-.5 1.2-1.2v-1.5c0-3.3-6.5-4.9-9.8-4.9z" />
      </svg>
    </Link>
  )
}

function Navbar({ user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="bg-black px-6 py-4 flex items-center justify-between border-b border-white/10">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Rijal's Handsome Parlor" className="h-10" />
      </Link>

      <div className="flex items-center gap-8">
        {user?.role === 'ADMIN' ? (
          <>
            <Link to="/" className="text-white/80 hover:text-amber-400">Dashboard</Link>
            <Link to="/admin/services" className="text-white/80 hover:text-amber-400">Manage Services</Link>
            <Link to="/admin/schedule" className="text-white/80 hover:text-amber-400">Manage Schedule</Link>
            <Link to="/admin/users" className="text-white/80 hover:text-amber-400">Users</Link>
            <ProfileIcon />
          </>
        ) : (
          <>
            {CUSTOMER_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`pb-1 border-b-2 transition-colors ${
                  location.pathname === link.to
                    ? 'text-amber-400 border-amber-400'
                    : 'text-white/80 border-transparent hover:text-amber-400'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/book"
              className="flex items-center gap-2 border border-amber-400 text-amber-400 px-4 py-2 rounded hover:bg-amber-400 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zM4 10v10h16V10H4z" />
              </svg>
              Book Appointment
            </Link>

            {user ? (
              <>
                <Link to="/my-bookings" className="text-white/80 hover:text-amber-400">My Bookings</Link>
                <ProfileIcon />
              </>
            ) : (
              <>
                <Link to="/find-booking" className="text-white/80 hover:text-amber-400">Find My Booking</Link>
                <Link to="/login" className="text-white/80 hover:text-amber-400">Log In</Link>
                <Link to="/register" className="bg-amber-400 text-black px-4 py-2 rounded hover:bg-amber-300">Register</Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar