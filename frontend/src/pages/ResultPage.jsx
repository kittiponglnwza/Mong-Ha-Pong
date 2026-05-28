import { useEffect, useRef, useState } from 'react'
import { getAnimalProfile } from '../utils/animalProfile'
import end1Bg from '../assets/end_1.jpg'
import html2canvas from 'html2canvas'

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
            {imageUrl 
              ? <img src={imageUrl} alt="Your face" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} /> 
              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>📸</div>}
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
          {memeUrl 
            ? <img src={memeUrl} crossOrigin="anonymous" alt={creature} className="w-full h-full object-cover" /> 
            : <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-7xl">🐾</div>}
        </div>
        <div className="absolute -top-4 -right-4 bg-yellow-400 text-black font-black text-xs px-2 py-1 rotate-12 font-mono">MATCH</div>
      </div>
      <div className={`transition-all delay-200 ${textIn ? 'text-smash' : 'opacity-0'}`} style={{ fontFamily: 'Impact,Arial Black,sans-serif', fontSize: '2.5rem', letterSpacing: '0.05em', color: '#facc15', WebkitTextStroke: '2px black', textShadow: '3px 3px 0 #000,-3px -3px 0 #000,3px -3px 0 #000,-3px 2px 0 #000', textAlign: 'center', lineHeight: 1, textTransform: 'uppercase' }}>{creature || 'ANIMAL'}</div>
      <p className={`transition-all delay-300 text-neutral-600 font-mono text-xs tracking-widest text-center ${textIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>ใช่มั้ยว่ะ???</p>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
    Phase 4 – The Final Result & Photo Strip
───────────────────────────────────────────────────────────────*/
function PhaseResult({ result, userPhotos, matchedMemeUrls, onScanAgain, onBackHome }) {
  const animalProfile = getAnimalProfile(result)
  const score = result?.animal_score ?? result?.npc_score ?? 0
  const barRef = useRef(null)
  const photoCardRef = useRef(null) 
  const downloadCardRef = useRef(null) 
  const [isSaving, setIsSaving] = useState(false)

  // 🌟 ฟังก์ชันช่วยแยก Request ของรูปมีมเพื่อป้องกันอาการรูปแตก (CORS Cache)
  const getMemeUrlForIndex = (url, index) => {
    if (!url || url.startsWith('data:')) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}shot=${index}`;
  };
  
  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${score}%`
    }, 800)
    return () => clearTimeout(t)
  }, [score])

  const handleSaveImage = async () => {
    if (!downloadCardRef.current || isSaving) return;
    try {
      setIsSaving(true);
      const canvas = await html2canvas(downloadCardRef.current, {
        useCORS: true,        
        allowTaint: false,
        backgroundColor: null, 
        scale: 3, 
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `b-main-${result.creature || 'result'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('ไม่สามารถบันทึกรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section style={{
      minHeight: '100dvh',
      backgroundImage: `linear-gradient(135deg, rgba(5, 5, 12, 0.94) 0%, rgba(10, 10, 22, 0.97) 100%), url(${end1Bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#f8f6f2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap' />
      <style>{`
        @keyframes rise { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scale-in { from { opacity:0; transform:scale(0.95) rotate(-1deg); } to { opacity:1; transform:scale(1) rotate(-2deg); } }
        @keyframes drift { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-6px) rotate(-2deg)} }
        @keyframes scan-line { 0%{top:-4px} 100%{top:calc(100% + 4px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        
        .r1 { animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .r2 { animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .r3 { animation: scale-in 0.5s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
        .r4 { animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .r5 { animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) 0.32s both; }
        .r6 { animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) 0.40s both; }
        .r7 { animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) 0.48s both; }
        
        .photo-card { animation: scale-in 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .drift { animation: drift 5s ease-in-out infinite; }
        
        .creature-shimmer {
          background: linear-gradient(90deg, #ffffff 0%, #fff7ed 15%, #ff7849 35%, #f59e0b 50%, #ff7849 65%, #fff7ed 85%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear 1s 1 forwards;
        }
        .glow-btn { transition: all 0.2s; }
        .glow-btn:hover { box-shadow: 0 0 28px rgba(249,115,22,0.55); transform: translateY(-1px); }
        .glow-btn:active { transform: scale(0.98); }
        
        .save-btn { transition: all 0.2s; background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%); color: #fff; border: none; }
        .save-btn:hover { box-shadow: 0 0 28px rgba(245,158,11,0.6); transform: translateY(-1px); }
        .save-btn:active { transform: scale(0.98); }

        .ghost-btn { transition: all 0.2s; }
        .ghost-btn:hover { border-color: rgba(255,255,255,0.4) !important; color: #fff !important; background: rgba(255,255,255,0.03); }
        
        .tag-pill { transition: all 0.15s; cursor: default; }
        .tag-pill:hover { background: rgba(249,115,22,0.15); border-color: rgba(249,115,22,0.4); color: #ff9a52; }
        .photo-strip-img { transition: filter 0.3s; }
        .photo-strip-img:hover { filter: grayscale(0) contrast(1.15) brightness(1.05) !important; }

        .layout-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          padding: 2rem 1.25rem;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .layout-container {
            flex-direction: row;
            justify-content: center;
            height: 94dvh;
            max-height: 780px;
            gap: 4.5rem;
            padding: 0;
          }
          .col-left {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .col-right {
            flex: 1;
            max-width: 540px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
          }
        }
      `}</style>

      {/* พื้นหลัง */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '50vw', height: '50vw', maxWidth: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: '40vw', height: '40vw', maxWidth: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* 🛑 [SECRET EXPORT ZONE] (แผ่นการ์ดซ่อนไว้ให้ html2canvas โหลด) */}
      <div ref={downloadCardRef} style={{
        position: 'absolute', left: '-9999px', top: '-9999px',
        background: 'linear-gradient(160deg, #ffffff 0%, #f7f3eb 100%)',
        padding: '12px 12px 36px', display: 'flex', flexDirection: 'column',
        gap: '6px', width: '320px', boxSizing: 'border-box'
      }}>
        {['grayscale(0.1) sepia(0.02)', 'none', 'grayscale(0.3) contrast(1.15)'].map((filter, i) => {
          const userImgUrl = userPhotos[i];
          const currentMemeUrl = matchedMemeUrls[i]; // 👈 ดึงมีมช่อง 1, 2, 3 ตาม Index
          
          const isUserBase64 = userImgUrl?.startsWith('data:');
          const isMemeBase64 = currentMemeUrl?.startsWith('data:');

          return (
            <div key={i} style={{ display: 'flex', gap: '6px' }}>
              <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden', background: '#d1d1d1' }}>
                {userImgUrl
                  ? <img src={userImgUrl} crossOrigin={isUserBase64 ? undefined : "anonymous"} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: '#e5e5e5' }}>📸</div>}
              </div>
              <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden', background: '#d1d1d1' }}>
                {currentMemeUrl
                  ? <img src={getMemeUrlForIndex(currentMemeUrl, i)} crossOrigin={isMemeBase64 ? undefined : "anonymous"} alt={animalProfile.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: '#e5e5e5' }}>🐾</div>}
              </div>
            </div>
          )
        })}
        <div style={{ display: 'flex', gap: '6px', marginTop: 10 }}>
          {['YOU', 'MATCH'].map(l => (
            <p key={l} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: '#777', fontFamily: 'monospace', letterSpacing: '0.15em', margin: 0, fontWeight: 'bold' }}>{l}</p>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {[...Array(3)].map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,0,0,0.15)' }} />)}
        </div>
      </div>

      <div className="layout-container" style={{ position: 'relative', zIndex: 10 }}>
        {/* ══ ฝั่งซ้าย: Photo Strip บนหน้าจอเว็บ ══ */}
        <div className="col-left r3">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(249,115,22,0.6)', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>YOU ↔ MATCH</p>
            <div className="drift photo-card" id="download-photo-card" ref={photoCardRef} style={{
              background: 'linear-gradient(160deg, #ffffff 0%, #f7f3eb 100%)',
              padding: 'clamp(6px, 1.2vw, 12px) clamp(6px, 1.2vw, 12px) clamp(22px, 3.5vw, 32px)',
              display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.8vw, 6px)',
              boxShadow: '0 25px 70px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.9)',
              transform: 'rotate(-2deg)', width: 'clamp(250px, 23vw, 320px)', position: 'relative',
            }}>
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
                <div style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.7) 50%, transparent 100%)', animation: 'scan-line 2.5s linear 0.5s 1' }} />
              </div>

              {['grayscale(0.1) sepia(0.02)', 'none', 'grayscale(0.3) contrast(1.15)'].map((filter, i) => {
                const userImgUrl = userPhotos[i];
                const currentMemeUrl = matchedMemeUrls[i]; // 👈 ดึงมีมช่อง 1, 2, 3 แยกกัน
                
                const isUserBase64 = userImgUrl?.startsWith('data:');
                const isMemeBase64 = currentMemeUrl?.startsWith('data:');

                return (
                  <div key={i} style={{ display: 'flex', gap: 'clamp(4px, 0.8vw, 6px)' }}>
                    {/* 🌟 ดึงรูปที่แอบถ่ายทั้ง 3 ช็อตมาแสดง */}
                    <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden', background: '#d1d1d1' }}>
                      {userImgUrl
                        ? <img src={userImgUrl} crossOrigin={isUserBase64 ? undefined : "anonymous"} alt="You" className="photo-strip-img" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: '#e5e5e5' }}>📸</div>}
                    </div>
                    {/* 🌟 รูปมีม (แสดง 3 รูปไม่ซ้ำ ถ้าหลังบ้านส่งมาเป็น Array) */}
                    <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden', background: '#d1d1d1' }}>
                      {currentMemeUrl
                        ? <img src={getMemeUrlForIndex(currentMemeUrl, i)} crossOrigin={isMemeBase64 ? undefined : "anonymous"} alt={animalProfile.title} className="photo-strip-img" style={{ width: '100%', height: '100%', objectFit: 'cover', filter }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: '#e5e5e5' }}>🐾</div>}
                    </div>
                  </div>
                )
              })}

              <div style={{ display: 'flex', gap: '6px', marginTop: 4 }}>
                {['YOU', 'MATCH'].map(l => (
                  <p key={l} style={{ flex: 1, textAlign: 'center', fontSize: '8px', color: '#777', fontFamily: 'monospace', letterSpacing: '0.15em', margin: 0, fontWeight: 'bold' }}>{l}</p>
                ))}
              </div>
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
                {[...Array(3)].map((_, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(0,0,0,0.15)' }} />)}
              </div>
            </div>
          </div>
        </div>

        {/* ══ ฝั่งขวา: รายละเอียดข้อมูลต่างๆ ══ */}
        <div className="col-right">
          <div className="r1" style={{ marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ height: '1px', width: 24, background: 'rgba(249,115,22,0.6)' }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', letterSpacing: '0.3em', color: '#ff9a52', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>Animal Result</p>
            </div>
            <h1 className="creature-shimmer" style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(2.4rem, 4.8vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 0.95,
              margin: '0 0 0.4rem',
              letterSpacing: '-0.01em',
            }}>{result.creature}</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', margin: 0, letterSpacing: '0.04em', fontWeight: 300 }}>สรุปสัตว์มีมที่ใกล้กับ vibe ของคุณที่สุด</p>
          </div>

          <div className="r2" style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(249,115,22,0.35) 0%, rgba(255,255,255,0.08) 70%, transparent 100%)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }} />

          <div className="r4" style={{ width: '100%', marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(245,158,11,0.04) 100%)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 16, padding: '1.2rem 1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.2rem', position: 'relative', overflow: 'hidden' }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: '0 0 0.1rem', fontWeight: 500 }}>Match Score</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(3.2rem, 6.5vw, 4.8rem)', fontWeight: 900, lineHeight: 1, color: '#ff7849', textShadow: '0 0 35px rgba(249,115,22,0.55)' }}>{score}</span>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', fontWeight: 700, color: 'rgba(249,115,22,0.65)' }}>%</span>
                </div>
              </div>
              <div style={{ flex: 1, maxWidth: 280 }}>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div ref={barRef} style={{ height: '100%', width: '0%', borderRadius: 99, background: 'linear-gradient(90deg, #ea580c, #ff7849)', transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 10px rgba(249,115,22,0.7)' }} />
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: '0.75rem', color: '#e5e7eb', margin: 0, letterSpacing: '0.02em', lineHeight: 1.35, fontWeight: 400 }}>"{animalProfile.description}"</p>
              </div>
            </div>
          </div>

          <div className="r5" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
            {[
              { label: 'Aura', val: result.aura, icon: '✦', accent: 'rgba(249,115,22,', textColor: '#ff9a52' },
              { label: 'Braincells', val: result.braincells, icon: '◈', accent: 'rgba(139,92,246,', textColor: '#a78bfa' },
              { label: 'Rarity', val: result.rarity, icon: '◇', accent: 'rgba(245,158,11,', textColor: '#fbbf24' },
            ].map(({ label, val, icon, accent, textColor }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}0.18)`, borderTop: `2px solid ${accent}0.65)`, borderRadius: 12, padding: '0.95rem 0.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: `inset 0 4px 12px ${accent}0.03)` }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 0.4rem', fontWeight: 500 }}>{icon} {label}</p>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 700, color: textColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{val}</p>
              </div>
            ))}
          </div>

          <div className="r6" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-start', width: '100%', marginBottom: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
            {animalProfile.tags.map((tag) => (
              <span key={tag} className="tag-pill" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)', padding: '5px 14px', borderRadius: 99 }}>{tag}</span>
            ))}
          </div>

          <div className="r7" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button onClick={handleSaveImage} className="save-btn" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 600, padding: '0.85rem', borderRadius: 12, cursor: isSaving ? 'not-allowed' : 'pointer', letterSpacing: '0.03em', textShadow: '0 1px 2px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              {isSaving ? 'กำลังบันทึกรูปภาพ...' : '📸 บันทึกรูปภาพ (Photo Strip)'}
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button onClick={onScanAgain} className="ghost-btn" style={{ fontFamily: "'DM Sans', sans-serif", background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', padding: '0.8rem', borderRadius: 12, cursor: 'pointer', letterSpacing: '0.02em', fontWeight: 500 }}>สแกนใหม่</button>
              <button onClick={onBackHome} className="glow-btn" style={{ fontFamily: "'DM Sans', sans-serif", background: 'linear-gradient(135deg, #ea580c 0%, #ff7849 50%, #f59e0b 100%)', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 600, padding: '0.8rem', borderRadius: 12, cursor: 'pointer', letterSpacing: '0.03em', textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}>กลับหน้าแรก</button>
            </div>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: '0.5rem', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.25em', marginTop: '1.4rem', textTransform: 'uppercase', textAlign: 'left' }}>b main scanner v1.0 · animal identification system</p>
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
  const [processedUrls, setProcessedUrls] = useState({ scanImg: '', photos: [], memes: [] })

  useEffect(() => {
    if (!result) return

    const processUrl = (url) => {
      if (!url) return '';
      if (url.startsWith('data:')) return url; 
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}t=${Date.now()}`;
    }

    const scanImg = processUrl(result.scanImageUrl)
    
    // 🌟 ดึงรูปที่แอบถ่าย 3 ช็อตมาใช้งาน
    const fallbackPhoto = result.scanImageUrl || '';
    const rawPhotos = (result.jumpscarePhotos && result.jumpscarePhotos.length === 3) 
      ? [
          result.jumpscarePhotos[0] || fallbackPhoto, 
          result.jumpscarePhotos[1] || fallbackPhoto, 
          result.jumpscarePhotos[2] || fallbackPhoto
        ]
      : [fallbackPhoto, fallbackPhoto, fallbackPhoto];
      
    const photos = rawPhotos.map(p => processUrl(p));

    // 🌟 เช็กว่าหลังบ้านส่ง array "matched_meme_urls" (มีตัว s) มา 3 รูปหรือไม่
    // ถ้าไม่มี ก็จะเอารูปเดียวที่เคยมีมาใช้ซ้ำ 3 ช่องเหมือนเดิม กันแอปพัง
    const fallbackMeme = result.matched_meme_url || '';
    const rawMemes = (result.matched_meme_urls && result.matched_meme_urls.length === 3)
      ? result.matched_meme_urls
      : [fallbackMeme, fallbackMeme, fallbackMeme];

    const memes = rawMemes.map(m => processUrl(m));

    setProcessedUrls({ scanImg, photos, memes })

    const timings = [
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 6000),
      setTimeout(() => setPhase(4), 9000),
    ]
    return () => timings.forEach(clearTimeout)
  }, [result])

  if (!result) return null

  const phaseMap = {
    1: <PhaseAnnounce creature={result.creature} imageUrl={processedUrls.scanImg} />,
    2: <PhaseFace imageUrl={processedUrls.scanImg} />,
    // หน้าเปิดตัวมีมตอนแรก (ดึงมีมตัวสุดท้าย/ช็อต Jumpscare มาโชว์เพราะมันพีคสุด)
    3: <PhaseMeme memeUrl={processedUrls.memes[2]} creature={result.creature} />, 
    // ส่ง Array ของรูปมีมไปที่ Phase 4
    4: <PhaseResult result={result} userPhotos={processedUrls.photos} matchedMemeUrls={processedUrls.memes} onScanAgain={onScanAgain} onBackHome={onBackHome} />,
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