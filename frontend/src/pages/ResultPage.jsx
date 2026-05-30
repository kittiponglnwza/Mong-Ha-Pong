import { useEffect, useRef, useState } from 'react'
import { getAnimalProfile } from '../utils/animalProfile'
import end1Bg from '../assets/end_1.jpg'
import flashImg from '../assets/flash.jpg'
import html2canvas from 'html2canvas'

/* ─────────────────────────────────────────────────────────────
Phase 1 – UPGRADED: ember particles + scanlines + heraldic ornament
───────────────────────────────────────────────────────────────*/
function EmberParticles() {
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {Array.from({ length: 18 }).map((_, i) => {
          const x = 10 + Math.random() * 80
          const dur = 3.5 + Math.random() * 4
          const delay = Math.random() * 5
          const drift = Math.random() * 120 - 60
          return (
            <style key={`ember-style-${i}`}>{`
              @keyframes ember-${i} {
                0% { transform: translate(${x}vw, 105vh) scale(1); opacity: 0; }
                10% { opacity: 1; }
                80% { opacity: 0.3; }
                100% { transform: translate(${x + drift}vw, -5vh) scale(0.2); opacity: 0; }
              }
              .ember-${i} { animation: ember-${i} ${dur}s ease-in ${delay}s infinite; }
            `}</style>
          )
        })}
      </defs>
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 10 + Math.random() * 80
        const size = Math.random() * 3 + 1
        return (
          <ellipse
            key={i}
            className={`ember-${i}`}
            cx={`${x}%`}
            cy="105%"
            rx={size}
            ry={size * 1.4}
            fill={`rgba(251, 146, 60, ${0.5 + Math.random() * 0.4})`}
          />
        )
      })}
    </svg>
  )
}

function PhaseAnnounce({ creature, imageUrl }) {
  return (
    <section
      className="relative min-h-dvh overflow-hidden flex flex-col items-center justify-center select-none"
      style={{ paddingBottom: '2rem' }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700&display=swap"
      />
      <style>{`
        @keyframes float-up {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes title-blaze {
          0%, 100% { text-shadow: 0 0 30px rgba(251,146,60,0.9), 0 0 80px rgba(251,146,60,0.5), 0 0 120px rgba(251,146,60,0.2), 0 2px 4px rgba(0,0,0,0.8); }
          50% { text-shadow: 0 0 50px rgba(251,146,60,1), 0 0 120px rgba(251,146,60,0.7), 0 0 200px rgba(251,100,30,0.3), 0 2px 4px rgba(0,0,0,0.8); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(100vh); }
        }
        @keyframes ornament-in {
          from { opacity: 0; transform: scaleX(0); }
          to { opacity: 1; transform: scaleX(1); }
        }
        @keyframes creature-glow {
          0%, 100% { color: rgba(251,191,36,0.55); text-shadow: 0 0 12px rgba(251,146,60,0.4); }
          50% { color: rgba(251,191,36,0.85); text-shadow: 0 0 24px rgba(251,146,60,0.8), 0 0 48px rgba(251,100,30,0.4); }
        }
        .float-up-1 { animation: float-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .float-up-2 { animation: float-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .float-up-3 { animation: float-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.7s both; }
        .float-up-4 { animation: float-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .title-blaze { animation: title-blaze 2.8s ease-in-out 1.2s infinite; }
        .ornament-line { animation: ornament-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s both; transform-origin: center; }
        .creature-pulse { animation: creature-glow 3s ease-in-out 1.5s infinite; }
      `}</style>

      <img
        src={end1Bg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 40%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.75) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 2,
            background:
              'linear-gradient(180deg, transparent 0%, rgba(251,146,60,0.15) 50%, transparent 100%)',
            animation: 'scanline 6s linear 0.5s infinite',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)',
        }}
      />
      <EmberParticles />

      <div
        className="relative z-10 text-center px-6"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}
      >
        <p
          className="float-up-1"
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.65rem',
            letterSpacing: '0.55em',
            color: 'rgba(251,191,36,0.65)',
            textTransform: 'uppercase',
            marginBottom: '1.2rem',
          }}
        >
          This is
        </p>

        <div
          className="ornament-line float-up-1"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              height: 1,
              width: 60,
              background:
                'linear-gradient(90deg, transparent, rgba(251,146,60,0.7))',
            }}
          />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
            <path d="M9 1 L10.5 7 L17 9 L10.5 11 L9 17 L7.5 11 L1 9 L7.5 7 Z" fill="rgba(251,191,36,0.7)" />
          </svg>
          <div
            style={{
              height: 1,
              width: 60,
              background:
                'linear-gradient(90deg, rgba(251,146,60,0.7), transparent)',
            }}
          />
        </div>

        <h1
          className="float-up-2 title-blaze"
          style={{
            fontFamily: 'Cinzel Decorative, Cinzel, serif',
            fontSize: 'clamp(2.2rem, 8vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '0.05em',
            color: '#fff',
            marginBottom: 0,
            textShadow:
              '0 0 30px rgba(251,146,60,0.9), 0 0 80px rgba(251,146,60,0.5), 0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {creature}
        </h1>

        <div className="float-up-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.9rem' }}>
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.4))' }} />
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(251,191,36,0.6)' }} />
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, rgba(251,191,36,0.4), transparent)' }} />
        </div>

        <p
          className="float-up-3 creature-pulse"
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(0.85rem, 2.2vw, 1.1rem)',
            letterSpacing: '0.38em',
            color: 'rgba(251,191,36,0.55)',
            marginTop: '1.2rem',
            textShadow: '0 0 12px rgba(251,146,60,0.6)',
            textTransform: 'uppercase',
          }}
        >
          {creature}
        </p>
      </div>
    </section>
  )
}

const VALORANT_RANKS = {
  UNRANKED: { color: '9e9e9e', glow: 'rgba(158,158,158,0.3)', label: 'UNRANKED' },
  IRON: { color: '8a8a8a', glow: 'rgba(138,138,138,0.3)', label: 'IRON' },
  BRONZE: { color: 'cd7f32', glow: 'rgba(205,127,50,0.35)', label: 'BRONZE' },
  SILVER: { color: 'b0b8c1', glow: 'rgba(176,184,193,0.35)', label: 'SILVER' },
  GOLD: { color: 'f5c842', glow: 'rgba(245,200,66,0.4)', label: 'GOLD' },
  PLATINUM: { color: '4ecdc4', glow: 'rgba(78,205,196,0.4)', label: 'PLATINUM' },
  DIAMOND: { color: '9ecfec', glow: 'rgba(158,207,236,0.45)', label: 'DIAMOND' },
  IMMORTAL: { color: 'ff4655', glow: 'rgba(255,70,85,0.5)', label: 'IMMORTAL' },
  RADIANT: { color: 'fffb8f', glow: 'rgba(255,251,143,0.6)', label: 'RADIANT' },
}

function getRarityColor(rank) {
  return VALORANT_RANKS[rank]?.color ?? 'fbbf24'
}
function getRarityGlow(rank) {
  return VALORANT_RANKS[rank]?.glow ?? 'rgba(251,191,36,0.3)'
}

function PhaseFace({ imageUrl }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t0 = setTimeout(() => setStep(1), 300)
    const t1 = setTimeout(() => setStep(2), 350)
    const t2 = setTimeout(() => setStep(3), 850)
    const t3 = setTimeout(() => setStep(4), 1650)
    return () => [t0, t1, t2, t3].forEach(clearTimeout)
  }, [])

  return (
    <section
      style={{
        minHeight: '100dvh',
        background: '#000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingBottom: '2rem',
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 50,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: step === 1 ? 1 : 0,
        }}
      >
        <img src={flashImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {step >= 3 && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 5,
              background:
                'radial-gradient(ellipse 60% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.9) 100%)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              background: '#f5f0e8',
              padding: '10px 10px 52px 10px',
              borderRadius: '2px',
              width: 'min(290px, 76vw)',
              boxShadow:
                '0 8px 20px rgba(0,0,0,0.35), 0 24px 60px rgba(0,0,0,0.5), 0 60px 120px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(0,0,0,0.08)',
              transform: 'rotate(-1.8deg)',
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                background: '#d0c8b8',
                position: 'relative',
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Your face"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%', display: 'block' }}
                />
              ) : null}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 52,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <p
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 'clamp(1.1rem, 4vw, 1.35rem)',
                  fontWeight: 700,
                  color: '#2a1f0e',
                  margin: 0,
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                }}
              >
                King of B Main
              </p>
              <p
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'rgba(80,55,20,0.55)',
                  margin: 0,
                  letterSpacing: '0.08em',
                }}
              >
                2025
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function PhaseMeme({ memeUrl, creature }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t0 = setTimeout(() => setStep(1), 400)
    const t1 = setTimeout(() => setStep(2), 1200)
    const t2 = setTimeout(() => setStep(3), 2000)
    return () => [t0, t1, t2].forEach(clearTimeout)
  }, [])

  return (
    <section
      style={{
        minHeight: '100dvh',
        background: '#111009',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingBottom: '2rem',
      }}
    >
      {memeUrl ? (
        <img
          src={memeUrl}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            filter: 'blur(28px) saturate(0.4)',
            opacity: 0.18,
          }}
        />
      ) : null}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(0,0,0,0.72)' }} />
      {step >= 2 && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            background: '#f2ede3',
            padding: '10px 10px 60px 10px',
            borderRadius: '2px',
            width: 'min(300px, 78vw)',
            boxShadow:
              '0 8px 16px rgba(0,0,0,0.3), 0 28px 70px rgba(0,0,0,0.55), 0 60px 120px rgba(0,0,0,0.5)',
            transform: 'rotate(2deg)',
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              background: '#c8c0b0',
              position: 'relative',
            }}
          >
            {memeUrl ? (
              <img
                src={memeUrl}
                alt={creature}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
            ) : null}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 'clamp(1rem, 3.5vw, 1.25rem)', fontWeight: 700, color: '#2a1f0e', margin: 0 }}>
              {creature}
            </p>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(80,55,20,0.5)', margin: 0 }}>
              b main scanner
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

function PhaseResult({ result, userPhotos, matchedMemeUrls, reflexData, onScanAgain, onBackHome }) {
  const animalProfile = getAnimalProfile(result)
  const score = result?.animalScore ?? result?.npcScore ?? 0
  const barRef = useRef(null)
  const photoCardRef = useRef(null)
  const downloadCardRef = useRef(null)
  const [isSaving, setIsSaving] = useState(false)
  const perfectRounds = reflexData.filter((r) => r.verdict === 'perfect')
  const avgReflex = perfectRounds.length > 0 ? Math.round(perfectRounds.reduce((a, b) => a + b.ms, 0) / perfectRounds.length) : null
  const bestReflex = perfectRounds.length > 0 ? Math.min(...perfectRounds.map((r) => r.ms)) : null
  const missCount = reflexData.filter((r) => !perfectRounds.length).length

  const ROASTPOOL = [
    { title: 'Aim AFK', sub: 'reaction config decision making Bronze', color: '#ff4444' },
    { title: 'Radiant', sub: 'tutorial', color: '#ff6600' },
    { title: 'Crosshair', sub: 'sensitivity NPC', color: '#ff4488' },
    { title: 'Reaction', sub: 'aim', color: '#ff4444' },
    { title: 'Grandpa Flick Machine', sub: 'FPS', color: '#ff6600' },
    { title: 'Aimlabs Victim', sub: 'aim', color: '#ff4444' },
    { title: 'Fake Talon Player', sub: 'panic click', color: '#ff4488' },
    { title: 'Human Delay 300ms', sub: '', color: '#ff6600' },
    { title: 'Bot Detected', sub: 'reaction AI social skill', color: '#ff4444' },
    { title: 'One Tap One Braincell', sub: 'IQ gameplay FPS', color: '#ff4488' },
  ]

  const [roast, setRoast] = useState({ title: '...', sub: '...', color: 'rgba(255,255,255,0.2)' })
  const [roastLoading, setRoastLoading] = useState(true)

  useEffect(() => {
    if (reflexData.length === 0) {
      setRoast({ title: '', sub: '', color: '#555' })
      setRoastLoading(false)
      return
    }
    const picked = ROASTPOOL[Math.floor(Math.random() * ROASTPOOL.length)]
    setRoast(picked)
    setRoastLoading(false)
  }, [])

  const getMemeUrlForIndex = (url, index) => {
    if (!url) return url
    if (url.startsWith('data:')) return url
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}shot=${index}`
  }

  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${score}%`
    }, 800)
    return () => clearTimeout(t)
  }, [score])

  const getDramaticRarity = () => {
    if (reflexData.length === 0) return 'UNRANKED'
    if (missCount === 0 && avgReflex !== null && avgReflex <= 150) return 'RADIANT'
    if (missCount === 0 && avgReflex !== null && avgReflex <= 220) return 'IMMORTAL'
    if (missCount === 0) return 'DIAMOND'
    if (missCount === 1) return 'PLATINUM'
    if (missCount === 2) return 'GOLD'
    if (missCount === 3) return 'SILVER'
    if (missCount === 4) return 'BRONZE'
    return 'IRON'
  }

  const getDramaticAura = () => {
    if (reflexData.length === 0) return '-'
    const hitRate = perfectRounds.length / reflexData.length
    if (hitRate === 1 && avgReflex !== null && avgReflex <= 150) return '9,999,999,999'
    if (hitRate === 1) return '999,999'
    if (hitRate >= 0.75) return '1,337'
    if (hitRate >= 0.5) return '-666,666'
    if (hitRate >= 0.25) return '-9,999,999'
    return '-'
  }

  const getDramaticBrain = () => {
    if (reflexData.length === 0) return '-'
    if (avgReflex === null) return '-'
    if (avgReflex <= 120) return '-9,999,999'
    if (avgReflex <= 200) return '420'
    if (avgReflex <= 300) return '-69'
    if (avgReflex <= 500) return '-9,999,999'
    return '-'
  }

  const [displayScore, setDisplayScore] = useState(0)
  const [displayAura, setDisplayAura] = useState('-')
  const [displayBrain, setDisplayBrain] = useState('-')
  const [displayRarity, setDisplayRarity] = useState('UNRANKED')

  useEffect(() => {
    let start = null
    const duration = 1400
    const spinScore = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      if (progress < 0.75) setDisplayScore(Math.floor(Math.random() * 100))
      else setDisplayScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(spinScore)
      else setDisplayScore(score)
    }
    const raf = requestAnimationFrame(spinScore)

    const auraVals = ['-', '-', '-9999999999', '9999999', '0', '-666', '1337', '-999999']
    let auraI = 0
    const auraTimer = setInterval(() => {
      setDisplayAura(auraVals[auraI % auraVals.length])
      auraI++
    }, 80)
    const auraDone = setTimeout(() => {
      clearInterval(auraTimer)
      setDisplayAura(getDramaticAura())
    }, 1600)

    const brainVals = ['-', '-', '0', '-9999', '9999', '-1', '69420', '-999999']
    let brainI = 0
    const brainTimer = setInterval(() => {
      setDisplayBrain(brainVals[brainI % brainVals.length])
      brainI++
    }, 90)
    const brainDone = setTimeout(() => {
      clearInterval(brainTimer)
      setDisplayBrain(getDramaticBrain())
    }, 1800)

    const rarityVals = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'IMMORTAL', 'RADIANT', 'UNRANKED']
    let rarityI = 0
    const rarityTimer = setInterval(() => {
      setDisplayRarity(rarityVals[rarityI % rarityVals.length])
      rarityI++
    }, 100)
    const rarityDone = setTimeout(() => {
      clearInterval(rarityTimer)
      setDisplayRarity(getDramaticRarity())
    }, 2000)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(auraTimer)
      clearInterval(brainTimer)
      clearInterval(rarityTimer)
      clearTimeout(auraDone)
      clearTimeout(brainDone)
      clearTimeout(rarityDone)
    }
  }, [score])

  const handleSaveImage = async () => {
    if (!downloadCardRef.current || isSaving) return
    try {
      setIsSaving(true)
      const canvas = await html2canvas(downloadCardRef.current, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        scale: 3,
        logging: false,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${result?.creature || 'b-main-result'}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to save image:', error)
      alert('Failed to save image')
    } finally {
      setIsSaving(false)
    }
  }

  const rankColor = getRarityColor(displayRarity)
  const rankGlow = getRarityGlow(displayRarity)

  return (
    <section
      style={{
        minHeight: '100dvh',
        backgroundImage: `linear-gradient(135deg, rgba(5,5,12,0.94) 0%, rgba(10,10,22,0.97) 100%), url(${end1Bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        color: '#f8f6f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'hidden',
        overflowY: 'visible',
        position: 'relative',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
      />
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95) rotate(-1deg); } to { opacity: 1; transform: scale(1) rotate(2deg); } }
        @keyframes drift { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(-2deg); } }
        @keyframes scan-line { 0% { top: -4px; } 100% { top: calc(100% + 4px); } }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes roast-scan { 0% { left: -100%; } 100% { left: 110%; } }
        @keyframes verdict-in { 0% { opacity: 0; transform: scale(0.85) translateY(4px); } 60% { transform: scale(1.04); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes roast-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        @keyframes roast-glow-breathe { 0%,100% { box-shadow: 0 0 18px rgba(220,38,38,0.12), inset 0 1px 0 rgba(255,255,255,0.04); } 50% { box-shadow: 0 0 32px rgba(220,38,38,0.22), inset 0 1px 0 rgba(255,255,255,0.06); } }
        @keyframes rank-glow-pulse { 0%,100% { text-shadow: 0 0 12px currentColor; } 50% { text-shadow: 0 0 28px currentColor, 0 0 48px currentColor; } }
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
        .rank-text-radiant { animation: rank-glow-pulse 2s ease-in-out infinite; }
        .rank-text-immortal { animation: rank-glow-pulse 2.5s ease-in-out infinite; }
        .glow-btn { transition: all 0.2s; }
        .glow-btn:hover { box-shadow: 0 0 28px rgba(249,115,22,0.55); transform: translateY(-1px); }
        .glow-btn:active { transform: scale(0.98); }
        .save-btn {
          transition: all 0.2s;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
          color: #fff;
          border: none;
        }
        .save-btn:hover { box-shadow: 0 0 28px rgba(245,158,11,0.6); transform: translateY(-1px); }
        .save-btn:active { transform: scale(0.98); }
        .ghost-btn { transition: all 0.2s; }
        .ghost-btn:hover {
          border-color: rgba(255,255,255,0.4) !important;
          color: #fff !important;
          background: rgba(255,255,255,0.03);
        }
        .tag-pill { transition: all 0.15s; cursor: default; }
        .tag-pill:hover {
          background: rgba(249,115,22,0.15);
          border-color: rgba(249,115,22,0.4);
          color: #ff9a52;
        }
        .photo-strip-img { transition: filter 0.3s; }
        .photo-strip-img:hover { filter: grayscale(0) contrast(1.15) brightness(1.05) !important; }
        .layout-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          padding: 2rem 1.25rem 3rem;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .layout-container {
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
            min-height: 94dvh;
            gap: clamp(1.5rem, 3vw, 4.5rem);
            padding: 2rem 1.25rem 3rem;
          }
          .col-left {
            flex: 0 0 auto;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            position: sticky;
            top: 2rem;
          }
          .col-right {
            flex: 1;
            max-width: 540px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding-bottom: 2rem;
          }
        }
        @media (min-width: 1024px) {
          .layout-container {
            flex-direction: row;
            justify-content: center;
            align-items: center;
            min-height: 94dvh;
            height: auto;
            gap: 4.5rem;
            padding: 0 2rem 3rem;
            overflow: visible;
          }
          .col-left {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            position: static;
          }
          .col-right {
            flex: 1;
            max-width: 540px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            max-height: 90dvh;
            overflow-y: auto;
            scrollbar-width: none;
            padding-bottom: 2.5rem;
          }
          .col-right::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          top: -10,
          right: -10,
          width: '50vw',
          height: '50vw',
          maxWidth: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: -10,
          left: -10,
          width: '40vw',
          height: '40vw',
          maxWidth: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        ref={downloadCardRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          background: 'linear-gradient(160deg, #ffffff 0%, #f7f3eb 100%)',
          padding: '12px 12px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: 320,
          boxSizing: 'border-box',
          filter: 'grayscale(0.1) sepia(0.02)',
        }}
      >
        {userPhotos.map((u, i) => (
          <div key={i} style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, aspectRatio: '1 / 1', overflow: 'hidden', background: '#d1d1d1' }}>
              {u ? (
                <img src={u} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
              ) : null}
            </div>
            <div style={{ flex: 1, aspectRatio: '1 / 1', overflow: 'hidden', background: '#d1d1d1' }}>
              {matchedMemeUrls[i] ? (
                <img src={getMemeUrlForIndex(matchedMemeUrls[i], i)} alt={animalProfile.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="layout-container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="col-left r3">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(249,115,22,0.6)', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>
              YOU ↔ MATCH
            </p>
            <div className="drift photo-card" id="download-photo-card" ref={photoCardRef} style={{
              background: 'linear-gradient(160deg, #ffffff 0%, #f7f3eb 100%)',
              padding: 'clamp(6px, 1.2vw, 12px) clamp(6px, 1.2vw, 12px) clamp(22px, 3.5vw, 32px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(4px, 0.8vw, 6px)',
              boxShadow: '0 25px 70px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.9)',
              transform: 'rotate(-2deg)',
              width: 'clamp(250px, 23vw, 320px)',
              position: 'relative',
            }}>
              {userPhotos.map((u, i) => (
                <div key={i} style={{ display: 'flex', gap: 'clamp(4px, 0.8vw, 6px)' }}>
                  <div style={{ flex: 1, aspectRatio: '1 / 1', overflow: 'hidden', background: '#d1d1d1' }}>
                    {u ? (
                      <img src={u} className="photo-strip-img" alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                    ) : null}
                  </div>
                  <div style={{ flex: 1, aspectRatio: '1 / 1', overflow: 'hidden', background: '#d1d1d1' }}>
                    {matchedMemeUrls[i] ? (
                      <img src={getMemeUrlForIndex(matchedMemeUrls[i], i)} className="photo-strip-img" alt={animalProfile.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {['YOU', 'MATCH'].map((l) => (
                  <p key={l} style={{ flex: 1, textAlign: 'center', fontSize: '8px', color: '#777', fontFamily: 'monospace', letterSpacing: '0.15em', margin: 0, fontWeight: 'bold' }}>
                    {l}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-right">
          <div className="r1" style={{ marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ height: 1, width: 24, background: 'rgba(249,115,22,0.6)' }} />
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: '#ff9a52', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>
                Animal Result
              </p>
            </div>
            <h1 className="creature-shimmer" style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.6rem, 3.6vw, 3.2rem)', fontWeight: 900, lineHeight: 1, margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              {result.creature}
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontStyle: 'italic', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', margin: 0, letterSpacing: '0.04em', fontWeight: 300 }}>
              {animalProfile.description}
            </p>
          </div>

          <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, rgba(249,115,22,0.35) 0%, rgba(255,255,255,0.08) 70%, transparent 100%)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }} />

          <div className="r4" style={{ width: '100%', marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(245,158,11,0.04) 100%)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 16, padding: '1.2rem 1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.2rem', position: 'relative', overflow: 'hidden' }}>
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: '0 0 0.1rem', fontWeight: 500 }}>
                  Match Score
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                  <span style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(3.2rem, 6.5vw, 4.8rem)', fontWeight: 900, lineHeight: 1, color: '#ff7849', textShadow: '0 0 35px rgba(249,115,22,0.55)' }}>
                    {displayScore}
                  </span>
                  <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem', fontWeight: 700, color: 'rgba(249,115,22,0.65)' }}>%</span>
                </div>
              </div>
              <div style={{ flex: 1, maxWidth: 280 }}>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div ref={barRef} style={{ height: '100%', width: 0, borderRadius: 99, background: 'linear-gradient(90deg, #ea580c, #ff7849)', transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 10px rgba(249,115,22,0.7)' }} />
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontStyle: 'italic', fontSize: '0.75rem', color: '#e5e7eb', margin: 0, letterSpacing: '0.02em', lineHeight: 1.35, fontWeight: 400 }}>
                  {animalProfile.description}
                </p>
              </div>
            </div>
          </div>

          <div className="r5" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
            {[
              { label: 'Aura', val: displayAura, accent: 'rgba(249,115,22,0.18)', textColor: '#ff9a52' },
              { label: 'Braincells', val: displayBrain, accent: 'rgba(139,92,246,0.18)', textColor: '#a78bfa' },
              { label: 'Rarity', val: displayRarity, accent: 'rgba(245,158,11,0.18)', textColor: '#fbbf24', isRarity: true },
            ].map(({ label, val, accent, textColor, isRarity }) => {
              const rankColorHex = isRarity ? getRarityColor(displayRarity) : null
              const rankBorder = isRarity ? `1px solid #${rankColorHex}45` : `1px solid ${accent}`
              const rankTopBorder = isRarity ? `2px solid #${rankColorHex}` : `2px solid rgba(249,115,22,0.65)`
              const rankClassName = isRarity ? (displayRarity === 'RADIANT' ? 'rank-text-radiant' : displayRarity === 'IMMORTAL' ? 'rank-text-immortal' : '') : ''

              return (
                <div
                  key={label}
                  style={{
                    background: isRarity ? `#${rankColorHex}08` : 'rgba(255,255,255,0.03)',
                    border: rankBorder,
                    borderTop: rankTopBorder,
                    borderRadius: 12,
                    padding: '0.95rem 0.4rem',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'border-color 0.3s, background 0.3s',
                  }}
                >
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 0.4rem', fontWeight: 500 }}>
                    {label}
                  </p>
                  {isRarity ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <p className={rankClassName} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(0.7rem, 1.4vw, 0.9rem)', fontWeight: 900, color: `#${rankColorHex}`, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2, transition: 'color 0.25s' }}>
                        {displayRarity}
                      </p>
                      <div style={{ width: 60, height: 2, borderRadius: 99, background: `#${rankColorHex}50`, marginTop: 3, transition: 'background 0.3s' }} />
                    </div>
                  ) : (
                    <p style={{ fontFamily: 'monospace', fontSize: 'clamp(0.6rem, 1.2vw, 0.78rem)', fontWeight: 700, color: textColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.01em', lineHeight: 1.2, wordBreak: 'break-all' }}>
                      {val}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="r6" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-start', width: '100%', marginBottom: 'clamp(0.8rem, 1.5vw, 1rem)' }}>
            {animalProfile.tags.map((tag) => (
              <span
                key={tag}
                className="tag-pill"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.68rem',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '5px 14px',
                  borderRadius: 99,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {reflexData.length > 0 && (
            <div className="r6" style={{ width: '100%', marginBottom: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(245,158,11,0.02) 100%)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 16, padding: '1rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ height: 1, width: 16, background: 'rgba(249,115,22,0.5)' }} />
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: '#ff9a52', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>
                      Reflex Report
                    </p>
                  </div>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', margin: 0, letterSpacing: '0.1em' }}>
                    {reflexData.length} rounds
                  </p>
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
                      <p style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', fontWeight: 700, color: roast.color, margin: 0, letterSpacing: '0.02em', lineHeight: 1.2 }}>
                        {roast.title}
                      </p>
                      <div style={{ width: 28, height: 1, background: 'rgba(249,115,22,0.3)' }} />
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(0.78rem, 1.6vw, 0.88rem)', color: 'rgba(255,255,255,0.5)', margin: 0, fontStyle: 'italic', lineHeight: 1.5, fontWeight: 300 }}>
                        {roast.sub}
                      </p>
                    </>
                  )}
                </div>

                {bestReflex !== null && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.2rem' }}>
                    <span style={{ alignSelf: 'flex-start', fontFamily: 'DM Sans, sans-serif', fontSize: '0.58rem', fontWeight: 700, color: '#ff4444', border: '1px solid rgba(220,38,38,0.6)', background: 'rgba(220,38,38,0.12)', padding: '2px 10px', borderRadius: 4, letterSpacing: '0.12em', textTransform: 'uppercase', boxShadow: '0 0 8px rgba(220,38,38,0.25)' }}>
                      INSANE
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem' }}>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 900, color: '#fff', lineHeight: 1, textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                        {bestReflex}
                      </span>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>
                        ms
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="r7" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem', flexShrink: 0, paddingBottom: '1rem' }}>
            <button
              onClick={handleSaveImage}
              className="save-btn"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '0.85rem',
                borderRadius: 12,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                letterSpacing: '0.03em',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Saving image...' : 'Save image'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                onClick={onScanAgain}
                className="ghost-btn"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '0.82rem',
                  padding: '0.8rem',
                  borderRadius: 12,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  fontWeight: 500,
                }}
              >
                Repeat Scan
              </button>
              <button
                onClick={onBackHome}
                className="glow-btn"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  background: 'linear-gradient(135deg, #ea580c 0%, #ff7849 50%, #f59e0b 100%)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '0.8rem',
                  borderRadius: 12,
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  textShadow: '0 1px 3px rgba(0,0,0,0.35)',
                }}
              >
                Back to Home
              </button>
            </div>
          </div>

          <p style={{ fontFamily: 'monospace', fontSize: '0.5rem', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.25em', marginTop: '1.4rem', textTransform: 'uppercase', textAlign: 'left' }}>
            b main scanner v1.0 · animal identification system
          </p>
        </div>
      </div>
    </section>
  )
}

function ResultPage({ result, onScanAgain, onBackHome }) {
  const [phase, setPhase] = useState(1)
  const [processedUrls, setProcessedUrls] = useState({ scanImg: '', photos: [], memes: [] })

  useEffect(() => {
    if (!result) return
    const processUrl = (url) => {
      if (!url) return url
      if (url.startsWith('data:')) return url
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}t=${Date.now()}`
    }

    const scanImg = processUrl(result.scanImageUrl)
    const fallbackPhoto = result.scanImageUrl
    const rawPhotos =
      result.jumpscarePhotos && result.jumpscarePhotos.length >= 3
        ? result.jumpscarePhotos
        : [fallbackPhoto, fallbackPhoto, fallbackPhoto]
    const photos = rawPhotos.map((p) => processUrl(p))

    const fallbackMeme = result.matchedMemeUrl
    const rawMemes =
      result.matchedMemeUrls && result.matchedMemeUrls.length >= 3
        ? result.matchedMemeUrls
        : [fallbackMeme, fallbackMeme, fallbackMeme]
    const memes = rawMemes.map((m) => processUrl(m))

    setProcessedUrls({ scanImg, photos, memes })

    const timings = [
      setTimeout(() => setPhase(2), 6000),
      setTimeout(() => setPhase(3), 9000),
      setTimeout(() => setPhase(4), 15000),
    ]
    return () => timings.forEach(clearTimeout)
  }, [result])

  if (!result) return null

  const phaseMap = {
    1: <PhaseAnnounce creature={result.creature} imageUrl={processedUrls.scanImg} />,
    2: <PhaseFace imageUrl={processedUrls.scanImg} />,
    3: <PhaseMeme memeUrl={processedUrls.memes?.[2]} creature={result.creature} />,
    4: (
      <PhaseResult
        result={result}
        userPhotos={processedUrls.photos}
        matchedMemeUrls={processedUrls.memes}
        reflexData={result.reflexData || []}
        onScanAgain={onScanAgain}
        onBackHome={onBackHome}
      />
    ),
  }

  return (
    <div key={phase} style={{ animation: 'fade-phase 0.4s ease both' }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap"
      />
      <style>{`
        @keyframes fade-phase {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      {phaseMap[phase]}
    </div>
  )
}

export default ResultPage