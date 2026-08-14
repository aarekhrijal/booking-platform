function AboutPage() {
  return (
    <div>
      <div
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/about-hero.png')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-slate-300 leading-relaxed">
          Rijal's Handsome Parlor has been serving the community with quality
          haircuts, styling, and grooming services. We believe everyone deserves
          to look and feel their best, and our experienced team is here to make
          that happen — no appointment call needed, just book online.
        </p>
      </div>
    </div>
  )
}

export default AboutPage