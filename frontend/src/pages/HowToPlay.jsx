import { useEffect, useState } from 'react'
import bgImage from '../assets/Ascent.webp'

const instructions = [
  'Click the target before your brain starts buffering',
  'Slow reactions expose low-tier reflex genetics',
  'Missing shots decrease combat stability rating',
  'Keep your face visible for neural tracking',
  'Looking away may indicate a fear response',
  'Wear headphones and max the volume to hear every footstep clearly',
  'Fullscreen mode recommended for maximum humiliation',
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

        .btn-primary {
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          background: #2563eb;
          color: white;
          font-family: 'Cinzel', serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
          padding: 13px 40px;
          border: none;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .btn-primary:hover:not(:disabled) {
          background: #3b82f6;
          transform: translateY(-1px);
        }
        .btn-primary:active:not(:disabled) {
          transform: scale(0.97);
        }
        .btn-primary:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .btn-primary-wrap {
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.55));
          transition: filter 0.2s;
        }
        .btn-primary-wrap:not(:has(button:disabled)):hover {
          filter: drop-shadow(0 0 18px rgba(96, 165, 250, 0.85));
        }

        .btn-secondary {
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          background: rgba(255, 255, 255, 0.05);
          color: #9ca3af;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 0.75rem;
          padding: 13px 32px;
          border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          transform: translateY(-1px);
        }
        .btn-secondary:active {
          transform: scale(0.97);
        }
      `}</style>

      <div
        className="cinzel relative h-screen w-screen overflow-hidden flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className={`relative z-10 flex flex-col h-full px-16 py-12 fade-in${visible ? ' show' : ''}`}>

          <div className="flex-1 flex flex-col justify-center max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400 mb-3">— How to play</p>
            <h1 className="text-4xl font-semibold tracking-wide text-white mb-3 leading-tight">
              Reflex Calibration
            </h1>
            <p className="text-sm text-gray-400 tracking-widest leading-loose mb-8">
              Most players think they have good aim. This test exists to humble them.
            </p>

            <p className="text-xs uppercase tracking-[0.25em] text-blue-400 mb-4">Instructions</p>
            <ul className="flex flex-col gap-2 mb-8">
              {instructions.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 tracking-wide leading-relaxed">
                  <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
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
            <button onClick={onBack} className="btn-secondary">
              ← Back
            </button>
            <div className="btn-primary-wrap">
              <button
                onClick={onBegin}
                disabled={camStatus !== 'Connected'}
                className="btn-primary"
              >
                ▶ Start
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}