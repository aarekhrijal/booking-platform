import { Link } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex gap-6">
        <Link to="/" className="font-bold text-lg">BookIt</Link>
        <Link to="/services" className="hover:text-slate-300">Services</Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/book" className="hover:text-slate-300">Book</Link>
            <Link to="/my-bookings" className="hover:text-slate-300">My Bookings</Link>
            {user.role === 'ADMIN' && (
              <>
                <Link to="/admin" className="hover:text-slate-300">Dashboard</Link>
                <Link to="/admin/services" className="hover:text-slate-300">Services</Link>
                <Link to="/admin/schedule" className="hover:text-slate-300">Schedule</Link>
              </>
            )}
            <button onClick={onLogout} className="bg-slate-700 px-3 py-1.5 rounded hover:bg-slate-600">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-slate-300">Log In</Link>
            <Link to="/register" className="bg-white text-slate-900 px-3 py-1.5 rounded hover:bg-slate-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar