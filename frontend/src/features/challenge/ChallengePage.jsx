import { useState, useEffect, useRef } from 'react'

const API = 'http://localhost:8002'
const JUMPSCARE_ROUND = 2

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

  const frameBufferRef = useRef([])
  const captureLoopRef = useRef(null)

  const photosRef = useRef({
    beginImg: null,
    tooLateImg: null,
    jumpscareImg: null,
  })

  // --- ฟังก์ชันช่วยเหลือ ---
  const getLatestFrame = () => {
    const buf = frameBufferRef.current
    return buf.length > 0 ? buf[buf.length - 1].dataUrl : null
  }

  // --- ฟังก์ชันสรุปผล (แก้ไขจุดส่งข้อมูลทับซ้อนเรียบร้อย) ---
  const finishGame = () => {
    const finalPhotos = [
      photosRef.current.beginImg || getLatestFrame(),
      photosRef.current.tooLateImg || getLatestFrame(),
      photosRef.current.jumpscareImg || getLatestFrame(),
    ]
    console.log('🚀 กำลังส่งรูป 3 ใบไปที่ App:', finalPhotos)
    
    // 💡 ใช้เลนขนส่งหลักเลนเดียว (onJumpscare) ส่งรูปภาพไปแรนเดอร์และวิเคราะห์หลังบ้าน
    onJumpscare(finalPhotos)
  }

  // 🎥 เปิดกล้องและเริ่ม Buffer Loop
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
    hasClickedRef.current = false
    capturedRef.current = false
    
    // 💡 ปรับปรุง: รักษาภาพถ่ายที่เก็บได้จากรอบก่อนๆ ไว้ ไม่ล้างทิ้งให้เป็น null ระหว่างทาง
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

  useEffect(() => { loadClip() }, [])

  // ⏳ countdown
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown === 0) { setPhase('playing'); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // 🎬 จังหวะเริ่มเล่น
  useEffect(() => {
    if (phase === 'playing') {
      videoRef.current?.play()
      setTimeout(() => { 
        // อัปเดตรูปเริ่มเกม (ถ้ายังไม่มีรูปจากรอบแรกๆ ให้เซ็ตลงไป)
        if (!photosRef.current.beginImg) {
          photosRef.current.beginImg = getLatestFrame() 
        }
      }, 400)
    }
  }, [phase])

  const handleTimeUpdate = () => {
    if (!isJumpscare || capturedRef.current) return
    if (videoRef.current?.currentTime >= peekTimeRef.current) {
        capturedRef.current = true
        photosRef.current.jumpscareImg = getLatestFrame()
        finishGame() // จบเกมทันทีเมื่อผีพุ่งชนในรอบ Jumpscare ลาสต์บอส
    }
  }

  const handleVideoEnd = () => {
    if (isJumpscare) {
      if (!capturedRef.current) photosRef.current.jumpscareImg = getLatestFrame()
      finishGame()
    } else {
      if (!hasClickedRef.current) {
        photosRef.current.tooLateImg = getLatestFrame()
        setResultData({ verdict: 'late', diff: 0, stopTime: 0, peekTime: 0 })
        setPhase('result')
      }
    }
  }

  const handleClick = () => {
    if (phase !== 'playing' || isJumpscare || hasClickedRef.current) return
    hasClickedRef.current = true
    videoRef.current?.pause()
    photosRef.current.tooLateImg = getLatestFrame()
    
    setResultData({ verdict: 'perfect', diff: 0, stopTime: 0, peekTime: 0 })
    setPhase('result')
  }

  return (
    <div style={styles.container} onClick={handleClick}>
      <video ref={webcamRef} autoPlay playsInline muted style={styles.hiddenCam} />

      {phase === 'loading' && <div style={styles.overlay}><p style={styles.bigText}>Loading...</p></div>}
      
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

      {phase === 'result' && resultData && (
        <div style={styles.resultOverlay}>
          <p style={styles.verdict}>{resultData.verdict.toUpperCase()}</p>
          <div style={styles.btnRow}>
            {/* 💡 ปรับปุ่ม Next: ถ้ารอบยังไม่ถึงตาผีหลอก ให้โหลดด่านถัดไป แต่ถ้าจบแล้วให้ส่งรูปปิดเกม */}
            {roundRef.current < JUMPSCARE_ROUND ? (
              <button style={styles.btn} onClick={e => { e.stopPropagation(); loadClip() }}>Next →</button>
            ) : (
              <button style={styles.btn} onClick={e => { e.stopPropagation(); finishGame() }}>View Results →</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { position: 'relative', width: '100vw', height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  hiddenCam: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  overlay: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  bigText: { color: '#fff', fontSize: 32 },
  countdownText: { color: '#fff', fontSize: 120, fontWeight: 'bold' },
  video: { width: '100%', height: '100%', objectFit: 'contain' },
  resultOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  verdict: { fontSize: 52, color: '#fff', fontWeight: 'bold' },
  btnRow: { display: 'flex', gap: 12 },
  btn: { padding: '12px 32px', background: '#00ff88', border: 'none', borderRadius: 8, fontSize: 18, cursor: 'pointer' }
}