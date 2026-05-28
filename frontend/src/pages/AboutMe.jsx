export default function AboutMe({ onBack }) {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center px-16 py-16">
      <div className="max-w-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-400 mb-4">— About Me</p>
        <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Hello, I'm the creator.</h1>
        <p className="text-sm text-gray-400 leading-loose tracking-wide mb-10">
          This is the about me page. Replace this with your own content.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-400 text-sm uppercase tracking-wide hover:text-white hover:bg-white/10 rounded border border-white/10 transition-all duration-200"
        >
          ← Back to menu
        </button>
      </div>
    </div>
  )
}