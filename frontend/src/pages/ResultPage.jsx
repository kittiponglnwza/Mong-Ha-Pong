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
      <img src={end1Bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 text-center px-6">
        <p className="float-up-1 mb-3" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.45em", color: "rgba(251,191,36,0.7)", textTransform: "uppercase" }}>นี่คือ</p>
        <h1 className="float-up-2" style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(3rem,10vw,5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "0.04em", color: "#fff", textShadow: "0 0 30px rgba(251,146,60,0.9), 0 0 80px rgba(251,146,60,0.5), 0 2px 4px rgba(0,0,0,0.8)", marginBottom: "0.5rem" }}>ราชา b main</h1>
        {creature && (
          <p className="float-up-3" style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem", letterSpacing: "0.3em", color: "rgba(251,191,36,0.55)", marginTop: "1rem", textShadow: "0 0 12px rgba(251,146,60,0.6)" }}>{creature}</p>
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
      setFlash(true); playBoom()
      setTimeout(() => setFlash(false), 120)
      setVisible(true)
    }, 120)
    return () => clearTimeout(t1)
  }, [])
  return (
    <section className="relative min-h-dvh bg-black overflow-hidden flex flex-col items-center justify-center">
      <style>{`
        @keyframes slam-in { 0%{transform:scale(1.25);opacity:0;filter:brightness(2.5)} 40%{filter:brightness(1.1)} 100%{transform:scale(1);opacity:1;filter:brightness(1)} }
        @keyframes label-rise { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
        .slam-in{animation:slam-in 0.55s cubic-bezier(0.16,1,0.3,1) both}
        .label-rise{animation:label-rise 0.5s 0.4s cubic-bezier(0.22,1,0.36,1) both}
      `}</style>
      {flash && <div className="absolute inset-0 bg-white z-50 pointer-events-none" />}
      {visible && (
        <div className="slam-in relative z-10 flex flex-col items-center gap-5 px-6">
          <div style={{ width: "min(380px,88vw)", borderRadius: "4px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.7)", background: "#111", aspectRatio: "4/5" }}>
            {imageUrl ? <img src={imageUrl} alt="Your face" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>📸</div>}
          </div>
          <div className="label-rise text-center">
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.5em", color: "rgba(251,191,36,0.65)", textTransform: "uppercase", marginBottom: "0.4rem" }}>EXHIBIT A</p>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "1.4rem", fontWeight: 900, color: "#fff", letterSpacing: "0.06em", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>หน้าตาของราชา b main</p>
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
        @keyframes zoom-shake { 0%{transform:scale(0.3) rotate(15deg);opacity:0} 50%{transform:scale(1.08) rotate(-3deg);opacity:1} 70%{transform:scale(0.97) rotate(1deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes text-smash { 0%{transform:scaleY(3) translateY(-20px);opacity:0} 60%{transform:scaleY(0.9) translateY(2px);opacity:1} 100%{transform:scaleY(1) translateY(0);opacity:1} }
        .zoom-shake{animation:zoom-shake 0.6s cubic-bezier(0.22,1,0.36,1) both}
        .text-smash{animation:text-smash 0.4s cubic-bezier(0.22,1,0.36,1) both}
      `}</style>
      <div className={`transition-all ${textIn ? 'text-smash' : 'opacity-0'}`} style={{ fontFamily: 'Impact,Arial Black,sans-serif', fontSize: '2rem', letterSpacing: '0.05em', color: '#fff', WebkitTextStroke: '2px black', textShadow: '2px 2px 0 #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000', textAlign: 'center', lineHeight: 1.1 }}>เทียบกับ</div>
      <div className={`relative ${visible ? 'zoom-shake' : 'opacity-0'}`}>
        <div className="w-72 h-72 overflow-hidden border-8 border-white shadow-[0_0_60px_rgba(255,255,0,0.3)]">
          {memeUrl ? <img src={memeUrl} alt={creature} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-7xl">🐾</div>}
        </div>
        <div className="absolute -top-4 -right-4 bg-yellow-400 text-black font-black text-xs px-2 py-1 rotate-12 font-mono">MATCH</div>
      </div>
      <div className={`transition-all delay-200 ${textIn ? 'text-smash' : 'opacity-0'}`} style={{ fontFamily: 'Impact,Arial Black,sans-serif', fontSize: '2.5rem', letterSpacing: '0.05em', color: '#facc15', WebkitTextStroke: '2px black', textShadow: '3px 3px 0 #000,-3px -3px 0 #000,3px -3px 0 #000,-3px 3px 0 #000', textAlign: 'center', lineHeight: 1, textTransform: 'uppercase' }}>{creature || 'ANIMAL'}</div>
      <p className={`transition-all delay-300 text-neutral-600 font-mono text-xs tracking-widest text-center ${textIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>ใช่มั้ยว่ะ???</p>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   Phase 4 – REDESIGNED: Two-column layout (Photo Left, Stats Right)
───────────────────────────────────────────────────────────────*/
function PhaseResult({ result, onScanAgain, onBackHome }) {
  const animalProfile = getAnimalProfile(result)
  const score = result?.animal_score ?? result?.npc_score ?? 0
  const barRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${score}%`
    }, 800)
    return () => clearTimeout(t)
  }, [score])

  return (
    <section style={{
      minHeight: '100dvh',
      background: '#07070f',
      color: '#f0ede8',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap' />

      <style>{`
        @keyframes rise { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scale-in { from { opacity:0; transform:scale(0.9) rotate(-3deg); } to { opacity:1; transform:scale(1) rotate(-2deg); } }
        @keyframes drift { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(-2deg)} }
        @keyframes scan-line { 0%{top:-4px} 100%{top:calc(100% + 4px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .r1 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .r2 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .r3 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .r4 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .r5 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
        .r6 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .r7 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.65s both; }
        .photo-card { animation: scale-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .drift { animation: drift 6s ease-in-out infinite; }
        .creature-shimmer {
          background: linear-gradient(90deg, #ffffff 0%, #f0ede8 20%, #fb923c 40%, #fbbf24 50%, #fb923c 60%, #f0ede8 80%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear 1s 1 forwards;
        }
        .glow-btn { transition: all 0.2s; }
        .glow-btn:hover { box-shadow: 0 0 28px rgba(251,146,60,0.5); transform: translateY(-2px); }
        .glow-btn:active { transform: scale(0.97); }
        .ghost-btn { transition: all 0.2s; }
        .ghost-btn:hover { border-color: rgba(255,255,255,0.3) !important; color: #fff !important; }
        .tag-pill { transition: all 0.15s; cursor: default; }
        .tag-pill:hover { background: rgba(251,146,60,0.12); border-color: rgba(251,146,60,0.35); color: rgba(251,146,60,0.9); }
        .photo-strip-img { transition: filter 0.3s; }
        .photo-strip-img:hover { filter: grayscale(0) contrast(1.1) brightness(1.05) !important; }
      `}</style>

      {/* ── Atmospheric orbs ── */}
      <div style={{ position: 'fixed', top: '-20%', right: '-15%', width: '60vw', height: '60vw', maxWidth: 700, maxHeight: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-15%', left: '-10%', width: '45vw', height: '45vw', maxWidth: 500, maxHeight: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── Top gradient line ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.5) 30%, rgba(251,191,36,0.9) 50%, rgba(251,146,60,0.5) 70%, transparent)', zIndex: 100 }} />

      {/* ════════════════════════════════════════
         MAIN LAYOUT: TWO COLUMNS
      ════════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: 1200, // ขยายขนาดให้รองรับ 2 คอลัมน์
        margin: '0 auto',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 2.5rem) 2rem',
        display: 'flex',
        flexWrap: 'wrap', // ปรับเป็นบรรทัดใหม่เมื่อจอเล็ก
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(3rem, 6vw, 5rem)',
      }}>

        {/* ══ LEFT COLUMN: Photo Booth Strip ══ */}
        <div className="r3" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.35em', color: 'rgba(251,146,60,0.4)', textTransform: 'uppercase', margin: 0 }}>YOU ↔ MATCH</p>

          <div className="drift photo-card" style={{
            background: 'linear-gradient(160deg, #fff 0%, #f5f0e8 100%)',
            padding: 'clamp(8px, 1.5vw, 14px) clamp(8px, 1.5vw, 14px) clamp(28px, 4vw, 40px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(5px, 1vw, 8px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.75), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6)',
            transform: 'rotate(-2deg)',
            width: '100%',
            maxWidth: '420px',
            position: 'relative',
          }}>
            {/* Scan line */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.6) 50%, transparent 100%)', animation: 'scan-line 3s linear 0.5s 1' }} />
            </div>

            {[
              'grayscale(0.3) sepia(0.1)',
              'none',
              'grayscale(0.5) contrast(1.15)',
            ].map((filter, i) => (
              <div key={i} style={{ display: 'flex', gap: 'clamp(5px, 1vw, 8px)' }}>
                <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden', background: '#ccc' }}>
                  {result.scanImageUrl
                    ? <img src={result.scanImageUrl} alt="You" className="photo-strip-img" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: '#ddd' }}>📸</div>}
                </div>
                <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden', background: '#ccc' }}>
                  {result.matched_meme_url
                    ? <img src={result.matched_meme_url} alt={animalProfile.title} className="photo-strip-img" style={{ width: '100%', height: '100%', objectFit: 'cover', filter }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: '#ddd' }}>🐾</div>}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 'clamp(5px, 1vw, 8px)', marginTop: 2 }}>
              {['YOU', 'MATCH'].map(l => (
                <p key={l} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: '#888', fontFamily: 'monospace', letterSpacing: '0.15em', margin: 0, textTransform: 'uppercase' }}>{l}</p>
              ))}
            </div>

            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
              {[...Array(3)].map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,0,0,0.12)' }} />)}
            </div>
          </div>
        </div>

        {/* ══ RIGHT COLUMN: Info & Stats ══ */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 'clamp(1.2rem, 2.5vw, 2rem)', width: '100%' }}>
          
          {/* Title Area */}
          <div className="r1" style={{ textAlign: 'left', width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <div style={{ height: '1px', width: 32, background: 'rgba(251,146,60,0.4)' }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.4em', color: 'rgba(251,146,60,0.65)', textTransform: 'uppercase', margin: 0 }}>Animal Result</p>
            </div>

            <h1 className="creature-shimmer" style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 0.92,
              margin: '0 0 0.6rem',
              letterSpacing: '-0.01em',
            }}>{result.creature}</h1>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)', color: 'rgba(255,255,255,0.22)', margin: 0, letterSpacing: '0.06em', fontWeight: 300 }}>สรุปสัตว์มีมที่ใกล้กับ vibe ของคุณที่สุด</p>
          </div>

          <div className="r2" style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(251,146,60,0.15) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)' }} />

          {/* Match Score */}
          <div className="r4" style={{ width: '100%' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(251,146,60,0.07) 0%, rgba(251,191,36,0.03) 100%)',
              border: '1px solid rgba(251,146,60,0.18)',
              borderRadius: 20,
              padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1.5rem, 4vw, 2.5rem)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'radial-gradient(circle at top right, rgba(251,191,36,0.1), transparent 70%)', pointerEvents: 'none' }} />
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', margin: '0 0 0.2rem' }}>Match Score</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(3.5rem, 10vw, 5.5rem)', fontWeight: 900, lineHeight: 1, color: '#fb923c', textShadow: '0 0 40px rgba(251,146,60,0.45)' }}>{score}</span>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, color: 'rgba(251,146,60,0.45)' }}>%</span>
                </div>
              </div>
              <div style={{ flex: 1, maxWidth: 320 }}>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                  <div ref={barRef} style={{ height: '100%', width: '0%', borderRadius: 99, background: 'linear-gradient(90deg, #f97316, #fbbf24)', transition: 'width 1.6s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 10px rgba(251,146,60,0.7)' }} />
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', margin: '0.5rem 0 0', letterSpacing: '0.04em', fontWeight: 300 }}>"{animalProfile.description}"</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="r5" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(0.6rem, 1.5vw, 1rem)' }}>
            {[
              { label: 'Aura', val: result.aura, icon: '✦', accent: 'rgba(251,146,60,' },
              { label: 'Braincells', val: result.braincells, icon: '◈', accent: 'rgba(139,92,246,' },
              { label: 'Rarity', val: result.rarity, icon: '◇', accent: 'rgba(251,191,36,' },
            ].map(({ label, val, icon, accent }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${accent}0.1)`, borderTop: `2px solid ${accent}0.3)`, borderRadius: 16, padding: 'clamp(1rem, 2.5vw, 1.5rem) 0.75rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: `linear-gradient(90deg, transparent, ${accent}0.4), transparent)` }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>{icon} {label}</p>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 700, color: '#f0ede8', margin: 0, letterSpacing: '0.02em' }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="r6" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start', width: '100%' }}>
            {animalProfile.tags.map((tag) => (
              <span key={tag} className="tag-pill" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.025)', padding: '5px 14px', borderRadius: 99, letterSpacing: '0.04em' }}>{tag}</span>
            ))}
          </div>

          {/* Buttons */}
          <div className="r7" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={onScanAgain} className="ghost-btn" style={{ fontFamily: "'DM Sans', sans-serif", background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontWeight: 400, padding: '0.9rem', borderRadius: 14, cursor: 'pointer', letterSpacing: '0.04em' }}>สแกนใหม่</button>
            <button onClick={onBackHome} className="glow-btn" style={{ fontFamily: "'DM Sans', sans-serif", background: 'linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)', border: 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 500, padding: '0.9rem', borderRadius: 14, cursor: 'pointer', letterSpacing: '0.04em', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>กลับหน้าแรก</button>
          </div>

          <p style={{ fontFamily: 'monospace', fontSize: '0.52rem', color: 'rgba(255,255,255,0.08)', letterSpacing: '0.3em', margin: '0.5rem 0 0', textTransform: 'uppercase', textAlign: 'left' }}>b main scanner v1.0 · animal identification system</p>
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
      <style>{`@keyframes fade-phase { from{opacity:0} to{opacity:1} }`}</style>
      {phaseMap[phase]}
    </div>
  )
}

export default ResultPage