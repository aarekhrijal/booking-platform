import { Link, useNavigate } from 'react-router-dom'

function ProfileIcon() {
  return (
    <Link
      to="/profile"
      className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 text-slate-200"
      >
        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v1.5c0 .7.5 1.2 1.2 1.2h17.2c.7 0 1.2-.5 1.2-1.2v-1.5c0-3.3-6.5-4.9-9.8-4.9z" />
      </svg>
    </Link>
  )
}

function Navbar({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Rijal's Handsome Parlor" className="h-9" />
      </Link>

      <div className="flex items-center gap-6">
        {user?.role === 'ADMIN' ? (
          <>
            <Link to="/" className="hover:text-slate-300">Dashboard</Link>
            <Link to="/admin/services" className="hover:text-slate-300">Manage Services</Link>
            <Link to="/admin/schedule" className="hover:text-slate-300">Manage Schedule</Link>
            <Link to="/admin/users" className="hover:text-slate-300">Users</Link>
            <ProfileIcon />
          </>
        ) : user ? (
          <>
            <Link to="/" className="hover:text-slate-300">Home</Link>
            <Link to="/about" className="hover:text-slate-300">About</Link>
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
            <Link to="/book" className="bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-500">Book Now</Link>
            <Link to="/my-bookings" className="hover:text-slate-300">My Bookings</Link>
            <ProfileIcon />
          </>
        ) : (
          <>
            <Link to="/" className="hover:text-slate-300">Home</Link>
            <Link to="/about" className="hover:text-slate-300">About</Link>
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
            <Link to="/book" className="bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-500">Book Now</Link>
            <Link to="/find-booking" className="hover:text-slate-300">Find My Booking</Link>
            <Link to="/login" className="hover:text-slate-300">Log In</Link>
            <Link to="/register" className="bg-white text-slate-900 px-3 py-1.5 rounded hover:bg-slate-200">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar