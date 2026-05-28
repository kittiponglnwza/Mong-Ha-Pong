import { useState, useEffect, useRef } from 'react'

const API = 'http://localhost:8002'
const JUMPSCARE_ROUND = 1

export default function ChallengePage({ onDone, onJumpscare, onBack }) {
  const [phase, setPhase] = useState('loading')
  const [countdown, setCountdown] = useState(3)
  const [clip, setClip] = useState(null)
  const [resultData, setResultData] = useState(null)
  const [isJumpscare, setIsJumpscare] = useState(false)
  const videoRef = useRef(null)
  const webcamRef = useRef(null)
  const hasClickedRef = useRef(false)
  const peekTimeRef = useRef(null)
  const roundRef = useRef(0)
  const capturedRef = useRef(false)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        if (webcamRef.current) webcamRef.current.srcObject = stream
      })
      .catch(err => console.error('webcam error', err))
    return () => {
      webcamRef.current?.srcObject?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const loadClip = () => {
    roundRef.current += 1
    const isJump = roundRef.current >= JUMPSCARE_ROUND
    setIsJumpscare(isJump)
    setPhase('loading')
    setCountdown(3)
    setClip(null)
    setResultData(null)
    hasClickedRef.current = false
    capturedRef.current = false

    const url = isJump
      ? `${API}/api/clips/jumpscare/random`
      : `${API}/api/clips/random`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setClip(data)
        peekTimeRef.current = data.peekTime ?? null
        setPhase('countdown')
      })
  }

  useEffect(() => { loadClip() }, [])

  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown === 0) { setPhase('playing'); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  useEffect(() => {
    if (phase !== 'playing') return
    hasClickedRef.current = false
    videoRef.current?.play()
  }, [phase])

  const captureAndSend = (callback) => {
    const webcam = webcamRef.current

    if (!webcam || webcam.videoWidth === 0 || webcam.videoHeight === 0) {
      console.warn('webcam not ready')
      callback(null)
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = webcam.videoWidth
    canvas.height = webcam.videoHeight
    canvas.getContext('2d').drawImage(webcam, 0, 0)

    canvas.toBlob(blob => {
      if (!blob) { callback(null); return }
      const reader = new FileReader()
      reader.onload = () => callback(reader.result)
      reader.onerror = () => callback(null)
      reader.readAsDataURL(blob)
    }, 'image/jpeg', 0.92)
  }

  const handleTimeUpdate = () => {
    if (!isJumpscare) return
    if (capturedRef.current) return
    const peek = peekTimeRef.current
    if (peek === null) return
    if (videoRef.current?.currentTime >= peek) {
      capturedRef.current = true
      setTimeout(() => {
        captureAndSend((imageUrl) => {
          onJumpscare(imageUrl) // ส่งรูปให้ App.jsx → navigate ไปหน้า result ทันที
        })
      }, 400)
    }
  }

  const handleVideoEnd = () => {
    if (isJumpscare) {
      if (!capturedRef.current) {
        // ยังไม่ได้ถ่ายเลย (peekTime ไม่ถูก trigger) → ถ่ายตอนจบ
        capturedRef.current = true
        captureAndSend((imageUrl) => {
          onJumpscare(imageUrl)
        })
      }
      // ถ้าถ่ายไปแล้ว onJumpscare ถูกเรียกใน handleTimeUpdate แล้ว ไม่ต้องทำอะไรเพิ่ม
      return
    }

    // normal round
    if (hasClickedRef.current) return
    hasClickedRef.current = true
    const peek = peekTimeRef.current
    const diff = (videoRef.current?.duration ?? peek) - peek
    setResultData({
      diff: Math.round(diff * 1000),
      absDiff: Math.round(Math.abs(diff) * 1000),
      verdict: 'late',
      stopTime: videoRef.current?.duration,
      peekTime: peek,
    })
    setPhase('result')
  }

  const handleClick = () => {
    if (phase !== 'playing') return
    if (isJumpscare) return
    if (hasClickedRef.current) return
    hasClickedRef.current = true

    new Audio('/sounds/shoot.mp3').play()
    videoRef.current?.pause()
    const stopTime = videoRef.current?.currentTime ?? 0
    const peek = peekTimeRef.current
    const diff = stopTime - peek
    const absDiff = Math.abs(diff)

    let verdict
    if (diff < -0.05) verdict = 'early'
    else if (absDiff <= 0.15) verdict = 'perfect'
    else verdict = 'late'

    if (verdict === 'perfect') new Audio('/sounds/hit.mp3').play()

    setResultData({
      diff: Math.round(diff * 1000),
      absDiff: Math.round(absDiff * 1000),
      verdict,
      stopTime,
      peekTime: peek,
    })
    setPhase('result')
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#000',
        cursor: phase === 'playing' && !isJumpscare ? 'none' : 'default',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={handleClick}
    >
      {/* กล้องซ่อน */}
      <video
        ref={webcamRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {phase === 'loading' && (
        <div style={styles.overlay}>
          <p style={styles.bigText}>Loading...</p>
        </div>
      )}

      {phase === 'countdown' && (
        <div style={styles.overlay}>
          <p style={styles.countdownText}>{countdown === 0 ? 'GO!' : countdown}</p>
          <p style={styles.hint}>Click anywhere when you see the enemy</p>
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

      {phase === 'playing' && !isJumpscare && (
        <div style={styles.crosshair}>
          <div style={styles.crosshairH} />
          <div style={styles.crosshairV} />
        </div>
      )}

      {phase === 'result' && resultData && (
        <div style={styles.resultOverlay}>
          <p style={{ ...styles.verdict, color: resultData.verdict === 'perfect' ? '#00ff88' : resultData.verdict === 'early' ? '#ff4444' : '#ffaa00' }}>
            {resultData.verdict === 'perfect' && '✅ PERFECT'}
            {resultData.verdict === 'early' && '⚡ TOO EARLY'}
            {resultData.verdict === 'late' && '🐢 TOO LATE'}
          </p>
          <p style={styles.diffText}>{resultData.diff > 0 ? '+' : ''}{resultData.diff} ms</p>
          <div style={styles.btnRow}>
            <button style={styles.btnAgain} onClick={e => { e.stopPropagation(); loadClip() }}>🔄 Again</button>
            <button style={styles.btn} onClick={e => { e.stopPropagation(); onDone(resultData) }}>Next →</button>
            <button style={styles.btnGhost} onClick={e => { e.stopPropagation(); onBack() }}>Back</button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  overlay: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  bigText: { color: '#fff', fontSize: 32 },
  countdownText: { color: '#fff', fontSize: 120, fontWeight: 'bold', fontFamily: 'monospace', lineHeight: 1 },
  hint: { color: '#888', fontSize: 18 },
  video: { width: '100%', height: '100%', objectFit: 'contain' },
  crosshair: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 10 },
  crosshairH: { position: 'absolute', width: 20, height: 2, background: '#fff', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  crosshairV: { position: 'absolute', width: 2, height: 20, background: '#fff', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  resultOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  verdict: { fontSize: 52, fontWeight: 'bold', margin: 0 },
  diffText: { color: '#fff', fontSize: 32, fontFamily: 'monospace' },
  btnRow: { display: 'flex', gap: 12, marginTop: 24 },
  btnAgain: { padding: '12px 32px', background: '#4488ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 18, fontWeight: 'bold', cursor: 'pointer' },
  btn: { padding: '12px 32px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 8, fontSize: 18, fontWeight: 'bold', cursor: 'pointer' },
  btnGhost: { padding: '12px 32px', background: 'transparent', color: '#fff', border: '1px solid #555', borderRadius: 8, fontSize: 18, cursor: 'pointer' },
}