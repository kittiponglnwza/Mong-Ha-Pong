import { useState, useEffect, useRef } from 'react'

const API = 'http://localhost:8002'
const JUMPSCARE_ROUND = 8

export default function ChallengePage({ onDone, onJumpscare, onBack }) {
  const [phase, setPhase] = useState('loading')
  const [countdown, setCountdown] = useState(3)
  const [clip, setClip] = useState(null)
  const [resultData, setResultData] = useState(null)
  const [isJumpscare, setIsJumpscare] = useState(false)
  const [reflexMs, setReflexMs] = useState(null)
  const [allReflexTimes, setAllReflexTimes] = useState([])
  const [resultImg, setResultImg] = useState(null)

  const videoRef = useRef(null)
  const webcamRef = useRef(null)
  const hasClickedRef = useRef(false)
  const peekTimeRef = useRef(null)
  const roundRef = useRef(0)
  const capturedRef = useRef(false)
  const playStartTimeRef = useRef(null)
  const peekStartTimeRef = useRef(null)

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
    hitSoundRef.current = new Audio('/sounds/hit.mp3')
    missSoundRef.current = new Audio('/sounds/shoot.mp3')
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

  const fetchResultImg = (verdict) => {
    const map = {
      perfect: '/imges/perfect.jpg',
      early:   '/imges/early.jpg',
      late:    '/imges/late.jpg',
    }
    setResultImg(map[verdict] ?? null)
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
    onJumpscare(finalPhotos, allReflexTimes)
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
      playStartTimeRef.current = Date.now()
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
        fetchResultImg('late')
        setPhase('result')
      }
    }
  }

  // ✅ handleClick — แก้แล้ว: เพิ่ม late window หลัง peek
  const handleClick = () => {
    if (phase !== 'playing' || isJumpscare || hasClickedRef.current) return
    hasClickedRef.current = true
    videoRef.current?.pause()
    photosRef.current.tooLateImg = getLatestFrame()

    const peekStarted = peekStartTimeRef.current !== null
    let verdict = 'early' // default

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
      verdict = reflexAfterPeek <= 100 ? 'perfect' : 'late' // ✅ เช็ค window 100ms
      playSound(verdict === 'perfect' ? 'hit' : 'miss')
      setReflexMs(reflexAfterPeek)
      setAllReflexTimes(prev => [...prev, { round: roundRef.current, ms: reflexAfterPeek, verdict }])
      setResultData({ verdict, ms: reflexAfterPeek })
    }

    fetchResultImg(verdict) // ✅ ใช้ verdict เดียวกัน ไม่ต้องเช็ค peekStarted แยก
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

  // 💬 คำด่า/อวย ตาม verdict + rating
  const getRoast = (verdict, ms) => {
    if (verdict === 'early') return [
      'คนอยู่ดีไหนวะกูยังไม่เห็นเลย',
      'crosshair มึงกลัวผีหรอ ยิงมั่วชิบหาย',
      'สมองยังไม่สั่ง แต่นิ้วลั่นไปละ ',
      'ไฟดูดนิ้วหรือไงวะ ยิงก่อน peek อีกแล้ว',
      'ศัตรูยังไม่ peek แต่มึง panic ไปก่อนละ',
      'เสียงปืนดัง แต่ rank ไม่ขยับเลยนะ',
      'คนดูคิดว่าเน็ตกระตุก ไม่ใช่มึงกาก'
    ][Math.floor(Math.random() * 8)]
    if (verdict === 'late') return [
      'reaction time แบบนี้ไปมายคราฟเหอะ',
      'ศัตรูฆ่ามึงเสร็จ เดินกลับบ้านยังยิงไม่ทัน',
      'reflex มึงโหลดช้ากว่าเกมอีก',
      'ยายกด ATM ยังไวกว่า',
      'กูเห็นอนาคตมึงละ bottom frag แน่นอน',
      'มึงไม่ได้ช้า… มึง AFK ทางสมอง',
      'มันจะเดินมาหอมแก้มมึงแล้วเนี่ยะ',
      'ศัตรู reload เสร็จสองแม็ก มึงยังไม่ยิง'
    ][Math.floor(Math.random() * 8)]
    if (ms < 180) return [
      'ไวชิบหาย 🔥 pro player ยังสะดุ้ง',
      'reaction แบบนี้ smurf แน่นอน',
      'aim เข้าเส้นประสาทเลยว่ะ',
      'มึงยิงเร็วจน anti-cheat จะเรียกคุย',
      'crosshair ดูดหัวเกินมนุษย์'
    ][Math.floor(Math.random() * 5)]
    if (ms < 300) return [
      'เก่งแค่ในเกมแหละ ตัวจริงนั่งอ้วนหน้าคอม',
      'aim ดี แต่ ego อย่าเยอะ',
      'เริ่มเหมือนคนมีแรงค์ละ'
    ][Math.floor(Math.random() * 5)]
    if (ms < 450) return [
      'average ranked demon 🐀',
      'ไม่เร็วไม่ช้า แต่ดูไม่มีอนาคต',
      'เล่นได้ แต่ยังไม่ถึงกับคนดูว้าว',
      'สปีดประมาณคน Rank Gold',
      'อย่างน้อยก็ยังเร็วกว่าคนใช้ touchpad'
    ][Math.floor(Math.random() * 5)]
    return [
      'กว่าจะยิงได้ ศัตรูมีลูกมีเมียละ 💀',
      'reaction time หรือรอ Windows update อยู่',
      'มึงคือเหตุผลที่ทีม mute voice',
      'ถ้าช้ากว่านี้คือ replay แล้วนะ',
      'กดช้าจนปืนคิดว่ามึงไม่รักมัน',
      'crosshair อยู่หัว แต่สมองอยู่ไหน',
      'ยิงแบบนี้ bot ยังขำ',
      'ถ้า aim แย่เป็นอาชญากรรม มึงติดคุกตลอดชีวิต'
    ][Math.floor(Math.random() * 8)]
  }

  const [showStat, setShowStat] = useState(true)
  const roastText = resultData ? getRoast(resultData.verdict, resultData.ms) : ''

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
          src={clip.url ?? `${API}/clips/${clip.filename}`}
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
        <div style={styles.resultOverlay} onClick={e => e.stopPropagation()}>
          <div style={styles.resultCard}>

            {resultImg && (
              <img
                src={resultImg}
                alt="result"
                style={styles.reactionPhoto}
              />
            )}

            <p style={{
              ...styles.verdict,
              color: resultData.verdict === 'perfect' ? '#00ff88'
                   : resultData.verdict === 'early'   ? '#ffaa00'
                   : '#ff4444'
            }}>
              {resultData.verdict === 'perfect' ? ' PERFECT'
             : resultData.verdict === 'early'   ? ' TOO EARLY'
             : ' TOO LATE'}
            </p>

            <p style={styles.roastText}>"{roastText}"</p>

            {/* reflex time — แสดงเฉพาะตอน perfect */}
            {resultData.verdict === 'perfect' && resultData.ms != null && (
              <div style={styles.reflexRow}>
                <span style={styles.reflexMs}>{resultData.ms}</span>
                <span style={styles.reflexUnit}>ms</span>
                <span style={{
                  ...styles.reflexBadge,
                  background: resultData.ms < 200 ? 'rgba(255,68,68,0.15)'
                            : resultData.ms < 350 ? 'rgba(255,153,0,0.15)'
                            : 'rgba(0,255,136,0.12)',
                  color: resultData.ms < 200 ? '#ff4444'
                       : resultData.ms < 350 ? '#ff9900'
                       : '#00ff88',
                }}>
                  {getReflexRating(resultData.ms).label}
                </span>
              </div>
            )}

            {/* reflex time — แสดงตอน late ด้วย */}
            {resultData.verdict === 'late' && resultData.ms != null && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ ...styles.reflexBadge, background: 'rgba(255,68,68,0.15)', color: '#ff4444' }}>
                  TOO SLOW
                </span>
                <div style={styles.reflexRow}>
                  <span style={styles.reflexMs}>{resultData.ms}</span>
                  <span style={styles.reflexUnit}>ms</span>
                </div>
              </div>
            )}

            <div style={styles.btnRow}>
              {roundRef.current < JUMPSCARE_ROUND ? (
                <button style={styles.btn} onClick={e => { e.stopPropagation(); loadClip() }}>
                  Next Round 
                </button>
              ) : (
                <button style={styles.btn} onClick={e => { e.stopPropagation(); finishGame() }}>
                  View Results 
                </button>
              )}
            </div>

            {/* STAT panel */}
            {showStat && (
              <div style={styles.statPanel}>
                <div style={styles.statGrid}>
                  <div style={styles.statBox}>
                    <span style={styles.statLabel}>ROUND</span>
                    <span style={styles.statVal}>{roundRef.current}/{totalRounds}</span>
                  </div>
                  <div style={styles.statBox}>
                    <span style={styles.statLabel}>AVG REFLEX</span>
                    <span style={styles.statVal}>{avgReflex !== null ? `${avgReflex}ms` : '—'}</span>
                  </div>
                  <div style={styles.statBox}>
                    <span style={styles.statLabel}>PERFECT</span>
                    <span style={{...styles.statVal, color: '#00ff88'}}>
                      {allReflexTimes.filter(r => r.verdict === 'perfect').length}
                    </span>
                  </div>
                  <div style={styles.statBox}>
                    <span style={styles.statLabel}>MISS</span>
                    <span style={{...styles.statVal, color: '#ff4444'}}>
                      {allReflexTimes.filter(r => r.verdict !== 'perfect').length}
                    </span>
                  </div>
                </div>

                {allReflexTimes.length > 0 && (
                  <div style={styles.historyBars}>
                    {allReflexTimes.map((r, i) => {
                      const maxMs = Math.max(...allReflexTimes.filter(x=>x.ms).map(x => x.ms), 800)
                      const h = r.ms ? Math.max(4, Math.round((r.ms / maxMs) * 56)) : 4
                      return (
                        <div key={i} style={styles.barWrap}>
                          <span style={{...styles.barMs, color: r.verdict==='perfect'?'#00ff88':r.verdict==='early'?'#ffaa00':'#ff4444'}}>
                            {r.ms ? `${r.ms}` : '—'}
                          </span>
                          <div style={{
                            ...styles.bar, height: h,
                            background: r.verdict === 'perfect' ? '#00ff88'
                                      : r.verdict === 'early'   ? '#ffaa00' : '#ff4444'
                          }} />
                          <span style={styles.barLabel}>R{r.round}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
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
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.82)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 20,
  },
  resultCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 16, maxWidth: 480, width: '90%', textAlign: 'center',
  },
  reactionPhoto: {
    width: 180, height: 180, objectFit: 'cover',
    borderRadius: 16,
    mixBlendMode: 'luminosity',
    opacity: 0.95,
  },
  verdict: {
    fontSize: 48, fontWeight: 'bold', margin: 0,
    fontFamily: 'monospace', letterSpacing: 2,
  },
  roastText: {
    fontSize: 18, color: 'rgba(255,255,255,0.65)',
    fontStyle: 'italic', margin: 0,
    fontFamily: 'sans-serif',
  },
  reflexRow: {
    display: 'flex', alignItems: 'baseline', gap: 8,
  },
  reflexMs: {
    fontSize: 52, color: '#fff', fontWeight: 'bold',
    fontFamily: 'monospace', lineHeight: 1,
  },
  reflexUnit: { fontSize: 20, color: '#888', fontFamily: 'monospace' },
  reflexBadge: {
    fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace',
    padding: '4px 12px', borderRadius: 6, letterSpacing: 1,
  },
  btnRow: { display: 'flex', gap: 10, marginTop: 4 },
  btnStat: {
    padding: '10px 22px', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
    fontSize: 14, cursor: 'pointer', color: '#fff', fontFamily: 'monospace',
  },
  btn: {
    padding: '10px 26px', background: '#00ff88', border: 'none',
    borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 'bold',
    fontFamily: 'monospace', color: '#000', letterSpacing: 1,
  },
  statPanel: {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 },
  statBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 4px',
  },
  statLabel: { fontSize: 9, color: '#666', letterSpacing: 2, fontFamily: 'monospace' },
  statVal: { fontSize: 20, color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' },
  historyBars: { display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: 'center', height: 80 },
  barWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 },
  bar: { width: 20, borderRadius: 3 },
  barMs: { fontSize: 9, fontFamily: 'monospace' },
  barLabel: { fontSize: 9, color: '#555', fontFamily: 'monospace' },
}