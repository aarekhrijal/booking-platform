import { Link, useNavigate } from 'react-router-dom'

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
    <button onClick={() => { onLogout(); navigate('/') }} className="bg-slate-700 px-3 py-1.5 rounded hover:bg-slate-600">
      Log out
    </button>
  </>
) :  user ? (
          <>
            <Link to="/" className="hover:text-slate-300">Home</Link>
            <Link to="/about" className="hover:text-slate-300">About</Link>
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
            <Link to="/book" className="bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-500">Book Now</Link>
            <Link to="/my-bookings" className="hover:text-slate-300">My Bookings</Link>
            <button onClick={() => { onLogout(); navigate('/') }} className="bg-slate-700 px-3 py-1.5 rounded hover:bg-slate-600">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="hover:text-slate-300">Home</Link>
            <Link to="/about" className="hover:text-slate-300">About</Link>
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
            <Link to="/book" className="bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-500">Book Now</Link>
            <Link to="/login" className="hover:text-slate-300">Log In</Link>
            <Link to="/register" className="bg-white text-slate-900 px-3 py-1.5 rounded hover:bg-slate-200">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar