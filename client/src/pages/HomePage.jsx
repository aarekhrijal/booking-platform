import { Link } from 'react-router-dom'

function HomePage({ user, onLogout }) {
  if (!user) {
    return (
      <div>
        <div
          className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Rijal's Handsome Parlor
            </h1>
            <p className="mt-4 text-slate-200 text-lg">
              Book your appointment online — no calls needed.
            </p>
            <Link
              to="/book"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-100">Welcome, {user.name}</h1>
      <p className="mt-2 text-slate-400">Role: {user.role}</p>
      <button
        onClick={onLogout}
        className="mt-6 bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
      >
        Log out
      </button>
    </div>
  )
}

export default HomePage