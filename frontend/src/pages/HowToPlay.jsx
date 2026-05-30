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

// ── Deterministic pseudo-random (stable across renders) ──
const r = (seed) => { const x = Math.sin(seed) * 10000; return x - Math.floor(x) }

// ── Snow particles: 55 flakes, already "in flight" via negative delay ──
const SNOW = Array.from({ length: 55 }, (_, i) => {
  const b = i * 13.7
  return {
    left:    r(b)     * 100,           // 0–100% across screen
    size:    r(b + 1) * 3.5 + 0.8,    // 0.8–4.3px
    dur:     r(b + 2) * 10 + 9,       // 9–19s fall speed
    delay:  -(r(b + 3) * 16),         // already mid-fall on load
    opacity: r(b + 4) * 0.4 + 0.12,   // 0.12–0.52 (soft)
    blur:    r(b + 5) > 0.68,         // 32% get slight blur (depth)
    s1:      r(b + 6) * 50 - 25,      // sway at 30% keyframe
    s2:      r(b + 7) * 50 - 25,      // sway at 65% keyframe
    s3:      r(b + 8) * 24 - 12,      // sway at 100% keyframe
  }
})

// ── Blue rising ambient particles ──
const PARTICLES = [
  { left: 18, bottom: 12, dur: 7,   delay: 0,   size: 2 },
  { left: 32, bottom: 22, dur: 9,   delay: 1.2, size: 1.5 },
  { left: 47, bottom: 8,  dur: 6.5, delay: 2.5, size: 2 },
  { left: 61, bottom: 18, dur: 8,   delay: 0.7, size: 1.5 },
  { left: 74, bottom: 28, dur: 10,  delay: 3.1, size: 2 },
  { left: 85, bottom: 10, dur: 7.5, delay: 1.8, size: 1.5 },
  { left: 25, bottom: 35, dur: 11,  delay: 4,   size: 1 },
  { left: 55, bottom: 30, dur: 8.5, delay: 2,   size: 1 },
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

        /* ── Background: slow Ken Burns zoom + drift ── */
        @keyframes kenBurns {
          0%   { transform: scale(1)    translate(0%,    0%);   }
          33%  { transform: scale(1.07) translate(-1%,   0.5%); }
          66%  { transform: scale(1.05) translate(0.8%, -0.8%); }
          100% { transform: scale(1)    translate(0%,    0%);   }
        }
        .bg-ken-burns {
          animation: kenBurns 24s ease-in-out infinite;
          transform-origin: center center;
          will-change: transform;
        }

        /* ── Scanline: single thin bar sweeping top → bottom ── */
        @keyframes scanline {
          0%   { top: -6px;  opacity: 0; }
          5%   {             opacity: 0.12; }
          95%  {             opacity: 0.08; }
          100% { top: 100%;  opacity: 0; }
        }
        .scanline {
          position: absolute;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: 3;
        }

        /* ── Vignette pulse ── */
        @keyframes vignettePulse {
          0%, 100% { opacity: 0.75; }
          50%       { opacity: 0.82; }
        }
        .vignette {
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%);
          animation: vignettePulse 6s ease-in-out infinite;
        }

        /* ── Floating particles ── */
        @keyframes floatUp {
          0%   { transform: translate(0, 0) scale(1);   opacity: 0;   }
          8%   {                                         opacity: 0.7; }
          88%  {                                         opacity: 0.4; }
          100% { transform: translate(var(--dx), -130px) scale(0.3); opacity: 0; }
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(96, 165, 250, 0.85);
          pointer-events: none;
          z-index: 2;
          animation: floatUp var(--dur) ease-out var(--delay) infinite;
        }

        /* ── Snow particles: fall + sway ── */
        @keyframes snowFall {
          0%   { transform: translateY(-20px) translateX(0px);        opacity: 0; }
          5%   {                                                        opacity: var(--snow-op); }
          30%  { transform: translateY(30vh)  translateX(var(--s1));  }
          65%  { transform: translateY(65vh)  translateX(var(--s2));  }
          95%  {                                                        opacity: var(--snow-op); }
          100% { transform: translateY(108vh) translateX(var(--s3));  opacity: 0; }
        }
        .snowflake {
          position: absolute;
          top: 0;
          border-radius: 50%;
          background: rgba(220, 235, 255, 0.9);
          pointer-events: none;
          z-index: 2;
          animation: snowFall var(--fall-dur) linear var(--fall-delay) infinite;
          will-change: transform;
        }

        /* ── Fade-in for content ── */
        .fade-in {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-in.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Buttons ── */
        .btn-primary {
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          background: #dc2626;
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
          background: #ef4444;
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
          filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.6));
          transition: filter 0.2s;
        }
        .btn-primary-wrap:not(:has(button:disabled)):hover {
          filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.9));
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

      <div className="cinzel relative h-screen w-screen overflow-hidden flex flex-col">

        {/* ── Animated background image ── */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-ken-burns"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* ── Dark base overlay ── */}
        <div className="absolute inset-0 bg-black/55" />

        {/* ── Vignette ── */}
        <div className="absolute inset-0 vignette" />

        {/* ── Scanline sweep ── */}
        <div className="scanline" />

        {/* ── Snow particles ── */}
        {SNOW.map((s, i) => (
          <div
            key={`snow-${i}`}
            className="snowflake"
            style={{
              left:   `${s.left}%`,
              width:  `${s.size}px`,
              height: `${s.size}px`,
              filter: s.blur ? 'blur(0.8px)' : 'none',
              '--snow-op':    s.opacity,
              '--fall-dur':  `${s.dur}s`,
              '--fall-delay':`${s.delay}s`,
              '--s1': `${s.s1}px`,
              '--s2': `${s.s2}px`,
              '--s3': `${s.s3}px`,
            }}
          />
        ))}

        {/* ── Floating particles ── */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left:   `${p.left}%`,
              bottom: `${p.bottom}%`,
              width:  `${p.size}px`,
              height: `${p.size}px`,
              '--dur':   `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--dx':    `${(Math.random() - 0.5) * 40}px`,
            }}
          />
        ))}

        {/* ── Content ── */}
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
                 Start
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}