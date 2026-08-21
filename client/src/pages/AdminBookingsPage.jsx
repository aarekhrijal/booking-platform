import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import ConfirmDialog from '@/components/ConfirmDialog'
import AdminLayout from '../components/AdminLayout'

const PAGE_SIZE = 8

function AdminBookingsPage({ user, onLogout }) {
  const [bookings, setBookings] = useState([])
  const [barbers, setBarbers] = useState([])
  const [services, setServices] = useState([])
  const [confirmAction, setConfirmAction] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [barberFilter, setBarberFilter] = useState('All')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [page, setPage] = useState(1)

  const token = localStorage.getItem('token')

  const loadData = () => {
    fetch(`${API_URL}/api/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setBookings)
    fetch(`${API_URL}/api/barbers/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setBarbers)
    fetch(`${API_URL}/api/services/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setServices)
  }

  useEffect(() => { loadData() }, [])

  const runConfirmedAction = async () => {
    const { id, type } = confirmAction
    const endpoint = type === 'noshow' ? 'no-show' : type === 'complete' ? 'complete' : 'cancel'
    await fetch(`${API_URL}/api/bookings/${id}/${endpoint}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    loadData()
  }

  const titles = { noshow: 'Mark this booking as a no-show?', complete: 'Mark this booking as completed?', cancel: 'Cancel this booking?' }

  const clientName = (b) => b.customer ? b.customer.name : b.guestName
  const bookingCode = (b) => `#RHP-${b.id.toString().padStart(4, '0')}`

  const filtered = bookings.filter(b => {
    if (search && !clientName(b)?.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'All' && b.status !== statusFilter) return false
    if (barberFilter !== 'All' && b.barberId !== Number(barberFilter)) return false
    if (serviceFilter !== 'All' && b.serviceId !== Number(serviceFilter)) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const counts = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  }

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
  <div className="relative h-40 bg-cover bg-center flex items-end" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
    <div className="relative p-6">
      <h1 className="font-heading text-2xl font-bold text-white">All Bookings</h1>
      <p className="text-slate-300 text-sm mt-1">Manage and view all bookings from your clients.</p>
    </div>
  </div>

  <div className="p-6 pt-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
            <p className="text-slate-500 text-xs">Total Bookings</p>
            <p className="text-white text-2xl font-bold mt-1">{counts.total}</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
            <p className="text-slate-500 text-xs">Confirmed</p>
            <p className="text-green-400 text-2xl font-bold mt-1">{counts.confirmed}</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
            <p className="text-slate-500 text-xs">Pending</p>
            <p className="text-amber-400 text-2xl font-bold mt-1">{counts.pending}</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
            <p className="text-slate-500 text-xs">Cancelled</p>
            <p className="text-red-400 text-2xl font-bold mt-1">{counts.cancelled}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <input
            placeholder="Search by client name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100 flex-1 min-w-[200px]"
          />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100">
            <option value="All">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No-Show</option>
          </select>
          <select value={barberFilter} onChange={(e) => { setBarberFilter(e.target.value); setPage(1) }} className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100">
            <option value="All">All Barbers</option>
            {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select value={serviceFilter} onChange={(e) => { setServiceFilter(e.target.value); setPage(1) }} className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100">
            <option value="All">All Services</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-lg mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-amber-400 text-xs border-b border-white/10">
                <th className="p-4">Booking ID</th>
                <th className="p-4">Client</th>
                <th className="p-4">Service</th>
                <th className="p-4">Barber</th>
                <th className="p-4">Date &amp; Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(b => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <p className="text-white">{bookingCode(b)}</p>
                    <p className="text-slate-600 text-xs">{b.createdAt.slice(0, 10)}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {b.customer?.photoUrl ? (
                        <img src={b.customer.photoUrl} alt={clientName(b)} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400 text-xs">
                          {clientName(b)?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white">{clientName(b)}</p>
                        <p className="text-slate-500 text-xs">{b.customer?.email || 'Guest'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{b.service.name}</td>
                  <td className="p-4 text-slate-300">{b.barber ? b.barber.name : '—'}</td>
                  <td className="p-4 text-slate-300">{b.date.slice(0, 10)}<br /><span className="text-slate-500 text-xs">{b.startTime}</span></td>
                  <td className="p-4">
                    <Badge variant={
                      b.status === 'CONFIRMED' ? 'default' :
                      b.status === 'CANCELLED' || b.status === 'NO_SHOW' ? 'destructive' : 'secondary'
                    }>{b.status}</Badge>
                  </td>
                  <td className="p-4 text-white">NPR {b.totalPrice}</td>
                  <td className="p-4">
                    {b.status === 'CONFIRMED' ? (
                      <div className="flex gap-1">
                        <button onClick={() => setConfirmAction({ id: b.id, type: 'complete' })} className="text-slate-400 hover:text-white text-xs px-2 py-1">Complete</button>
                        <button onClick={() => setConfirmAction({ id: b.id, type: 'cancel' })} className="text-slate-400 hover:text-red-400 text-xs px-2 py-1">Cancel</button>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-xs">{b.cancelledBy ? `by ${b.cancelledBy}` : '—'}</span>
                    )}
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-slate-500">No bookings match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-slate-500 text-xs">
            Showing {pageItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded border border-white/10 text-slate-300 text-sm disabled:opacity-30">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-1.5 rounded text-sm ${page === n ? 'bg-amber-400 text-black' : 'border border-white/10 text-slate-300'}`}
              >
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded border border-white/10 text-slate-300 text-sm disabled:opacity-30">›</button>
          </div>
        </div>
      </div>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction ? titles[confirmAction.type] : ''}
        description="This action cannot be undone."
        onConfirm={runConfirmedAction}
      />
    </AdminLayout>
  )
}

export default AdminBookingsPage