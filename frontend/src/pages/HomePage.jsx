import bgImage from '../assets/main.png'

export default function HomePage({ onPlay, onAbout }) {
  return (
    <div
      className="relative flex flex-col justify-center px-16 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      <div className="relative z-10 flex flex-col gap-8">

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-400 mb-2">
            — Main Menu
          </p>
          <h1 className="text-6xl font-bold text-white leading-tight drop-shadow-lg">
            King of B<br />main
          </h1>
        </div>

        <nav className="flex flex-col gap-2 w-56">
          <button
            onClick={onPlay}
            className="flex items-center gap-3 px-5 py-3 bg-blue-600/80 hover:bg-blue-500/90 border border-blue-400/50 rounded text-white text-sm font-semibold uppercase tracking-widest transition-all duration-200 hover:pl-6"
          >
             Play
          </button>
          <button
            onClick={onAbout}
            className="flex items-center gap-3 px-5 py-3 text-gray-300 text-sm uppercase tracking-wide hover:text-white hover:bg-white/10 rounded transition-all duration-200 hover:pl-6"
          >
            • About Me
          </button>
        </nav>

        <p className="text-xs text-gray-500 tracking-widest uppercase">
          Press Enter to continue
        </p>

      </div>
    </div>
  )
}