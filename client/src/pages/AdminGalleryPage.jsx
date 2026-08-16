import { useState, useEffect } from 'react'

const CATEGORIES = ['Haircuts', 'Beard', 'Styling', 'Interior', 'Experience']

function AdminGalleryPage() {
  const [images, setImages] = useState([])
  const [category, setCategory] = useState(CATEGORIES[0])
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const token = localStorage.getItem('token')

  const loadImages = () => {
    fetch('http://localhost:5000/api/gallery')
      .then(res => res.json())
      .then(setImages)
  }

  useEffect(() => {
    loadImages()
  }, [])

  const handleFileSelect = async (file) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('http://localhost:5000/api/upload', {
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

    await fetch('http://localhost:5000/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ imageUrl, category, caption })
    })

    setImageUrl('')
    setCaption('')
    loadImages()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this photo from the gallery?')) return
    await fetch(`http://localhost:5000/api/gallery/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    loadImages()
  }

  const moveImage = async (image, direction) => {
    const newOrder = direction === 'up' ? image.order - 1 : image.order + 1
    await fetch(`http://localhost:5000/api/gallery/${image.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...image, order: newOrder })
    })
    loadImages()
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Manage Gallery</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-8">
        <h2 className="text-slate-100 font-semibold mb-3">Add Photo</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
            className="text-slate-300 text-sm"
          />
          {imageUrl && <img src={imageUrl} alt="preview" className="w-32 h-32 object-cover rounded mt-1" />}

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100"
          />

          <button type="submit" disabled={uploading || !imageUrl} className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-500 mt-1 disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Add to Gallery'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-slate-100 mb-3">All Photos ({images.length})</h2>
      <div className="grid gap-3">
        {images.map((image, index) => (
          <div key={image.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-4">
            <img src={image.imageUrl} alt={image.caption || image.category} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="text-slate-100 text-sm font-medium">{image.category}</p>
              {image.caption && <p className="text-slate-400 text-xs">{image.caption}</p>}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => moveImage(image, 'up')}
                disabled={index === 0}
                className="text-slate-400 hover:text-slate-200 disabled:opacity-30 px-2"
              >
                ↑
              </button>
              <button
                onClick={() => moveImage(image, 'down')}
                disabled={index === images.length - 1}
                className="text-slate-400 hover:text-slate-200 disabled:opacity-30 px-2"
              >
                ↓
              </button>
            </div>
            <button onClick={() => handleDelete(image.id)} className="text-red-400 hover:underline text-sm">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminGalleryPage