function HomePage({ user, onLogout }) {
  if (!user) {
    return <h1>Welcome to the booking platform. Please log in or register.</h1>
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>
      <button onClick={onLogout}>Log out</button>
    </div>
  )
}

export default HomePage