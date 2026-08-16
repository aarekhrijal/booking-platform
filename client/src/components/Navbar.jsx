import { Link, useNavigate, useLocation } from 'react-router-dom'

const CUSTOMER_LINKS_GUEST = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
  { to: '/find-booking', label: 'Find My Booking' },
]

const CUSTOMER_LINKS_LOGGED_IN = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
  { to: '/my-bookings', label: 'My Bookings' },
]

function ProfileIcon() {
  return (
    <Link to="/profile" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 border border-amber-400/30">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400">
        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v1.5c0 .7.5 1.2 1.2 1.2h17.2c.7 0 1.2-.5 1.2-1.2v-1.5c0-3.3-6.5-4.9-9.8-4.9z" />
      </svg>
    </Link>
  )
}

function Navbar({ user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const links = user ? CUSTOMER_LINKS_LOGGED_IN : CUSTOMER_LINKS_GUEST

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-amber-400/20">
      <div className="w-full px-6 py-2.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Rijal's Handsome Parlor" className="h-10" />
        </Link>

        {user?.role === 'ADMIN' ? (
          <>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-white/80 hover:text-amber-400 text-sm">Dashboard</Link>
              <Link to="/admin/services" className="text-white/80 hover:text-amber-400 text-sm">Services</Link>
              <Link to="/admin/schedule" className="text-white/80 hover:text-amber-400 text-sm">Schedule</Link>
              <Link to="/admin/barbers" className="text-white/80 hover:text-amber-400 text-sm">Barbers</Link>
              <Link to="/admin/users" className="text-white/80 hover:text-amber-400 text-sm">Users</Link>
              <Link to="/admin/gallery" className="text-white/80 hover:text-amber-400 text-sm">Gallery</Link>
            </div>
            <ProfileIcon />
          </>
        ) : (
          <>
            <div className="flex items-center gap-6">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`pb-0.5 border-b-2 text-sm whitespace-nowrap transition-colors ${
                    location.pathname === link.to
                      ? 'text-amber-400 border-amber-400'
                      : 'text-white/80 border-transparent hover:text-amber-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <ProfileIcon />
              ) : (
                <Link to="/login" className="text-white/80 hover:text-amber-400 text-sm">Log In</Link>
              )}
              <Link
                to="/book"
                className="flex items-center gap-2 border border-amber-400/50 text-amber-400 px-3 py-1.5 rounded hover:bg-amber-400 hover:text-black transition-colors text-sm whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zM4 10v10h16V10H4z" />
                </svg>
                Book Appointment
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar