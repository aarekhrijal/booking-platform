function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-6">Contact & Location</h1>

      <div className="grid gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 className="text-slate-100 font-semibold">Phone</h3>
          <p className="text-slate-400">+977-XXXXXXXXXX</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 className="text-slate-100 font-semibold">Email</h3>
          <p className="text-slate-400">contact@rijalshandsomeparlor.com</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 className="text-slate-100 font-semibold">Location</h3>
          <p className="text-slate-400">Your address here, Kathmandu, Nepal</p>
        </div>
      </div>
    </div>
  )
}

export default ContactPage