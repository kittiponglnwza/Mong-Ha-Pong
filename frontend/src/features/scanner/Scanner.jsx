import { useCallback, useEffect, useRef, useState } from 'react'
import { FaceDetector, PoseLandmarker, HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

// Upper body pose connections (wrist is endpoint — HandLandmarker takes over from there)
const POSE_CONNECTIONS = [
  { start: 11, end: 12 }, // shoulder ↔ shoulder
  { start: 11, end: 13 }, // left shoulder → elbow
  { start: 12, end: 14 }, // right shoulder → elbow
  { start: 13, end: 15 }, // left elbow → wrist
  { start: 14, end: 16 }, // right elbow → wrist
]
const POSE_INDICES = new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])

// HandLandmarker connections — 21 points per hand
const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],       // thumb
  [0,5],[5,6],[6,7],[7,8],       // index
  [0,9],[9,10],[10,11],[11,12],  // middle
  [0,13],[13,14],[14,15],[15,16],// ring
  [0,17],[17,18],[18,19],[19,20],// pinky
  [5,9],[9,13],[13,17],          // palm
]

function Scanner({ onDone, onBack }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const faceDetectorRef = useRef(null)
  const poseLandmarkerRef = useRef(null)
  const handLandmarkerRef = useRef(null)
  const animFrameRef = useRef(null)
  const [status, setStatus] = useState('กำลังเปิดกล้อง...')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [faceCount, setFaceCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    const initDetectors = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        )
        const [faceDetector, poseLandmarker, handLandmarker] = await Promise.all([
          FaceDetector.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            minDetectionConfidence: 0.5,
          }),
          PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numPoses: 1,
          }),
          HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          }),
        ])
        if (!cancelled) {
          faceDetectorRef.current = faceDetector
          poseLandmarkerRef.current = poseLandmarker
          handLandmarkerRef.current = handLandmarker
        }
      } catch (error) {
        console.error('MediaPipe init error:', error)
      }
    }
    initDetectors()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let activeStream
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        activeStream = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        setStatus('กล้องพร้อมแล้ว')
      })
      .catch(() => setStatus('ไม่สามารถเปิดกล้องได้'))
    return () => {
      activeStream?.getTracks().forEach((t) => t.stop())
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const drawFaceDetections = useCallback((ctx, detections, videoW, videoH) => {
    detections.forEach((detection) => {
      const box = detection.boundingBox
      if (!box) return
      const isNormalized = box.width <= 1 && box.height <= 1
      const rawX = isNormalized ? box.originX * videoW : box.originX
      const rawY = isNormalized ? box.originY * videoH : box.originY
      const rawW = isNormalized ? box.width * videoW : box.width
      const rawH = isNormalized ? box.height * videoH : box.height
      const padX = rawW * 0.2
      const padTop = rawH * 0.35
      const padBottom = rawH * 0.55
      const x = Math.max(0, videoW - rawX - rawW - padX)
      const y = Math.max(0, rawY - padTop)
      const w = Math.min(videoW - x, rawW + padX * 2)
      const h = Math.min(videoH - y, rawH + padTop + padBottom)
      ctx.strokeStyle = '#00ff88'
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, w, h)
      const score = Math.round((detection.categories?.[0]?.score ?? 0) * 100)
      ctx.fillStyle = '#00ff88'
      ctx.font = `bold ${Math.max(14, h * 0.08)}px monospace`
      ctx.fillText(`${score}%`, x + 6, y - 8 > 0 ? y - 8 : y + 18)
      detection.keypoints?.forEach((point) => {
        const pointX = videoW - point.x * videoW
        const pointY = point.y * videoH
        ctx.beginPath()
        ctx.arc(pointX, pointY, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#ffd700'
        ctx.fill()
      })
    })
  }, [])

  const drawPoseLandmarks = useCallback((ctx, landmarks, videoW, videoH) => {
    if (!landmarks || landmarks.length === 0) return
    const pts = landmarks[0]
    ctx.strokeStyle = '#00cfff'
    ctx.lineWidth = 2.5
    POSE_CONNECTIONS.forEach(({ start, end }) => {
      const a = pts[start]
      const b = pts[end]
      if (!a || !b) return
      if ((a.visibility ?? 1) < 0.3 || (b.visibility ?? 1) < 0.3) return
      ctx.beginPath()
      ctx.moveTo((1 - a.x) * videoW, a.y * videoH)
      ctx.lineTo((1 - b.x) * videoW, b.y * videoH)
      ctx.stroke()
    })
    pts.forEach((pt, idx) => {
      if (!POSE_INDICES.has(idx)) return
      if ((pt.visibility ?? 1) < 0.3) return
      const x = (1 - pt.x) * videoW
      const y = pt.y * videoH
      const isJoint = idx >= 11
      ctx.beginPath()
      ctx.arc(x, y, isJoint ? 7 : 5, 0, Math.PI * 2)
      ctx.fillStyle = isJoint ? '#ff6b35' : '#ffd700'
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'
      ctx.lineWidth = 1
      ctx.stroke()
    })
  }, [])

  const drawHandLandmarks = useCallback((ctx, landmarks, handednesses, videoW, videoH) => {
    if (!landmarks || landmarks.length === 0) return
    landmarks.forEach((hand, handIdx) => {
      const isRight = handednesses?.[handIdx]?.[0]?.categoryName === 'Right'
      const lineColor = isRight ? '#ff3cac' : '#a78bfa'
      const dotColor = isRight ? '#ff3cac' : '#c4b5fd'
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 2
      HAND_CONNECTIONS.forEach(([a, b]) => {
        const ptA = hand[a]
        const ptB = hand[b]
        if (!ptA || !ptB) return
        ctx.beginPath()
        ctx.moveTo((1 - ptA.x) * videoW, ptA.y * videoH)
        ctx.lineTo((1 - ptB.x) * videoW, ptB.y * videoH)
        ctx.stroke()
      })
      hand.forEach((pt, idx) => {
        const x = (1 - pt.x) * videoW
        const y = pt.y * videoH
        const isTip = [4, 8, 12, 16, 20].includes(idx)
        ctx.beginPath()
        ctx.arc(x, y, isTip ? 6 : 4, 0, Math.PI * 2)
        ctx.fillStyle = isTip ? '#ffffff' : dotColor
        ctx.fill()
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 1.5
        ctx.stroke()
      })
    })
  }, [])

  const runDetectionLoop = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(runDetectionLoop)
      return
    }
    const videoW = video.videoWidth
    const videoH = video.videoHeight
    canvas.width = videoW
    canvas.height = videoH
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, videoW, videoH)
    const now = performance.now()

    try {
      if (faceDetectorRef.current) {
        const faceResult = faceDetectorRef.current.detectForVideo(video, now)
        const detections = faceResult.detections ?? []
        setFaceCount(detections.length)
        drawFaceDetections(ctx, detections, videoW, videoH)
      }
    } catch { /* frame timestamp catch-up */ }

    try {
      if (poseLandmarkerRef.current) {
        const poseResult = poseLandmarkerRef.current.detectForVideo(video, now)
        drawPoseLandmarks(ctx, poseResult.landmarks, videoW, videoH)
      }
    } catch { /* frame timestamp catch-up */ }

    try {
      if (handLandmarkerRef.current) {
        const handResult = handLandmarkerRef.current.detectForVideo(video, now)
        drawHandLandmarks(ctx, handResult.landmarks, handResult.handednesses, videoW, videoH)
      }
    } catch { /* frame timestamp catch-up */ }

    animFrameRef.current = requestAnimationFrame(runDetectionLoop)
  }, [drawFaceDetections, drawPoseLandmarks, drawHandLandmarks])

  useEffect(() => {
    cancelAnimationFrame(animFrameRef.current)
    runDetectionLoop()
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [runDetectionLoop])

  const captureFrame = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) throw new Error('Camera is not ready')
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Cannot capture camera frame'))),
        'image/jpeg',
        0.92,
      )
    })
  }

  const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Cannot preview camera frame'))
      reader.readAsDataURL(blob)
    })

  const handleScan = async () => {
    if (isAnalyzing) return
    setIsAnalyzing(true)
    setStatus('กำลังวิเคราะห์...')
    try {
      const imageBlob = await captureFrame()
      const scanImageUrl = await blobToDataUrl(imageBlob)
      const response = await fetch('https://mong-ha-pong.onrender.com/analyze/', {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: imageBlob,
      })
      if (!response.ok) throw new Error('Analyze request failed')
      const result = await response.json()
      onDone({ ...result, scanImageUrl })
    } catch (error) {
      console.error(error)
      setStatus('วิเคราะห์ไม่ได้ ลองเช็กว่า backend เปิดอยู่แล้วกดใหม่')
      setIsAnalyzing(false)
    }
  }

  return (
    <section className="scanner-view">
      <header className="scanner-header">
        <button className="ghost-button" onClick={onBack} aria-label="Back to home">
          ←
        </button>
        <div>
          <p className="eyebrow">Live scanner</p>
          <h1>สแกนใบหน้า</h1>
        </div>
      </header>

      <div className="camera-shell">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} className="camera-overlay" />
        <div className="scan-frame" aria-hidden="true" />
      </div>

      <div className="scanner-footer">
        <p className="status-pill">
          <span className="pulse-dot" />
          {faceCount > 0 ? `พบใบหน้า ${faceCount} คน` : status}
        </p>
        <button className="primary-button" onClick={handleScan} disabled={isAnalyzing}>
          {isAnalyzing ? 'กำลังวิเคราะห์...' : 'วิเคราะห์เลย'}
        </button>
      </div>
    </section>
  )
}

export default Scanner