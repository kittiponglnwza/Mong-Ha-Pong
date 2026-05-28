import { useEffect, useState } from 'react'
import bgImage from '../assets/Ascent.webp'

const instructions = [
  'Click targets immediately after they appear',
  'Faster reactions increase your final score',
  'Missing targets reduces stability accuracy',
  'Keep your face inside camera view',
  'Avoid looking away during calibration',
  'Fullscreen mode is strongly recommended',
]

export default function HowToPlay({ onBegin, onBack }) {
  const [visible, setVisible] = useState(false)
  const [camStatus, setCamStatus] = useState('Requesting...')
  const [camColor, setCamColor] = useState('text-yellow-400')
  const [camDot, setCamDot] = useState('bg-yellow-400')

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop())
        setCamStatus('Connected')
        setCamColor('text-green-400')
        setCamDot('bg-green-400')
      })
      .catch(() => {
        setCamStatus('Denied')
        setCamColor('text-red-400')
        setCamDot('bg-red-400')
      })

    return () => clearTimeout(t)
  }, [])

  const status = [
    { label: 'Camera', value: camStatus, color: camColor, dot: camDot },
    { label: 'Eye Tracking', value: 'Active', color: 'text-green-400', dot: 'bg-green-400' },
    { label: 'Latency Sync', value: 'Stable', color: 'text-green-400', dot: 'bg-green-400' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap');
        .cinzel { font-family: 'Cinzel', serif; }
        .fade-in {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-in.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div
        className="cinzel relative h-screen w-screen overflow-hidden flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className={`relative z-10 flex flex-col h-full px-16 py-12 fade-in${visible ? ' show' : ''}`}>

          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400 mb-3">— How to play</p>
            <h1 className="text-4xl font-semibold tracking-wide text-white mb-3 leading-tight">
              Reflex Calibration
            </h1>
            <p className="text-sm text-gray-400 tracking-widest leading-loose mb-8">
              Your reaction speed and visual focus are about to be tested.
            </p>

            <p className="text-xs uppercase tracking-[0.25em] text-blue-400 mb-4">Instructions</p>
            <ul className="flex flex-col gap-2 mb-8">
              {instructions.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 tracking-wide leading-relaxed">
                  <span className="text-blue-400 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs uppercase tracking-[0.25em] text-blue-400 mb-4">System Status</p>
            <div className="flex flex-col gap-2">
              {status.map((s, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-sm text-gray-400 tracking-wide">{s.label}</span>
                  <span className={`flex items-center gap-2 text-sm tracking-wide ${s.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${s.dot}`} />
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {camStatus === 'Denied' && (
              <p className="mt-4 text-xs text-red-400 tracking-wide leading-relaxed">
                Camera access was denied. Please allow camera permission in your browser settings and reload.
              </p>
            )}
          </div>

          <div className="flex gap-4 justify-end pb-2">
            <button
              onClick={onBack}
              className="px-6 py-3 text-gray-400 text-sm uppercase tracking-wide hover:text-white hover:bg-white/10 rounded transition-all duration-200"
            >
              ← Back
            </button>
            <button
              onClick={onBegin}
              disabled={camStatus !== 'Connected'}
              className="px-8 py-3 bg-blue-600/80 hover:bg-blue-500/90 border border-blue-400/50 rounded text-white text-sm font-semibold uppercase tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ▶ Begin
            </button>
          </div>

        </div>
      </div>
    </>
  )
}