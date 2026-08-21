import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

const CATEGORIES = ['Haircuts', 'Beard', 'Styling', 'Interior', 'Experience']
const PAGE_SIZE = 12

function AdminGalleryPage({ user, onLogout }) {
  const [images, setImages] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [albumFilter, setAlbumFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)

  const token = localStorage.getItem('token')

  const loadImages = () => {
    fetch(`${API_URL}/api/gallery/all`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(setImages)
  }

  useEffect(() => { loadImages() }, [])

  const handleFileSelect = async (file) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
    const data = await response.json()
    setUploading(false)
    if (response.ok) setImageUrl(data.url)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!imageUrl) return
    await fetch(`${API_URL}/api/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ imageUrl, category, caption })
    })
    setImageUrl('')
    setCaption('')
    setShowForm(false)
    loadImages()
  }

  const toggleActive = async (image) => {
    await fetch(`${API_URL}/api/gallery/${image.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...image, isActive: !image.isActive })
    })
    loadImages()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this photo permanently?')) return
    await fetch(`${API_URL}/api/gallery/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    loadImages()
  }

  const albums = CATEGORIES.map(cat => {
    const inCategory = images.filter(img => img.category === cat)
    return { name: cat, count: inCategory.length, cover: inCategory[0]?.imageUrl }
  }).filter(a => a.count > 0)

  const filtered = images.filter(img => {
    if (search && !(img.caption || '').toLowerCase().includes(search.toLowerCase()) && !img.category.toLowerCase().includes(search.toLowerCase())) return false
    if (albumFilter !== 'All' && img.category !== albumFilter) return false
    if (statusFilter === 'Active' && !img.isActive) return false
    if (statusFilter === 'Inactive' && img.isActive) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const avgRating = 4.9 // no rating concept on gallery images; reused site-wide constant, not per-image data

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
        <div className="relative h-40 bg-cover bg-center flex items-end" style={{ backgroundImage: "url('/gallery-hero.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="relative p-6 flex justify-between items-end w-full">
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">Gallery</h1>
              <p className="text-slate-300 text-sm mt-1">Manage photos of your parlor, interiors, services and team.</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-amber-400 text-black px-4 py-2 rounded font-medium hover:bg-amber-300 text-sm">
              + Upload Photo
            </button>
          </div>
        </div>

        <div className="p-6 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Total Images</p>
              <p className="text-white text-2xl font-bold mt-1">{images.length}</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Albums</p>
              <p className="text-white text-2xl font-bold mt-1">{albums.length}</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
              <p className="text-slate-500 text-xs">Active Photos</p>
              <p className="text-white text-2xl font-bold mt-1">{images.filter(i => i.isActive).length} / {images.length}</p>
            </div>
          </div>

          {showForm && (
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 mt-6">
              <h2 className="text-white font-semibold mb-3">Upload Photo</h2>
              <form onSubmit={handleAdd} className="flex flex-col gap-2 max-w-md">
                <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])} className="text-slate-300 text-sm" />
                {imageUrl && <img src={imageUrl} alt="preview" className="w-24 h-24 object-cover rounded" />}
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-slate-100" />
                <button type="submit" disabled={uploading || !imageUrl} className="bg-amber-400 text-black rounded px-3 py-2 font-medium hover:bg-amber-300 mt-1 disabled:opacity-50 w-fit">
                  {uploading ? 'Uploading...' : 'Add to Gallery'}
                </button>
              </form>
            </div>
          )}

          {albums.length > 0 && (
            <div className="mt-8">
              <h2 className="text-white font-semibold mb-3">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {albums.map(album => (
                  <button
                    key={album.name}
                    onClick={() => { setAlbumFilter(album.name); setPage(1) }}
                    className="relative rounded-lg overflow-hidden h-32 group"
                  >
                    <img src={album.cover} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute bottom-2 left-2 text-left">
                      <p className="text-white text-sm font-semibold">{album.name}</p>
                      <p className="text-slate-300 text-xs">{album.count} Photos</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-8">
            <input
              placeholder="Search by caption or category..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100 flex-1 min-w-[200px]"
            />
            <select value={albumFilter} onChange={(e) => { setAlbumFilter(e.target.value); setPage(1) }} className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100">
              <option value="All">All Albums</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-100">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <h2 className="text-white font-semibold mt-6 mb-3">All Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pageItems.map(image => (
              <div key={image.id} className="relative rounded-lg overflow-hidden group">
                <img src={image.imageUrl} alt={image.caption || image.category} className="w-full h-40 object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 flex justify-between items-center">
                  <span className={`text-xs flex items-center gap-1 ${image.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    ● {image.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleActive(image)} className="text-white text-xs hover:text-amber-400">
                      {image.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => handleDelete(image.id)} className="text-white text-xs hover:text-red-400">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {pageItems.length === 0 && (
              <p className="text-slate-500 col-span-4 text-center py-10">No photos match your filters.</p>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <p className="text-slate-500 text-xs">Showing {pageItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded border border-white/10 text-slate-300 text-sm disabled:opacity-30">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`px-3 py-1.5 rounded text-sm ${page === n ? 'bg-amber-400 text-black' : 'border border-white/10 text-slate-300'}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded border border-white/10 text-slate-300 text-sm disabled:opacity-30">›</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminGalleryPage