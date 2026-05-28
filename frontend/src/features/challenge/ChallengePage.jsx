import { useState, useEffect, useRef } from 'react'

const API = 'http://localhost:8002'
const JUMPSCARE_ROUND = 5

export default function ChallengePage({ onDone, onJumpscare, onBack }) {
  const [phase, setPhase] = useState('loading')
  const [countdown, setCountdown] = useState(3)
  const [clip, setClip] = useState(null)
  const [resultData, setResultData] = useState(null)
  const [isJumpscare, setIsJumpscare] = useState(false)
  const [reflexMs, setReflexMs] = useState(null)          // ⏱ reflex ของ clip นี้
  const [allReflexTimes, setAllReflexTimes] = useState([]) // 📊 ประวัติทุก clip
  const [resultImg, setResultImg] = useState(null)         // 🖼 รูปจาก folder

  const videoRef = useRef(null)
  const webcamRef = useRef(null)
  const hasClickedRef = useRef(false)
  const peekTimeRef = useRef(null)
  const roundRef = useRef(0)
  const capturedRef = useRef(false)
  const playStartTimeRef = useRef(null)
  const peekStartTimeRef = useRef(null) // ⏱ จับเวลาตอน peek โผล่จริงๆ

  const frameBufferRef = useRef([])
  const captureLoopRef = useRef(null)

  const hitSoundRef = useRef(null)
  const missSoundRef = useRef(null)

  const photosRef = useRef({
    beginImg: null,
    tooLateImg: null,
    jumpscareImg: null,
  })

  // --- โหลดเสียง ---
  useEffect(() => {
    hitSoundRef.current = new Audio('/sounds/hit.mp3')     // ยิงโดน
    missSoundRef.current = new Audio('/sounds/shoot.mp3')  // ยิงพลาด / ช้า
    hitSoundRef.current.volume = 0.8
    missSoundRef.current.volume = 0.8
  }, [])

  const playSound = (type) => {
    try {
      if (type === 'hit' && hitSoundRef.current) {
        hitSoundRef.current.currentTime = 0
        hitSoundRef.current.play()
      } else if (type === 'miss' && missSoundRef.current) {
        missSoundRef.current.currentTime = 0
        missSoundRef.current.play()
      }
    } catch (e) { /* ignore audio errors */ }
  }

  // 🖼 ดึงรูปจาก folder ของ server
  const fetchResultImg = () => {
    fetch(`${API}/api/images/random`)
      .then(r => r.json())
      .then(data => setResultImg(`${API}/images/${data.filename}`))
      .catch(() => setResultImg(null))
  }

  const getLatestFrame = () => {
    const buf = frameBufferRef.current
    return buf.length > 0 ? buf[buf.length - 1].dataUrl : null
  }

  // --- จบเกม ---
  const finishGame = () => {
    const finalPhotos = [
      photosRef.current.beginImg || getLatestFrame(),
      photosRef.current.tooLateImg || getLatestFrame(),
      photosRef.current.jumpscareImg || getLatestFrame(),
    ]
    onJumpscare(finalPhotos)
  }

  // 🎥 เปิดกล้อง + buffer loop
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        if (webcamRef.current) webcamRef.current.srcObject = stream
        captureLoopRef.current = setInterval(() => {
          const webcam = webcamRef.current
          if (!webcam || webcam.videoWidth === 0) return
          const canvas = document.createElement('canvas')
          canvas.width = webcam.videoWidth
          canvas.height = webcam.videoHeight
          canvas.getContext('2d').drawImage(webcam, 0, 0)
          const frame = { ts: Date.now(), dataUrl: canvas.toDataURL('image/jpeg', 0.8) }
          frameBufferRef.current = [...frameBufferRef.current.slice(-19), frame]
        }, 200)
      })
      .catch(err => console.error('webcam error', err))

    return () => {
      webcamRef.current?.srcObject?.getTracks().forEach(t => t.stop())
      clearInterval(captureLoopRef.current)
    }
  }, [])

  const loadClip = () => {
    roundRef.current += 1
    const isJump = roundRef.current >= JUMPSCARE_ROUND
    setIsJumpscare(isJump)
    setPhase('loading')
    setCountdown(3)
    setReflexMs(null)
    setResultImg(null)
    hasClickedRef.current = false
    capturedRef.current = false
    playStartTimeRef.current = null
    peekStartTimeRef.current = null

    photosRef.current = {
      beginImg: photosRef.current.beginImg || null,
      tooLateImg: photosRef.current.tooLateImg || null,
      jumpscareImg: photosRef.current.jumpscareImg || null,
    }

    fetch(isJump ? `${API}/api/clips/jumpscare/random` : `${API}/api/clips/random`)
      .then(r => r.json())
      .then(data => {
        setClip(data)
        peekTimeRef.current = data.peekTime ?? null
        setPhase('countdown')
      })
  }

  const initRef = useRef(false)
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    loadClip()
  }, [])

  // ⏳ countdown
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown === 0) { setPhase('playing'); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // 🎬 เริ่มเล่น
  useEffect(() => {
    if (phase === 'playing') {
      videoRef.current?.play()
      playStartTimeRef.current = Date.now() // ⏱ เริ่มจับเวลา
      setTimeout(() => {
        if (!photosRef.current.beginImg) {
          photosRef.current.beginImg = getLatestFrame()
        }
      }, 400)
    }
  }, [phase])

  const handleTimeUpdate = () => {
    if (isJumpscare && capturedRef.current) return

    const t = videoRef.current?.currentTime ?? 0
    const peek = peekTimeRef.current ?? 0

    // ⏱ บันทึกเวลาจริงตอน peek โผล่ครั้งแรก
    if (t >= peek && peekStartTimeRef.current === null) {
      peekStartTimeRef.current = Date.now()
    }

    if (isJumpscare && t >= peek) {
      capturedRef.current = true
      photosRef.current.jumpscareImg = getLatestFrame()
      finishGame()
    }
  }

  const handleVideoEnd = () => {
    if (isJumpscare) {
      if (!capturedRef.current) photosRef.current.jumpscareImg = getLatestFrame()
      finishGame()
    } else {
      if (!hasClickedRef.current) {
        photosRef.current.tooLateImg = getLatestFrame()
        playSound('miss')
        const elapsed = playStartTimeRef.current ? Date.now() - playStartTimeRef.current : null
        const ms = elapsed ?? 9999
        setReflexMs(ms)
        setAllReflexTimes(prev => [...prev, { round: roundRef.current, ms, verdict: 'late' }])
        setResultData({ verdict: 'late', diff: 0, stopTime: 0, peekTime: 0, ms })
        fetchResultImg()
        setPhase('result')
      }
    }
  }

  const handleClick = () => {
    if (phase !== 'playing' || isJumpscare || hasClickedRef.current) return
    hasClickedRef.current = true
    videoRef.current?.pause()
    photosRef.current.tooLateImg = getLatestFrame()

    const peekStarted = peekStartTimeRef.current !== null // peek โผล่แล้วหรือยัง

    if (!peekStarted) {
      // กดก่อน peek โผล่เลย — too early
      playSound('miss')
      const ms = playStartTimeRef.current ? Date.now() - playStartTimeRef.current : 0
      setReflexMs(null)
      setAllReflexTimes(prev => [...prev, { round: roundRef.current, ms, verdict: 'early' }])
      setResultData({ verdict: 'early', ms: null })
    } else {
      // กดหลัง peek โผล่ — คำนวณ reflex จากตอน peek จริงๆ
      const reflexAfterPeek = Date.now() - peekStartTimeRef.current
      playSound('hit')
      setReflexMs(reflexAfterPeek)
      setAllReflexTimes(prev => [...prev, { round: roundRef.current, ms: reflexAfterPeek, verdict: 'perfect' }])
      setResultData({ verdict: 'perfect', ms: reflexAfterPeek })
    }

    fetchResultImg()
    setPhase('result')
  }

  // --- rating ตาม reflex ---
  const getReflexRating = (ms) => {
    if (ms === null) return { label: '—', color: '#888' }
    if (ms < 200) return { label: 'INSANE ⚡', color: '#ff4444' }
    if (ms < 350) return { label: 'GREAT 🔥', color: '#ff9900' }
    if (ms < 500) return { label: 'GOOD 👍', color: '#00ff88' }
    if (ms < 750) return { label: 'AVERAGE 😐', color: '#88ccff' }
    return { label: 'SLOW 🐢', color: '#aaaaaa' }
  }

  const avgReflex = allReflexTimes.length > 0
    ? Math.round(allReflexTimes.reduce((a, b) => a + b.ms, 0) / allReflexTimes.length)
    : null

  const currentRound = roundRef.current
  const totalRounds = JUMPSCARE_ROUND

  return (
    <div style={{...styles.container, cursor: phase === 'playing' ? 'none' : 'default'}} onClick={handleClick}>
      <video ref={webcamRef} autoPlay playsInline muted style={styles.hiddenCam} />

      {/* HUD top bar */}
      <div style={styles.hud}>
        <div style={styles.hudItem}>
          <span style={styles.hudLabel}>ROUND</span>
          <span style={styles.hudValue}>{currentRound}/{totalRounds}</span>
        </div>
        <div style={styles.hudItem}>
          <span style={styles.hudLabel}>AVG REFLEX</span>
          <span style={styles.hudValue}>{avgReflex !== null ? `${avgReflex}ms` : '—'}</span>
        </div>
        <div style={styles.hudItem}>
          <span style={styles.hudLabel}>LAST</span>
          <span style={styles.hudValue}>{reflexMs !== null ? `${reflexMs}ms` : '—'}</span>
        </div>
      </div>

      {phase === 'loading' && (
        <div style={styles.overlay}>
          <p style={styles.bigText}>Loading...</p>
        </div>
      )}

      {phase === 'countdown' && (
        <div style={styles.overlay}>
          <p style={styles.countdownText}>{countdown === 0 ? 'GO!' : countdown}</p>
        </div>
      )}

      {clip && (
        <video
          ref={videoRef}
          src={`${API}/clips/${clip.filename}`}
          style={{ ...styles.video, display: phase === 'playing' || phase === 'result' ? 'block' : 'none' }}
          onEnded={handleVideoEnd}
          onTimeUpdate={handleTimeUpdate}
          playsInline
        />
      )}

      {/* 🎯 Crosshair กลางจอ — แสดงเฉพาะตอน playing */}
      {phase === 'playing' && !isJumpscare && (
        <div style={styles.crosshairWrap} onClick={e => e.stopPropagation()}>
          <div style={styles.crosshairCenter} onClick={handleClick}>
            <div style={styles.chTop} />
            <div style={styles.chBottom} />
            <div style={styles.chLeft} />
            <div style={styles.chRight} />
            <div style={styles.chDot} />
          </div>
        </div>
      )}

      {/* 📊 RESULT */}
      {phase === 'result' && resultData && (
        <div style={styles.resultOverlay}>
          <div style={styles.resultCard}>
            {/* ซ้าย: รูปจาก folder */}
            <div style={styles.photoCol}>
              {resultImg ? (
                <img
                  src={resultImg}
                  alt="result"
                  style={styles.reactionPhoto}
                />
              ) : (
                <div style={styles.photoPlaceholder}>🖼️</div>
              )}
              <p style={styles.photoCaption}>
                {resultData.verdict === 'perfect' ? '🎯 nice shot'
               : resultData.verdict === 'early'   ? '⚡ too early'
               : '💀 too slow'}
              </p>
            </div>

            {/* ขวา: ผลลัพธ์ */}
            <div style={styles.resultCol}>
              <p style={{
                ...styles.verdict,
                color: resultData.verdict === 'perfect' ? '#00ff88'
                     : resultData.verdict === 'early'   ? '#ffaa00'
                     : '#ff4444'
              }}>
                {resultData.verdict === 'perfect' ? '🎯 PERFECT'
               : resultData.verdict === 'early'   ? '⚡ TOO EARLY'
               : '💀 TOO LATE'}
              </p>

              {resultData.ms !== undefined && (
                <>
                  <div style={styles.reflexBox}>
                    <span style={styles.reflexLabel}>REFLEX TIME</span>
                    <span style={styles.reflexMs}>{resultData.ms}<span style={styles.reflexUnit}>ms</span></span>
                    <span style={{
                      ...styles.reflexRating,
                      color: getReflexRating(resultData.ms).color
                    }}>
                      {getReflexRating(resultData.ms).label}
                    </span>
                  </div>

                  {/* มินิกราฟแสดงประวัติ */}
                  {allReflexTimes.length > 1 && (
                    <div style={styles.historyWrap}>
                      <p style={styles.historyTitle}>HISTORY</p>
                      <div style={styles.historyBars}>
                        {allReflexTimes.map((r, i) => {
                          const maxMs = Math.max(...allReflexTimes.map(x => x.ms), 800)
                          const h = Math.max(4, Math.round((r.ms / maxMs) * 60))
                          return (
                            <div key={i} style={styles.barWrap}>
                              <div style={{
                                ...styles.bar,
                                height: h,
                                background: r.verdict === 'perfect' ? '#00ff88'
                                        : r.verdict === 'early'   ? '#ffaa00'
                                        : '#ff4444'
                              }} />
                              <span style={styles.barLabel}>R{r.round}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div style={styles.btnRow}>
                {roundRef.current < JUMPSCARE_ROUND ? (
                  <button style={styles.btn} onClick={e => { e.stopPropagation(); loadClip() }}>
                    Next Round →
                  </button>
                ) : (
                  <button style={styles.btn} onClick={e => { e.stopPropagation(); finishGame() }}>
                    View Results →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    position: 'relative', width: '100vw', height: '100vh',
    background: '#000', display: 'flex', alignItems: 'center',
    justifyContent: 'center', overflow: 'hidden', cursor: 'crosshair'
  },
  hiddenCam: { position: 'absolute', width: 1, height: 1, opacity: 0 },

  // HUD
  hud: {
    position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
    display: 'flex', gap: 32, background: 'rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
    padding: '8px 24px', zIndex: 30, backdropFilter: 'blur(6px)'
  },
  hudItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  hudLabel: { fontSize: 10, color: '#888', letterSpacing: 2, fontFamily: 'monospace', textTransform: 'uppercase' },
  hudValue: { fontSize: 18, color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' },

  overlay: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  bigText: { color: '#fff', fontSize: 32 },
  countdownText: { color: '#fff', fontSize: 120, fontWeight: 'bold', fontFamily: 'monospace' },
  video: { width: '100%', height: '100%', objectFit: 'contain' },

  // 🎯 Crosshair
  crosshairWrap: {
    position: 'absolute', inset: 0, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none', zIndex: 10
  },
  crosshairCenter: {
    position: 'relative', width: 32, height: 32,
    pointerEvents: 'all', cursor: 'crosshair'
  },
  chTop: {
    position: 'absolute', left: '50%', top: 0,
    transform: 'translateX(-50%)',
    width: 2, height: 10, background: '#00ff88',
    boxShadow: '0 0 4px #00ff88'
  },
  chBottom: {
    position: 'absolute', left: '50%', bottom: 0,
    transform: 'translateX(-50%)',
    width: 2, height: 10, background: '#00ff88',
    boxShadow: '0 0 4px #00ff88'
  },
  chLeft: {
    position: 'absolute', top: '50%', left: 0,
    transform: 'translateY(-50%)',
    width: 10, height: 2, background: '#00ff88',
    boxShadow: '0 0 4px #00ff88'
  },
  chRight: {
    position: 'absolute', top: '50%', right: 0,
    transform: 'translateY(-50%)',
    width: 10, height: 2, background: '#00ff88',
    boxShadow: '0 0 4px #00ff88'
  },
  chDot: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 3, height: 3, background: '#fff',
    borderRadius: '50%'
  },

  // Result
  resultOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 20, backdropFilter: 'blur(4px)'
  },
  resultCard: {
    display: 'flex', gap: 32, alignItems: 'flex-start',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 16, padding: 32,
    maxWidth: 720, width: '90%'
  },
  photoCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 },
  reactionPhoto: {
    width: 160, height: 120, objectFit: 'cover',
    borderRadius: 10, border: '2px solid rgba(255,255,255,0.2)'
  },
  photoPlaceholder: {
    width: 160, height: 120, background: '#111', borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40
  },
  photoCaption: { color: '#666', fontSize: 12, fontFamily: 'monospace', margin: 0 },

  resultCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: 16 },
  verdict: { fontSize: 42, fontWeight: 'bold', margin: 0, fontFamily: 'monospace' },

  reflexBox: {
    background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)',
    borderRadius: 10, padding: '12px 20px',
    display: 'flex', flexDirection: 'column', gap: 4
  },
  reflexLabel: { fontSize: 11, color: '#888', letterSpacing: 2, fontFamily: 'monospace' },
  reflexMs: { fontSize: 44, color: '#fff', fontWeight: 'bold', fontFamily: 'monospace', lineHeight: 1 },
  reflexUnit: { fontSize: 18, color: '#888', marginLeft: 4 },
  reflexRating: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },

  historyWrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  historyTitle: { fontSize: 11, color: '#888', letterSpacing: 2, fontFamily: 'monospace', margin: 0 },
  historyBars: { display: 'flex', gap: 8, alignItems: 'flex-end', height: 68 },
  barWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  bar: { width: 18, borderRadius: 3, transition: 'height 0.3s ease' },
  barLabel: { fontSize: 10, color: '#555', fontFamily: 'monospace' },

  btnRow: { display: 'flex', gap: 12, marginTop: 8 },
  btn: {
    padding: '12px 28px', background: '#00ff88', border: 'none',
    borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 'bold',
    fontFamily: 'monospace', color: '#000', letterSpacing: 1
  }
}