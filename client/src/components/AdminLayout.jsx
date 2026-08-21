import { Link, useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { to: '/admin/users', label: 'Clients', icon: '👥' },
  { to: '/admin/barbers', label: 'Barbers', icon: '✂' },
  { to: '/admin/services', label: 'Services', icon: '📋' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼' },
  { to: '/admin/schedule', label: 'Schedule', icon: '⚙' },
]

function AdminLayout({ user, onLogout, children }) {
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) {
    return <p className="bg-black min-h-screen text-slate-400 p-6">Loading...</p>
  }

  return (
    <div className="bg-black min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-white/10 flex flex-col shrink-0">
        <div className="p-5 flex items-center gap-2 border-b border-white/10">
          <img src="/logo.png" alt="Rijal's Handsome Parlor" className="h-9" />
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                location.pathname === item.to
                  ? 'bg-amber-400/10 text-amber-400 border-l-2 border-amber-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => { onLogout(); navigate('/') }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-slate-400 hover:text-red-400 hover:bg-red-950/30"
          >
            <span>↩</span> Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-zinc-900 border-b border-white/10 px-6 py-3 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400 text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm leading-tight">{user.name}</p>
              <p className="text-slate-500 text-xs leading-tight">Admin</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout