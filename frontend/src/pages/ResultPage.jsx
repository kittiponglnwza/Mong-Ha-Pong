import { useEffect, useRef, useState } from 'react'
import { getAnimalProfile } from '../utils/animalProfile'
import end1Bg from '../assets/end_1.jpg'

/* ─────────────────────────────────────────────────────────────
   Phase 1 – minimal: photo bg + float-up text
───────────────────────────────────────────────────────────────*/
function PhaseAnnounce({ creature, imageUrl }) {
  return (
    <section className="relative min-h-dvh overflow-hidden flex flex-col items-center justify-center select-none">
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap' />
      <style>{`
        @keyframes float-up {
          0%   { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .float-up-1 { animation: float-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .float-up-2 { animation: float-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .float-up-3 { animation: float-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both; }
      `}</style>

      {/* photo background */}
      <img src={end1Bg} alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* text */}
      <div className="relative z-10 text-center px-6">
        <p className="float-up-1 mb-3"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.75rem",
            letterSpacing: "0.45em",
            color: "rgba(251,191,36,0.7)",
            textTransform: "uppercase",
          }}>
          นี่คือ
        </p>
        <h1 className="float-up-2"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(3rem,10vw,5rem)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "0.04em",
            color: "#fff",
            textShadow: "0 0 30px rgba(251,146,60,0.9), 0 0 80px rgba(251,146,60,0.5), 0 2px 4px rgba(0,0,0,0.8)",
            marginBottom: "0.5rem",
          }}>
          ราชา b main
        </h1>
        {creature && (
          <p className="float-up-3"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1rem",
              letterSpacing: "0.3em",
              color: "rgba(251,191,36,0.55)",
              marginTop: "1rem",
              textShadow: "0 0 12px rgba(251,146,60,0.6)",
            }}>
            {creature}
          </p>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   Phase 2 – full-screen face reveal + boom sound
───────────────────────────────────────────────────────────────*/
function playBoom() {
  const audio = new Audio('/sounds/faaah.mp3')
  audio.volume = 1.0
  audio.play().catch(() => {})
}

function PhaseFace({ imageUrl }) {
  const [visible, setVisible] = useState(false)
  const [flash, setFlash] = useState(false)
 
  useEffect(() => {
    const t1 = setTimeout(() => {
      setFlash(true)
      playBoom()
      setTimeout(() => setFlash(false), 120)
      setVisible(true)
    }, 120)
    return () => clearTimeout(t1)
  }, [])
 
  return (
    <section className="relative min-h-dvh bg-black overflow-hidden flex flex-col items-center justify-center">
      <style>{`
        @keyframes slam-in {
          0%   { transform: scale(1.25); opacity: 0; filter: brightness(2.5); }
          40%  { filter: brightness(1.1); }
          100% { transform: scale(1); opacity: 1; filter: brightness(1); }
        }
        @keyframes label-rise {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .slam-in   { animation: slam-in 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .label-rise { animation: label-rise 0.5s 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
 
      {/* white flash */}
      {flash && <div className="absolute inset-0 bg-white z-50 pointer-events-none" />}
 
      {/* meme-style card */}
      {visible && (
        <div className="slam-in relative z-10 flex flex-col items-center gap-5 px-6">
          {/* photo frame */}
          <div style={{
            width: "min(380px, 88vw)",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
            background: "#111",
            aspectRatio: "4/5",
          }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Your face"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>📸</div>
            )}
          </div>
 
          {/* label */}
          <div className="label-rise text-center">
            <p style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              letterSpacing: "0.5em",
              color: "rgba(251,191,36,0.65)",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}>
              EXHIBIT A
            </p>
            <p style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.4rem",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "0.06em",
              textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            }}>
              หน้าตาของราชา b main
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   Phase 3 – the meme reveal
───────────────────────────────────────────────────────────────*/
function PhaseMeme({ memeUrl, creature }) {
  const [visible, setVisible] = useState(false)
  const [textIn, setTextIn] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => setTextIn(true), 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <section className="relative min-h-dvh bg-black text-white overflow-hidden flex flex-col items-center justify-center gap-6">
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap' />
      <style>{`
        @keyframes zoom-shake {
          0%   { transform: scale(0.3) rotate(15deg); opacity:0; }
          50%  { transform: scale(1.08) rotate(-3deg); opacity:1; }
          70%  { transform: scale(0.97) rotate(1deg); }
          100% { transform: scale(1) rotate(0deg); opacity:1; }
        }
        @keyframes text-smash {
          0%   { transform: scaleY(3) translateY(-20px); opacity:0; }
          60%  { transform: scaleY(0.9) translateY(2px); opacity:1; }
          100% { transform: scaleY(1) translateY(0); opacity:1; }
        }
        .zoom-shake { animation: zoom-shake 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .text-smash { animation: text-smash 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div className={`transition-all ${textIn ? 'text-smash' : 'opacity-0'}`}
        style={{ fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '2rem', letterSpacing: '0.05em',
          color: '#fff', WebkitTextStroke: '2px black',
          textShadow: '2px 2px 0 #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000',
          textAlign: 'center', lineHeight: 1.1 }}>
        เทียบกับ
      </div>

      <div className={`relative ${visible ? 'zoom-shake' : 'opacity-0'}`}>
        <div className="w-72 h-72 overflow-hidden border-8 border-white shadow-[0_0_60px_rgba(255,255,0,0.3)]">
          {memeUrl ? (
            <img src={memeUrl} alt={creature} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-7xl">🐾</div>
          )}
        </div>
        <div className="absolute -top-4 -right-4 bg-yellow-400 text-black font-black text-xs px-2 py-1 rotate-12 font-mono">MATCH</div>
      </div>

      <div className={`transition-all delay-200 ${textIn ? 'text-smash' : 'opacity-0'}`}
        style={{ fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '2.5rem', letterSpacing: '0.05em',
          color: '#facc15', WebkitTextStroke: '2px black',
          textShadow: '3px 3px 0 #000,-3px -3px 0 #000,3px -3px 0 #000,-3px 3px 0 #000',
          textAlign: 'center', lineHeight: 1, textTransform: 'uppercase' }}>
        {creature || 'ANIMAL'}
      </div>

      <p className={`transition-all delay-300 text-neutral-600 font-mono text-xs tracking-widest text-center ${textIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        ใช่มั้ยว่ะ???
      </p>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   Phase 4 – full result
───────────────────────────────────────────────────────────────*/
function PhaseResult({ result, onScanAgain, onBackHome }) {
  const animalProfile = getAnimalProfile(result)
  const score = result?.animal_score ?? result?.npc_score ?? 0
  const barRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${score}%`
    }, 300)
    return () => clearTimeout(t)
  }, [score])

  return (
    <section className="relative min-h-dvh bg-[#0a0a0f] text-[#f0ede8] overflow-hidden font-sans">
      <div className="pointer-events-none absolute -top-24 -right-20 w-96 h-96 rounded-full bg-orange-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-24 -left-16 w-72 h-72 rounded-full bg-violet-500/10 blur-[80px]" />

      <div className="relative z-10 max-w-sm mx-auto px-5 pt-8 pb-12">
        <p className="text-[11px] tracking-[0.2em] uppercase text-orange-400 font-medium mb-1">Animal result</p>
        <h1 className="text-5xl font-black tracking-tight mb-1 bg-gradient-to-br from-[#f0ede8] via-[#f0ede8] to-orange-400 bg-clip-text text-transparent">
          {result.creature}
        </h1>
        <p className="text-sm text-neutral-500 font-light mb-7">สรุปสัตว์มีมที่ใกล้กับ vibe ของคุณที่สุด</p>

        <div className="flex gap-3 mb-5 items-stretch">
          <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-white/5 flex items-center justify-center">
            {result.scanImageUrl ? (
              <img src={result.scanImageUrl} alt="Your scanned face" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl opacity-20">📸</span>
            )}
            <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest bg-black/60 text-white px-2 py-0.5 rounded-full font-medium">You</span>
          </div>

          <div className="flex items-center justify-center w-9 shrink-0">
            <span className="bg-orange-500 text-white text-xs font-black px-2 py-1.5 rounded-full">VS</span>
          </div>

          <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-white/5 flex items-center justify-center">
            {result.matched_meme_url ? (
              <img src={result.matched_meme_url} alt={animalProfile.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl opacity-20">🐾</span>
            )}
            <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest bg-black/60 text-white px-2 py-0.5 rounded-full font-medium">Match</span>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5 mb-4">
          <p className="text-[11px] tracking-widest uppercase text-neutral-500 font-medium mb-2">Animal match score</p>
          <p className="text-6xl font-black text-orange-400 leading-none mb-3">{score}%</p>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              ref={barRef}
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300"
              style={{ width: '0%', transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[
            { label: 'Aura', val: result.aura },
            { label: 'Braincells', val: result.braincells },
            { label: 'Rarity', val: result.rarity },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-center">
              <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1">{label}</p>
              <p className="text-sm font-bold text-[#f0ede8]">{val}</p>
            </div>
          ))}
        </div>

        <div className="bg-orange-500/[0.06] border border-orange-500/20 rounded-xl px-4 py-3.5 mb-4">
          <p className="text-sm text-neutral-300 leading-relaxed font-light">{animalProfile.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {animalProfile.tags.map((tag) => (
            <span key={tag} className="text-xs text-neutral-400 border border-white/10 bg-white/[0.04] px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-2.5">
          <button
            onClick={onScanAgain}
            className="border border-white/10 text-neutral-400 text-sm font-medium py-3.5 rounded-xl hover:border-white/25 hover:text-white transition-colors"
          >
            สแกนใหม่
          </button>
          <button
            onClick={onBackHome}
            className="bg-orange-500 text-white text-sm font-medium py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
          >
            กลับหน้าแรก
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main Controller
───────────────────────────────────────────────────────────────*/
function ResultPage({ result, onScanAgain, onBackHome }) {
  const [phase, setPhase] = useState(1)

  useEffect(() => {
    if (!result) return
    const timings = [
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 6000),
      setTimeout(() => setPhase(4), 9000),
    ]
    return () => timings.forEach(clearTimeout)
  }, [result])

  if (!result) return null

  const phaseMap = {
    1: <PhaseAnnounce creature={result.creature} imageUrl={result.scanImageUrl} />,
    2: <PhaseFace imageUrl={result.scanImageUrl} />,
    3: <PhaseMeme memeUrl={result.matched_meme_url} creature={result.creature} />,
    4: <PhaseResult result={result} onScanAgain={onScanAgain} onBackHome={onBackHome} />,
  }

  return (
    <div key={phase} style={{ animation: 'fade-phase 0.4s ease both' }}>
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap' />
      <style>{`
        @keyframes fade-phase {
          from { opacity:0; }
          to   { opacity:1; }
        }
      `}</style>
      {phaseMap[phase]}
    </div>
  )
}

export default ResultPage