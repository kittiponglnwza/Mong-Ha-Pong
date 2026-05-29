import { useEffect, useRef, useState } from 'react'
import { getAnimalProfile } from '../utils/animalProfile'
import end1Bg from '../assets/end_1.jpg'
import flashImg from '../assets/flash.jpg'
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
   Phase 2 – cinematic face reveal: slow burn + spotlight
───────────────────────────────────────────────────────────────*/
const boomAudio = new Audio('/sounds/faaah.mp3')
boomAudio.volume = 1.0
boomAudio.load()

function playBoom() {
  boomAudio.currentTime = 0
  boomAudio.play().catch(() => {})
}

const flashAudio = new Audio('/sounds/flash.mp3')
flashAudio.volume = 1.0
flashAudio.load()

function playFlashSound() {
  flashAudio.currentTime = 0
  flashAudio.play().catch(() => {})
}

function PhaseFace({ imageUrl }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t0 = setTimeout(() => { setStep(1); playFlashSound() }, 300)
    const t1 = setTimeout(() => setStep(2), 350)
    const t2 = setTimeout(() => { setStep(3); playBoom() }, 850)
    const t3 = setTimeout(() => setStep(4), 1650)
    return () => { [t0,t1,t2,t3].forEach(clearTimeout) }
  }, [])

  return (
    <section style={{
      minHeight: '100dvh', background: '#000', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <style>{`
        @keyframes flash-in  { from{opacity:0} to{opacity:1} }
        @keyframes flash-out { from{opacity:1} to{opacity:0} }
        @keyframes photo-rise {
          0%   { opacity:0; transform:scale(1.05); filter:brightness(2.5); }
          30%  { filter:brightness(1.15); }
          100% { opacity:1; transform:scale(1);    filter:brightness(1); }
        }
        @keyframes vignette-in { from{opacity:0} to{opacity:1} }
        @keyframes label-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes line-grow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        .flash-in    { animation: flash-in  0.05s ease both; }
        .flash-out   { animation: flash-out 0.75s cubic-bezier(0.4,0,1,1) both; }
        .photo-rise  { animation: photo-rise 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .label-tag   { animation: label-up 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .label-title { animation: label-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .line-grow   { animation: line-grow 0.5s cubic-bezier(0.22,1,0.36,1) 0.06s both; transform-origin:left; }
      `}</style>

      {step >= 1 && step <= 3 && (
        <img
          src={flashImg}
          className={step === 1 ? 'flash-in' : step === 3 ? 'flash-out' : ''}
          alt=""
          style={{
            position:'absolute', inset:0, zIndex:50, pointerEvents:'none',
            width:'100%', height:'100%', objectFit:'cover',
          }}
        />
      )}

      {step >= 3 && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none', zIndex:5,
          background:'radial-gradient(ellipse 55% 70% at 50% 42%, transparent 0%, rgba(0,0,0,0.72) 100%)',
          animation:'vignette-in 1.2s ease both',
        }} />
      )}

      <div style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', gap:'1.8rem' }}>
        <div style={{
          width:'min(340px,82vw)', aspectRatio:'4/5', borderRadius:'3px',
          overflow:'hidden', background:'#0a0a0a',
          boxShadow:'0 32px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.06)',
          opacity: step >= 3 ? 1 : 0,
        }}>
          {imageUrl
            ? <img src={imageUrl} alt="Your face"
                className={step >= 3 ? 'photo-rise' : ''}
                style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 20%', display:'block' }} />
            : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem' }}>📸</div>
          }
        </div>

        {step >= 4 && (
          <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
            <p className="label-tag" style={{ fontFamily:"'Cinzel', serif", fontSize:'0.58rem', letterSpacing:'0.5em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', margin:0 }}>EXHIBIT A</p>
            <div className="line-grow" style={{ width:40, height:'1px', background:'rgba(255,255,255,0.2)' }} />
            <p className="label-title" style={{ fontFamily:"'Cinzel', serif", fontSize:'clamp(1.2rem,3.5vw,1.5rem)', fontWeight:900, color:'#fff', letterSpacing:'0.08em', textShadow:'0 2px 24px rgba(0,0,0,0.9)', margin:0 }}>หน้าตาของราชา b main</p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   Phase 3 – cinematic meme reveal: slow zoom + title card
───────────────────────────────────────────────────────────────*/
function PhaseMeme({ memeUrl, creature }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 200)
    const t2 = setTimeout(() => { setStep(2); playBoom() }, 700)
    const t3 = setTimeout(() => setStep(3), 1400)
    return () => { [t1,t2,t3].forEach(clearTimeout) }
  }, [])

  return (
    <section style={{
      minHeight: '100dvh', background: '#06060a', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '2rem', position: 'relative',
    }}>
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap' />
      <style>{`
        @keyframes vs-reveal {
          from { opacity: 0; letter-spacing: 0.8em; }
          to   { opacity: 1; letter-spacing: 0.35em; }
        }
        @keyframes meme-zoom {
          from { opacity: 0; transform: scale(1.08); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes creature-slide {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badge-in {
          0%   { opacity: 0; transform: scale(0.6) rotate(20deg); }
          70%  { transform: scale(1.1) rotate(10deg); }
          100% { opacity: 1; transform: scale(1)   rotate(12deg); }
        }
        @keyframes hr-expand {
          from { transform: scaleX(0); } to { transform: scaleX(1); }
        }
        .vs-reveal      { animation: vs-reveal 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .meme-zoom      { animation: meme-zoom 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .creature-slide { animation: creature-slide 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .badge-in       { animation: badge-in 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
        .hr-expand      { animation: hr-expand 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both; transform-origin: center; }
      `}</style>

      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70vw', height: '70vw', maxWidth: 520,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
        transition: 'opacity 0.8s',
        opacity: step >= 2 ? 1 : 0,
      }} />

      {step >= 1 && (
        <p className="vs-reveal" style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.65rem',
          letterSpacing: '0.35em', color: 'rgba(255,255,255,0.28)',
          textTransform: 'uppercase', margin: 0,
        }}>VS</p>
      )}

      <div style={{ position: 'relative' }}>
        <div style={{
          width: 'min(300px,75vw)', aspectRatio: '1/1',
          borderRadius: '6px', overflow: 'hidden',
          background: '#111',
          boxShadow: step >= 2
            ? '0 24px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(250,204,21,0.25)'
            : '0 24px 80px rgba(0,0,0,0.9)',
          transition: 'box-shadow 0.6s',
          opacity: step >= 2 ? 1 : 0,
        }}>
          {memeUrl
            ? <img src={memeUrl} crossOrigin="anonymous" alt={creature}
                className={step >= 2 ? 'meme-zoom' : ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: '#111' }}>🐾</div>
          }
        </div>

        {step >= 3 && (
          <div className="badge-in" style={{
            position: 'absolute', top: '-12px', right: '-12px',
            background: '#facc15', color: '#000',
            fontFamily: 'monospace', fontWeight: 900, fontSize: '0.65rem',
            letterSpacing: '0.08em', padding: '4px 9px', borderRadius: '3px',
            boxShadow: '0 4px 16px rgba(250,204,21,0.4)',
          }}>MATCH</div>
        )}
      </div>

      {step >= 3 && (
        <div className="creature-slide" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <div className="hr-expand" style={{ width: 32, height: '1px', background: 'rgba(250,204,21,0.5)' }} />
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 900, color: '#fff', letterSpacing: '0.06em',
            textTransform: 'uppercase', margin: 0,
            textShadow: '0 0 40px rgba(250,204,21,0.2)',
          }}>{creature || 'ANIMAL'}</p>
          <p style={{
            fontFamily: 'monospace', fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.22)', letterSpacing: '0.3em', margin: 0,
          }}>ใช่มั้ยว่ะ???</p>
        </div>
      )}
    </section>
  )
}


/* ─────────────────────────────────────────────────────────────
   Phase 4 – The Final Result & Photo Strip
───────────────────────────────────────────────────────────────*/

// 🎯 Valorant rank config — สี + ไอคอน
const VALORANT_RANKS = {
  UNRANKED:  { color: '#9e9e9e', glow: 'rgba(158,158,158,0.3)',  label: 'UNRANKED'  },
  IRON:      { color: '#8a8a8a', glow: 'rgba(138,138,138,0.3)',  label: 'IRON'      },
  BRONZE:    { color: '#cd7f32', glow: 'rgba(205,127,50,0.35)',   label: 'BRONZE'    },
  SILVER:    { color: '#b0b8c1', glow: 'rgba(176,184,193,0.35)', label: 'SILVER'    },
  GOLD:      { color: '#f5c842', glow: 'rgba(245,200,66,0.4)',   label: 'GOLD'      },
  PLATINUM:  { color: '#4ecdc4', glow: 'rgba(78,205,196,0.4)',   label: 'PLATINUM'  },
  DIAMOND:   { color: '#9ecfec', glow: 'rgba(158,207,236,0.45)', label: 'DIAMOND'   },
  IMMORTAL:  { color: '#ff4655', glow: 'rgba(255,70,85,0.5)',    label: 'IMMORTAL'  },
  RADIANT:   { color: '#fffb8f', glow: 'rgba(255,251,143,0.6)',  label: 'RADIANT'   },
}

function getRarityColor(rank) {
  return VALORANT_RANKS[rank]?.color ?? '#fbbf24'
}

function getRarityGlow(rank) {
  return VALORANT_RANKS[rank]?.glow ?? 'rgba(251,191,36,0.3)'
}

function PhaseResult({ result, userPhotos, matchedMemeUrls, reflexData = [], onScanAgain, onBackHome }) {
  const animalProfile = getAnimalProfile(result)
  const score = result?.animal_score ?? result?.npc_score ?? 0
  const barRef = useRef(null)
  const photoCardRef = useRef(null)
  const downloadCardRef = useRef(null)
  const [isSaving, setIsSaving] = useState(false)

  // 🎯 Reflex stats
  const perfectRounds = reflexData.filter(r => r.verdict === 'perfect')
  const avgReflex = perfectRounds.length > 0
    ? Math.round(perfectRounds.reduce((a, b) => a + b.ms, 0) / perfectRounds.length)
    : null
  const bestReflex = perfectRounds.length > 0
    ? Math.min(...perfectRounds.map(r => r.ms))
    : null
  const missCount = reflexData.filter(r => r.verdict !== 'perfect').length

  // 🎯 Reflex Roast — random pick จาก pool คงที่ ไม่ต้องเรียก API
  const ROAST_POOL = [
    { title: 'Aim ดี แต่สมอง AFK',       sub: 'reaction ไวเหมือนใช้ config โปร แต่ decision making ยัง Bronze ติดพื้น',              color: '#ff4444' },
    { title: 'Radiant ในฝัน',             sub: 'ยิงโดนไม่กี่นัดแล้วคิดว่าตัวเองขึ้นโปรลีกได้ ทั้งที่ชีวิตจริงยังแพ้ tutorial',      color: '#ff6600' },
    { title: 'Crosshair เทพ คนเล่นกาก',   sub: 'เซ็ต sensitivity มาอย่างเทพ แต่คนจับเมาส์ยังเหมือน NPC หลงแมพ',                      color: '#ff4488' },
    { title: 'Reaction ไวเกินพ่อ',        sub: 'เร็วแบบนี้ไม่รู้ฝึก aim หรือโดนไฟดูดตอนคลิกเมาส์',                                  color: '#ff4444' },
    { title: 'Grandpa Flick Machine',     sub: 'ลากเมาส์เหมือนกำลังเขียนจดหมายลาโลก ไม่ใช่เล่น FPS',                               color: '#ff6600' },
    { title: 'Aimlabs Victim',            sub: 'ซ้อม aim มาเป็นร้อยชั่วโมง สุดท้ายยังยิงกำแพงเก่งกว่าศัตรู',                        color: '#ff4444' },
    { title: 'Fake Talon Player',         sub: 'กดไวเหมือนคนเก่ง แต่พอดูจริงๆคือ panic click ล้วนๆ',                                color: '#ff4488' },
    { title: 'Human Delay 300ms',         sub: 'อินเทอร์เน็ตบ้านยังตอบสนองเร็วกว่ามือมึงอีก',                                       color: '#ff6600' },
    { title: 'Bot Detected 🤖',           sub: 'reaction ต่ำผิดมนุษย์ ขนาด AI ยังสงสาร social skill มึง',                           color: '#ff4444' },
    { title: 'One Tap แต่ One Braincell', sub: 'ยิงเข้าเป้าก็จริง แต่ IQ gameplay ยังต่ำกว่า FPS ที่เล่น',                          color: '#ff4488' },
  ]

  const [roast, setRoast] = useState({ title: '...', sub: '...', color: 'rgba(255,255,255,0.2)' })
  const [roastLoading, setRoastLoading] = useState(true)

  useEffect(() => {
    if (reflexData.length === 0) {
      setRoast({ title: 'ไม่มีข้อมูล', sub: 'มึงกดอะไรเลย ทำไมมาเล่น', color: '#555' })
      setRoastLoading(false)
      return
    }
    // สุ่ม roast จาก pool — ไม่ต้องรอ API เลย instant
    const picked = ROAST_POOL[Math.floor(Math.random() * ROAST_POOL.length)]
    setRoast(picked)
    setRoastLoading(false)
  }, [])

  // 🌟 helper แยก request รูปมีม
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

  // 🎰 slot machine spin
  const [displayScore, setDisplayScore] = useState(0)
  const [displayAura, setDisplayAura] = useState('???')
  const [displayBrain, setDisplayBrain] = useState('???')
  const [displayRarity, setDisplayRarity] = useState('UNRANKED')

  // 🎯 Valorant Rank — map จาก miss count + avg reflex
  const getDramaticRarity = () => {
    if (reflexData.length === 0) return 'UNRANKED'
    if (missCount === 0 && avgReflex !== null && avgReflex < 150) return 'RADIANT'
    if (missCount === 0 && avgReflex !== null && avgReflex < 220) return 'IMMORTAL'
    if (missCount === 0) return 'DIAMOND'
    if (missCount <= 1) return 'PLATINUM'
    if (missCount <= 2) return 'GOLD'
    if (missCount <= 3) return 'SILVER'
    if (missCount <= 4) return 'BRONZE'
    return 'IRON'
  }

  // Aura = วัดจาก hit rate
  const getDramaticAura = () => {
    if (reflexData.length === 0) return '???'
    const hitRate = perfectRounds.length / reflexData.length
    if (hitRate >= 1 && avgReflex !== null && avgReflex < 150) return '+9,999,999,999'
    if (hitRate >= 1) return '+999,999'
    if (hitRate >= 0.75) return '+1,337'
    if (hitRate >= 0.5) return '-666,666'
    if (hitRate >= 0.25) return '-9,999,999'
    return '-∞∞∞∞∞∞∞'
  }

  // Braincells = วัดจาก avg ms
  const getDramaticBrain = () => {
    if (reflexData.length === 0) return '???'
    if (avgReflex === null) return '-∞'
    if (avgReflex < 120) return '-9,999,999'
    if (avgReflex < 200) return '+420'
    if (avgReflex < 300) return '-69'
    if (avgReflex < 500) return '-9,999,999'
    return '-∞'
  }

  useEffect(() => {
    // spin score
    let start = null
    const duration = 1400
    const spinScore = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      if (progress < 0.75) {
        setDisplayScore(Math.floor(Math.random() * 100))
      } else {
        setDisplayScore(Math.round(eased * score))
      }
      if (progress < 1) requestAnimationFrame(spinScore)
      else setDisplayScore(score)
    }
    const raf = requestAnimationFrame(spinScore)

    // spin aura
    const auraVals = ['-∞', '+∞', '-9999999', '+9999999', '0', '-666', '+1337', '-99999999999']
    let auraI = 0
    const auraTimer = setInterval(() => {
      setDisplayAura(auraVals[auraI % auraVals.length])
      auraI++
    }, 80)
    setTimeout(() => { clearInterval(auraTimer); setDisplayAura(getDramaticAura()) }, 1600)

    // spin braincells
    const brainVals = ['-∞', '+∞', '0', '-9999', '+9999', '-1', '+69420', '-999999']
    let brainI = 0
    const brainTimer = setInterval(() => {
      setDisplayBrain(brainVals[brainI % brainVals.length])
      brainI++
    }, 90)
    setTimeout(() => { clearInterval(brainTimer); setDisplayBrain(getDramaticBrain()) }, 1800)

    // 🎯 spin rarity — Valorant ranks
    const rarityVals = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'IMMORTAL', 'RADIANT', 'UNRANKED']
    let rarityI = 0
    const rarityTimer = setInterval(() => {
      setDisplayRarity(rarityVals[rarityI % rarityVals.length])
      rarityI++
    }, 100)
    setTimeout(() => { clearInterval(rarityTimer); setDisplayRarity(getDramaticRarity()) }, 2000)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(auraTimer)
      clearInterval(brainTimer)
      clearInterval(rarityTimer)
    }
  }, [])

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
        @keyframes roast-scan { 0%{left:-100%} 100%{left:110%} }
        @keyframes verdict-in { 0%{opacity:0;transform:scale(0.85) translateY(4px)} 60%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes roast-pulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        @keyframes roast-glow-breathe { 0%,100%{box-shadow:0 0 18px rgba(220,38,38,0.12), inset 0 1px 0 rgba(255,255,255,0.04)} 50%{box-shadow:0 0 32px rgba(220,38,38,0.22), inset 0 1px 0 rgba(255,255,255,0.06)} }
        @keyframes rank-glow-pulse { 0%,100%{text-shadow:0 0 12px currentColor} 50%{text-shadow:0 0 28px currentColor, 0 0 48px currentColor} }

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
        .rank-text-radiant  { animation: rank-glow-pulse 2s ease-in-out infinite; }
        .rank-text-immortal { animation: rank-glow-pulse 2.5s ease-in-out infinite; }

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

      {/* พื้นหลัง glow */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '50vw', height: '50vw', maxWidth: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: '40vw', height: '40vw', maxWidth: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* 🛑 [SECRET EXPORT ZONE] */}
      <div ref={downloadCardRef} style={{
        position: 'absolute', left: '-9999px', top: '-9999px',
        background: 'linear-gradient(160deg, #ffffff 0%, #f7f3eb 100%)',
        padding: '12px 12px 36px', display: 'flex', flexDirection: 'column',
        gap: '6px', width: '320px', boxSizing: 'border-box'
      }}>
        {['grayscale(0.1) sepia(0.02)', 'none', 'grayscale(0.3) contrast(1.15)'].map((filter, i) => {
          const userImgUrl = userPhotos[i];
          const currentMemeUrl = matchedMemeUrls[i];
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
        {/* ══ ฝั่งซ้าย: Photo Strip ══ */}
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
                const currentMemeUrl = matchedMemeUrls[i];
                const isUserBase64 = userImgUrl?.startsWith('data:');
                const isMemeBase64 = currentMemeUrl?.startsWith('data:');
                return (
                  <div key={i} style={{ display: 'flex', gap: 'clamp(4px, 0.8vw, 6px)' }}>
                    <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden', background: '#d1d1d1' }}>
                      {userImgUrl
                        ? <img src={userImgUrl} crossOrigin={isUserBase64 ? undefined : "anonymous"} alt="You" className="photo-strip-img" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: '#e5e5e5' }}>📸</div>}
                    </div>
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

        {/* ══ ฝั่งขวา: รายละเอียด ══ */}
        <div className="col-right">
          <div className="r1" style={{ marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ height: '1px', width: 24, background: 'rgba(249,115,22,0.6)' }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', letterSpacing: '0.3em', color: '#ff9a52', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>Animal Result</p>
            </div>
            <h1 className="creature-shimmer" style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.6rem, 3.6vw, 3.2rem)',
              fontWeight: 900,
              lineHeight: 1,
              margin: '0 0 0.6rem',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}>King of B main</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', margin: 0, letterSpacing: '0.04em', fontWeight: 300 }}>{result.creature}</p>
          </div>

          <div className="r2" style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(249,115,22,0.35) 0%, rgba(255,255,255,0.08) 70%, transparent 100%)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }} />

          <div className="r4" style={{ width: '100%', marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(245,158,11,0.04) 100%)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 16, padding: '1.2rem 1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.2rem', position: 'relative', overflow: 'hidden' }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: '0 0 0.1rem', fontWeight: 500 }}>Match Score</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(3.2rem, 6.5vw, 4.8rem)', fontWeight: 900, lineHeight: 1, color: '#ff7849', textShadow: '0 0 35px rgba(249,115,22,0.55)' }}>{displayScore}</span>
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

          {/* 🎯 Stat cards — Rarity ใช้ Valorant rank */}
          <div className="r5" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
            {[
              { label: 'Aura',       val: result.aura,      icon: '✦', accent: 'rgba(249,115,22,', textColor: '#ff9a52' },
              { label: 'Braincells', val: result.braincells, icon: '◈', accent: 'rgba(139,92,246,', textColor: '#a78bfa' },
              { label: 'Rarity',     val: result.rarity,    icon: '◇', accent: 'rgba(245,158,11,', textColor: '#fbbf24' },
            ].map(({ label, val, icon, accent, textColor }) => {
              // 🎯 Rarity card ใช้สีและ glow ตาม Valorant rank
              const isRarity = label === 'Rarity'
              const rankColor = isRarity ? getRarityColor(displayRarity) : textColor
              const rankGlow = isRarity ? getRarityGlow(displayRarity) : 'transparent'
              const rankAccent = isRarity ? `${rankColor}28` : `${accent}0.18)`
              const rankBorder = isRarity ? `1px solid ${rankColor}45` : `1px solid ${accent}0.18)`
              const rankTopBorder = isRarity ? `2px solid ${rankColor}` : `2px solid ${accent}0.65)`
              const rankClassName = isRarity
                ? (displayRarity === 'RADIANT' ? 'rank-text-radiant' : displayRarity === 'IMMORTAL' ? 'rank-text-immortal' : '')
                : ''

              return (
                <div key={label} style={{
                  background: isRarity ? `${rankColor}08` : 'rgba(255,255,255,0.03)',
                  border: rankBorder,
                  borderTop: rankTopBorder,
                  borderRadius: 12,
                  padding: '0.95rem 0.4rem',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s, background 0.3s',
                }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 0.4rem', fontWeight: 500 }}>{icon} {label}</p>

                  {/* 🎯 Rarity แสดง Valorant rank badge */}
                  {isRarity ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <p
                        className={rankClassName}
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: 'clamp(0.7rem, 1.4vw, 0.9rem)',
                          fontWeight: 900,
                          color: rankColor,
                          margin: 0,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          lineHeight: 1.2,
                          transition: 'color 0.25s',
                        }}
                      >
                        {displayRarity}
                      </p>
                      {/* mini rank bar */}
                      <div style={{ width: '60%', height: 2, borderRadius: 99, background: `${rankColor}50`, marginTop: 3, transition: 'background 0.3s' }} />
                    </div>
                  ) : (
                    <p style={{
                      fontFamily: 'monospace',
                      fontSize: 'clamp(0.6rem, 1.2vw, 0.78rem)',
                      fontWeight: 700,
                      color: textColor,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.01em',
                      lineHeight: 1.2,
                      wordBreak: 'break-all',
                    }}>
                      {label === 'Aura' ? displayAura : label === 'Braincells' ? displayBrain : val}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="r6" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-start', width: '100%', marginBottom: 'clamp(0.8rem, 1.5vw, 1rem)' }}>
            {animalProfile.tags.map((tag) => (
              <span key={tag} className="tag-pill" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)', padding: '5px 14px', borderRadius: 99 }}>{tag}</span>
            ))}
          </div>

          {/* 🎯 REFLEX REPORT CARD */}
          {reflexData.length > 0 && (
            <div className="r6" style={{ width: '100%', marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(245,158,11,0.02) 100%)',
                border: '1px solid rgba(249,115,22,0.2)',
                borderRadius: 16,
                padding: '1rem 1.4rem',
                display: 'flex', flexDirection: 'column', gap: '0.6rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ height: '1px', width: 16, background: 'rgba(249,115,22,0.5)' }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', letterSpacing: '0.3em', color: '#ff9a52', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>Reflex Report</p>
                  </div>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', margin: 0, letterSpacing: '0.1em' }}>{reflexData.length} rounds</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {roastLoading ? (
                    <>
                      <div style={{ width: 160, height: 20, borderRadius: 4, background: 'rgba(249,115,22,0.1)', animation: 'roast-pulse 1.2s ease-in-out infinite' }} />
                      <div style={{ width: '100%', height: 13, borderRadius: 4, background: 'rgba(255,255,255,0.05)', animation: 'roast-pulse 1.2s ease-in-out infinite' }} />
                      <div style={{ width: '75%', height: 13, borderRadius: 4, background: 'rgba(255,255,255,0.04)', animation: 'roast-pulse 1.2s ease-in-out infinite' }} />
                    </>
                  ) : (
                    <>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', fontWeight: 700, color: roast.color, margin: 0, letterSpacing: '0.02em', lineHeight: 1.2 }}>{roast.title}</p>
                      <div style={{ width: 28, height: '1px', background: 'rgba(249,115,22,0.3)' }} />
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(0.78rem, 1.6vw, 0.88rem)', color: 'rgba(255,255,255,0.5)', margin: 0, fontStyle: 'italic', lineHeight: 1.5, fontWeight: 300 }}>{roast.sub}</p>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {avgReflex !== null && (
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', padding: '3px 12px', borderRadius: 99, letterSpacing: '0.02em' }}>
                      avg {avgReflex}ms
                    </span>
                  )}
                  {bestReflex !== null && (
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'rgba(249,115,22,0.8)', border: '1px solid rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.04)', padding: '3px 12px', borderRadius: 99 }}>
                      best {bestReflex}ms
                    </span>
                  )}
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', padding: '3px 12px', borderRadius: 99 }}>
                    {perfectRounds.length} hit · {missCount} miss
                  </span>
                </div>

                {/* mini bar chart */}
                <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 24 }}>
                  {reflexData.map((r, i) => {
                    const maxMs = Math.max(...reflexData.filter(x => x.ms).map(x => x.ms), 500)
                    const h = r.ms ? Math.max(3, Math.round((r.ms / maxMs) * 20)) : 3
                    const color = r.verdict === 'perfect' ? 'rgba(249,115,22,0.7)' : r.verdict === 'early' ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.15)'
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: 12, height: h, borderRadius: 2, background: color }} />
                        <span style={{ fontFamily: 'monospace', fontSize: '0.42rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.05em' }}>R{r.round}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="r7" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button onClick={handleSaveImage} className="save-btn" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 600, padding: '0.85rem', borderRadius: 12, cursor: isSaving ? 'not-allowed' : 'pointer', letterSpacing: '0.03em', textShadow: '0 1px 2px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              {isSaving ? 'Saving image...' : 'Save image'}
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button onClick={onScanAgain} className="ghost-btn" style={{ fontFamily: "'DM Sans', sans-serif", background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', padding: '0.8rem', borderRadius: 12, cursor: 'pointer', letterSpacing: '0.02em', fontWeight: 500 }}>Repeat Scan</button>
              <button onClick={onBackHome} className="glow-btn" style={{ fontFamily: "'DM Sans', sans-serif", background: 'linear-gradient(135deg, #ea580c 0%, #ff7849 50%, #f59e0b 100%)', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 600, padding: '0.8rem', borderRadius: 12, cursor: 'pointer', letterSpacing: '0.03em', textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}>Back to Home</button>
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

    const fallbackPhoto = result.scanImageUrl || '';
    const rawPhotos = (result.jumpscarePhotos && result.jumpscarePhotos.length === 3)
      ? [
          result.jumpscarePhotos[0] || fallbackPhoto,
          result.jumpscarePhotos[1] || fallbackPhoto,
          result.jumpscarePhotos[2] || fallbackPhoto
        ]
      : [fallbackPhoto, fallbackPhoto, fallbackPhoto];

    const photos = rawPhotos.map(p => processUrl(p));

    const fallbackMeme = result.matched_meme_url || '';
    const rawMemes = (result.matched_meme_urls && result.matched_meme_urls.length === 3)
      ? result.matched_meme_urls
      : [fallbackMeme, fallbackMeme, fallbackMeme];

    const memes = rawMemes.map(m => processUrl(m));

    setProcessedUrls({ scanImg, photos, memes })

    const timings = [
      setTimeout(() => setPhase(2), 4000),
      setTimeout(() => setPhase(3), 9000),
      setTimeout(() => setPhase(4), 12000),
    ]
    return () => timings.forEach(clearTimeout)
  }, [result])

  if (!result) return null

  const phaseMap = {
    1: <PhaseAnnounce creature={result.creature} imageUrl={processedUrls.scanImg} />,
    2: <PhaseFace imageUrl={processedUrls.scanImg} />,
    3: <PhaseMeme memeUrl={processedUrls.memes[2]} creature={result.creature} />,
    4: <PhaseResult result={result} userPhotos={processedUrls.photos} matchedMemeUrls={processedUrls.memes} reflexData={result.reflexData || []} onScanAgain={onScanAgain} onBackHome={onBackHome} />,
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