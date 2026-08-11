
function HomePage({ user, onLogout }) {
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-100">
          Welcome to the booking platform
        </h1>
        <p className="mt-2 text-slate-400">Please log in or register to get started.</p>
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