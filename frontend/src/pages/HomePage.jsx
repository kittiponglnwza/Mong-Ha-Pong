import { useState, useEffect, useRef } from 'react';
import bgImage from '../assets/main.png';

const VOLUMETRIC_BEAMS = [
  { left: '15%', delay: 0, duration: 8, opacity: 0.06 },
  { left: '28%', delay: 2.5, duration: 11, opacity: 0.04 },
  { left: '42%', delay: 1, duration: 9, opacity: 0.08 },
  { left: '58%', delay: 3.5, duration: 10, opacity: 0.05 },
  { left: '72%', delay: 0.5, duration: 12, opacity: 0.07 },
];

const DUST_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 5.5) % 90}%`,
  top: `${10 + (i * 7.3) % 80}%`,
  size: 1.5 + (i % 3) * 1.2,
  delay: (i * 0.7) % 6,
  duration: 12 + (i % 5) * 3,
  driftX: ((i % 7) - 3) * 18,
  driftY: -20 - (i % 4) * 12,
  blur: i % 4 === 0 ? 1 : 0,
}));

const ENERGY_STREAKS = [
  { top: '22%', delay: 0, duration: 5, width: '35%', left: '5%' },
  { top: '48%', delay: 2, duration: 7, width: '20%', left: '60%' },
  { top: '68%', delay: 1, duration: 6, width: '28%', left: '20%' },
];

export default function HomePage({ onPlay, onAbout }) {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const lightX = mouse.x * 100;
  const lightY = mouse.y * 100;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ fontFamily: "'Rajdhani', 'Barlow Condensed', 'Arial Narrow', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow+Condensed:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes cinematic-zoom {
          0% { transform: scale(1.08); }
          100% { transform: scale(1.0); }
        }
        @keyframes beam-pulse {
          0%, 100% { opacity: var(--beam-op, 0.05); transform: scaleX(1); }
          50% { opacity: calc(var(--beam-op, 0.05) * 2.2); transform: scaleX(1.04); }
        }
        @keyframes dust-drift {
          0% { transform: translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 0.7; }
          100% { transform: translate(var(--dx, 20px), var(--dy, -30px)); opacity: 0; }
        }
        @keyframes streak-slide {
          0% { transform: translateX(-120%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.6; }
          100% { transform: translateX(320%); opacity: 0; }
        }
        @keyframes glow-battle {
          0%, 100% {
            text-shadow:
              0 0 30px rgba(0,210,255,0.55),
              0 0 60px rgba(0,210,255,0.3),
              0 0 100px rgba(0,180,255,0.15);
          }
          50% {
            text-shadow:
              0 0 50px rgba(0,220,255,0.75),
              0 0 90px rgba(0,200,255,0.45),
              0 0 140px rgba(0,180,255,0.25);
          }
        }
        @keyframes shimmer-title {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes border-sweep {
          0% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0% 0 0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes label-in {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scanline-move {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes bottom-bar-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
        @keyframes orb-breathe {
          0%, 100% { transform: scale(1); opacity: 0.18; }
          50% { transform: scale(1.15); opacity: 0.28; }
        }
        @keyframes play-btn-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .play-btn {
          position: relative;
          padding: 14px 40px;
          background: linear-gradient(135deg, rgba(220,40,40,0.85) 0%, rgba(255,80,20,0.7) 100%);
          border: none;
          border-radius: 2px;
          color: #fff;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 0 24px rgba(220,50,20,0.45), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .play-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 2px;
          background: linear-gradient(90deg, rgba(255,80,20,0.9), rgba(255,180,50,0.8), rgba(255,80,20,0.9));
          background-size: 200% 200%;
          animation: play-btn-border 3s linear infinite;
          z-index: 0;
          padding: 1px;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
        }
        .play-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .play-btn:hover::after {
          transform: translateX(100%);
        }
        .play-btn:hover {
          transform: translateX(6px) scale(1.03);
          box-shadow: 0 0 50px rgba(220,50,20,0.7), 0 0 90px rgba(255,80,20,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .play-btn span { position: relative; z-index: 1; }

        .about-btn {
          position: relative;
          padding: 11px 32px;
          background: transparent;
          border: none;
          border-left: 2px solid rgba(0,210,255,0.4);
          border-radius: 0;
          color: rgba(180,220,240,0.75);
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .about-btn::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 0%;
          height: 100%;
          background: rgba(0,210,255,0.07);
          transition: width 0.35s ease;
        }
        .about-btn::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 0%;
          background: rgba(0,210,255,1);
          box-shadow: 0 0 12px rgba(0,210,255,0.8);
          transition: height 0.35s ease;
        }
        .about-btn:hover {
          border-left-color: rgba(0,210,255,0.15);
          color: #fff;
          padding-left: 40px;
        }
        .about-btn:hover::before { width: 100%; }
        .about-btn:hover::after { height: 100%; }
        .about-btn span { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; }
        .about-btn .arrow {
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          font-size: 16px;
          color: rgba(0,210,255,0.9);
        }
        .about-btn:hover .arrow { opacity: 1; transform: translateX(0); }

        .content-wrap { animation: fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both; }
        .label-anim { animation: label-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both; }
        .title-anim { animation: fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both; }
        .nav-anim { animation: fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both; }
        .footer-anim { animation: fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both; }
      `}</style>

      {/* ── LAYER 1: Background Image with cinematic zoom (FIXED) ── */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          animation: 'cinematic-zoom 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          willChange: 'transform',
        }}
      >
        <div
          className="absolute inset-[-4%]"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
      </div>

      {/* ── LAYER 2: Minimal cinematic grade ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, rgba(2,8,18,0.82) 0%, rgba(2,8,18,0.45) 50%, rgba(2,8,18,0.12) 100%),
            linear-gradient(to bottom, rgba(2,8,18,0.3) 0%, transparent 35%, transparent 65%, rgba(2,8,18,0.5) 100%)
          `,
        }}
      />

      {/* ── LAYER 3: Reactive mouse spotlight ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 55% at ${lightX}% ${lightY}%, rgba(0,160,255,0.06) 0%, transparent 70%)`,
          transition: 'background 0.08s linear',
        }}
      />

      {/* ── LAYER 4: Blue ambient character glow ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '8%',
          top: '20%',
          width: '42%',
          height: '65%',
          background: 'radial-gradient(ellipse at center, rgba(0,160,255,0.12) 0%, rgba(0,80,180,0.05) 50%, transparent 80%)',
          animation: 'orb-breathe 6s ease-in-out infinite',
          willChange: 'transform, opacity',
        }}
      />

      {/* ── LAYER 5: Volumetric light beams ── */}
      {VOLUMETRIC_BEAMS.map((beam, i) => (
        <div
          key={i}
          className="absolute top-0 h-full pointer-events-none"
          style={{
            left: beam.left,
            width: '1px',
            background: `linear-gradient(to bottom, transparent 0%, rgba(0,200,255,${beam.opacity * 1.5}) 20%, rgba(0,160,255,${beam.opacity}) 60%, transparent 100%)`,
            '--beam-op': beam.opacity,
            animation: `beam-pulse ${beam.duration}s ease-in-out ${beam.delay}s infinite`,
            willChange: 'opacity',
          }}
        />
      ))}

      {/* ── LAYER 6: Dust/fog particles ── */}
      {DUST_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'rgba(160,220,255,0.7)',
            filter: p.blur ? `blur(${p.blur}px)` : 'none',
            '--dx': `${p.driftX}px`,
            '--dy': `${p.driftY}px`,
            animation: `dust-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* ── LAYER 7: Energy streaks ── */}
      {ENERGY_STREAKS.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none overflow-hidden"
          style={{
            top: s.top,
            left: s.left,
            width: s.width,
            height: '1px',
            animation: `streak-slide ${s.duration}s ease-in-out ${s.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        >
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(0,210,255,0.6), rgba(120,220,255,0.9), transparent)',
            }}
          />
        </div>
      ))}

      {/* ── LAYER 8: Subtle scanline ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: 0.018 }}
      >
        <div
          style={{
            width: '100%',
            height: '3px',
            background: 'rgba(0,210,255,0.8)',
            animation: 'scanline-move 8s linear infinite',
            willChange: 'transform',
          }}
        />
      </div>

      {/* ── LAYER 9: Soft vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,2,8,0.55) 100%)',
        }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-20 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-16 content-wrap">
        <div className="space-y-5 max-w-lg">

          {/* Label */}
          <div className="flex items-center gap-3 label-anim">
            <div
              className="h-px w-10"
              style={{
                background: 'linear-gradient(to right, rgba(0,210,255,0.9), transparent)',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.4em',
                color: 'rgba(0,210,255,0.65)',
                fontWeight: 500,
                textTransform: 'uppercase',
                fontFamily: 'inherit',
              }}
            >
              Main Menu
            </span>
            <div
              className="h-px flex-1"
              style={{
                background: 'linear-gradient(to right, rgba(0,210,255,0.15), transparent)',
              }}
            />
          </div>

          {/* Title */}
          <div className="title-anim" style={{ lineHeight: 0.92 }}>
            <div
              style={{
                fontSize: 'clamp(64px, 9vw, 96px)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: '#f0f4ff',
                fontFamily: "'Barlow Condensed', 'Rajdhani', sans-serif",
                textShadow: '0 2px 20px rgba(0,0,0,0.6)',
              }}
            >
              KING OF
            </div>
            <div
              style={{
                fontSize: 'clamp(64px, 9vw, 96px)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                fontFamily: "'Barlow Condensed', 'Rajdhani', sans-serif",
                backgroundImage: 'linear-gradient(90deg, #00d2ff 0%, #a8f0ff 30%, #00d2ff 50%, #7af5ff 75%, #00d2ff 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'glow-battle 4s ease-in-out infinite, shimmer-title 6s linear infinite',
              }}
            >
              BATTLE
            </div>
          </div>

          {/* Subtitle rule */}
          <div
            className="flex items-center gap-3"
            style={{ opacity: 0.5, marginTop: '2px' }}
          >
            <div
              style={{
                width: '48px',
                height: '1px',
                background: 'rgba(0,210,255,0.7)',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'rgba(160,210,240,0.8)',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              Season 4 · Live Now
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3 pt-3 nav-anim" style={{ width: '260px' }}>
            <button className="play-btn" onClick={onPlay}>
              <span>▶&nbsp; Play Now</span>
            </button>

            <button className="about-btn" onClick={onAbout}>
              <span>
                <span className="arrow">›</span>
                About Me
              </span>
            </button>
          </nav>

          {/* Footer hint */}
          <div
            className="footer-anim flex items-center gap-2 pt-4"
            style={{
              borderTop: '1px solid rgba(0,210,255,0.1)',
              paddingTop: '16px',
            }}
          >
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'rgba(0,210,255,0.5)',
                boxShadow: '0 0 6px rgba(0,210,255,0.8)',
                animation: 'orb-breathe 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'rgba(120,160,180,0.55)',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              Press Enter to continue
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom accent bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '1px' }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, transparent 0%, rgba(0,210,255,0.0) 10%, rgba(0,210,255,0.6) 40%, rgba(100,220,255,0.9) 50%, rgba(0,210,255,0.6) 60%, rgba(0,210,255,0.0) 90%, transparent 100%)',
            animation: 'bottom-bar-glow 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Corner accent top-right ── */}
      <div
        className="absolute top-6 right-8 pointer-events-none"
        style={{
          width: '80px',
          height: '80px',
          borderTop: '1px solid rgba(0,210,255,0.25)',
          borderRight: '1px solid rgba(0,210,255,0.25)',
          borderRadius: '0 2px 0 0',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease 1s',
        }}
      />

      {/* ── Corner accent bottom-left ── */}
      <div
        className="absolute bottom-6 left-8 pointer-events-none"
        style={{
          width: '60px',
          height: '60px',
          borderBottom: '1px solid rgba(0,210,255,0.2)',
          borderLeft: '1px solid rgba(0,210,255,0.2)',
          borderRadius: '0 0 0 2px',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease 1.2s',
        }}
      />

      {/* ── HUD-style version tag ── */}
      <div
        className="absolute top-6 right-24 pointer-events-none"
        style={{
          opacity: mounted ? 0.35 : 0,
          transition: 'opacity 0.8s ease 1.5s',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(0,210,255,0.9)',
            fontFamily: 'inherit',
            fontWeight: 500,
            textTransform: 'uppercase',
          }}
        >
          v4.0.1
        </span>
      </div>
    </div>
  );
}