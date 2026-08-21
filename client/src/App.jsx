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
import AdminUsersPage from './pages/AdminUsersPage'
import LookupBookingPage from './pages/LookupBookingPage'
import ProfilePage from './pages/ProfilePage'
import AdminBarbersPage from './pages/AdminBarbersPage'
import GalleryPage from './pages/GalleryPage'
import AdminGalleryPage from './pages/AdminGalleryPage'
import ScrollToTop from './components/ScrollToTop'
import AdminBookingsPage from './pages/AdminBookingsPage'

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
      <ScrollToTop />
      {user?.role !== 'ADMIN' && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={user?.role === 'ADMIN' ? <AdminDashboardPage user={user} onLogout={handleLogout} /> :
         <HomePage user={user} onLogout={handleLogout} />} />
        <Route path="/register" element={<RegisterPage onAuth={handleAuth} />} />
        <Route path="/login" element={<LoginPage onAuth={handleAuth} />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage user={user} />} />
<Route path="/admin/services" element={<AdminServicesPage user={user} onLogout={handleLogout} />} />    
<Route path="/admin/schedule" element={<AdminSchedulePage user={user} onLogout={handleLogout} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/find-booking" element={<LookupBookingPage />} />
<Route path="/admin/users" element={<AdminUsersPage user={user} onLogout={handleLogout} />} />
<Route path="/admin/barbers" element={<AdminBarbersPage user={user} onLogout={handleLogout} />} />     
   <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} onLogout={handleLogout} />} />
        <Route path="/gallery" element={<GalleryPage />} />
<Route path="/admin/gallery" element={<AdminGalleryPage user={user} onLogout={handleLogout} />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage user={user} onLogout={handleLogout} />} />
      </Routes>
{user?.role !== 'ADMIN' && <Footer />}    </BrowserRouter>
  )
}

export default App