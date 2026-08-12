import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import BookingPage from './pages/BookingPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminServicesPage from './pages/AdminServicesPage'
import AdminSchedulePage from './pages/AdminSchedulePage'
import Navbar from './components/Navbar'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import Footer from './components/Footer'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleAuth = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <BrowserRouter>
    <Navbar user={user} onLogout={handleLogout} />
      <Routes>
       <Route path="/" element={user?.role === 'ADMIN' ? <AdminDashboardPage /> : <HomePage user={user} onLogout={handleLogout} />} />
        <Route path="/register" element={<RegisterPage onAuth={handleAuth} />} />
        <Route path="/login" element={<LoginPage onAuth={handleAuth} />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/services" element={<AdminServicesPage />} />
        <Route path="/admin/schedule" element={<AdminSchedulePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}



export default App