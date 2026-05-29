import React, { useState, useEffect } from 'react';
import bgImage from '../assets/logo.jpg';
import MeImage from '../assets/me.png';
import backImage from '../assets/back.jpg';

const skillData = {
  info: {
    title: 'ELITE PROFILE',
    desc: 'I don’t build pages. I design controlled cinematic systems—interfaces engineered for presence, precision, and identity. Every detail is tuned like a tactical command layer where motion, hierarchy, and atmosphere work as one unified experience.'
  },
  C: {
    title: 'CREATIVE UI DIRECTION',
    desc: 'Interfaces built with cinematic intent—strong hierarchy, bold contrast, and deliberate visual pacing. Every screen is designed to feel like a premium command console, not a generic UI.'
  },
  Q: {
    title: 'FRONTEND ARCHITECTURE',
    desc: 'Structured, scalable frontend systems built for long-term stability. Clean architecture that supports complex visuals without breaking performance or clarity.'
  },
  E: {
    title: 'CINEMATIC MOTION DESIGN',
    desc: 'Motion used as narrative control—subtle transitions, glow, depth, and timing that create a sense of controlled immersion and engineered atmosphere.'
  },
  X: {
    title: 'CONTACT',
    desc: 'Direct access channel for collaboration, opportunities, or system integration. Responses are handled with precision and intent.',
    email: 'kitipongzaza566@gmail.com'
  }
};

export default function ValorantAgentSelect({ onBack, onPlay }) {
  const [lockedIn, setLockedIn] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [activePanel, setActivePanel] = useState('info');

  useEffect(() => {
    const generatedParticles = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      opacity: Math.random() * 0.55 + 0.15,
      animDuration: `${Math.random() * 12 + 12}s`,
      animDelay: `-${Math.random() * 10}s`,
      moveX: `${(Math.random() - 0.5) * 80}px`
    }));
    setParticles(generatedParticles);
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    setMousePos({ x, y });
  };

  const skills = [
    { key: 'G', label: 'Game Sense', value: 32 },
    { key: 'A', label: 'Aim Control', value: 67 },
    { key: 'L', label: 'Lucky Factor', value: 999999 },
    { key: 'C', label: 'Clutch Instinct', value: 56 }
  ];

  return (
    <div
      className="relative w-full h-screen bg-[#04070d] font-sans overflow-hidden select-none"
      onMouseMove={handleMouseMove}
    >
      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--max-opacity); }
          90% { opacity: var(--max-opacity); }
          100% { transform: translateY(-500px) translateX(var(--move-x)); opacity: 0; }
        }

        @keyframes pulseGreen {
          0%, 100% { opacity: .35; box-shadow: 0 0 8px rgba(34,197,94,.35); }
          50% { opacity: 1; box-shadow: 0 0 18px rgba(34,197,94,.9); }
        }

        .scanline-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            180deg,
            rgba(0,217,255,.045) 0px,
            rgba(0,217,255,.045) 1px,
            transparent 1px,
            transparent 3px
          );
          mix-blend-mode: screen;
        }

        .tactical-box {
          background: linear-gradient(135deg, rgba(4,10,18,.72), rgba(10,16,28,.55));
          border: 1px solid rgba(0,217,255,.22);
          backdrop-filter: blur(18px);
          box-shadow: 0 0 30px rgba(0,217,255,.08), inset 0 0 28px rgba(0,0,0,.35);
        }

        .glow-cyan {
          box-shadow: 0 0 24px rgba(0,217,255,.28), 0 0 60px rgba(0,217,255,.12);
        }

        .glow-red {
          box-shadow: 0 0 24px rgba(255,70,85,.22), 0 0 60px rgba(255,70,85,.12);
        }

        .txt-stroke {
          text-shadow: 0 0 12px rgba(0,217,255,.35), 0 0 28px rgba(255,70,85,.12);
        }
      `}</style>

      {/* Back Button Top-Left */}
      <button
        onClick={() => onBack?.()}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-cyan-300 transition-all duration-200 border border-white/10 hover:border-cyan-400/40 bg-black/40 hover:bg-cyan-400/5 backdrop-blur-sm skew-x-[-8deg]"
      >
        <span className="skew-x-[8deg]">← BACK</span>
      </button>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-100 ease-out"
          style={{
            backgroundImage: `url(${backImage})`,
            transform: `scale(1.08) translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px)`
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.12),transparent_45%),linear-gradient(90deg,rgba(0,0,0,.92),rgba(0,0,0,.5),rgba(0,0,0,.88))]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-cyan-400 shadow-[0_0_8px_#00d9ff]"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              '--max-opacity': p.opacity,
              '--move-x': p.moveX,
              animation: `float-particle ${p.animDuration} linear infinite`,
              animationDelay: p.animDelay
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-20 flex justify-center items-end pb-4 pointer-events-none">
        <img
          src={MeImage}
          alt="Selected Agent"
          className="h-[95vh] lg:h-[110vh] object-contain transition-transform duration-100 ease-out drop-shadow-[0_0_35px_rgba(0,217,255,0.12)]"
          style={{
            transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.3}px)`
          }}
        />
      </div>

      <div className="scanline-overlay z-40" />

      <div className="absolute inset-0 z-30 p-6 lg:p-10 flex justify-between items-stretch pointer-events-none">
        <div
          className="w-[360px] flex flex-col justify-start pointer-events-auto transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px)`
          }}
        >
          <div className="mb-6 flex items-center gap-3 border-b border-cyan-400/20 pb-4">
            <div className="w-7 h-7 bg-[#ff4655] p-1 flex flex-col justify-center items-center gap-[2px] skew-x-[-10deg] glow-red">
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-white" />
              <div className="w-3 h-1 bg-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black italic uppercase text-white tracking-[0.18em] txt-stroke">
                AGENT
              </h2>
              <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-[0.55em] mt-1">
                TOPZ
              </p>
            </div>
          </div>

          <div className="tactical-box p-5 rounded-sm mb-4 border-l-4 border-l-cyan-400/80">
            <div className="text-[11px] tracking-[0.22em] text-cyan-300 font-bold uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_10px_#00d9ff] animate-pulse" />
              ELITE PROFILE
            </div>
            <p className="text-sm text-slate-200 leading-7">
              I don't play Valorant like a player. I move like a classified weapon system operating in real time. Every flick is calculated. Every peek feels cinematic. Every clutch looks impossible until I make it happen. The enemy team calls it aim. What they're actually seeing is controlled destruction at 240Hz.
            </p>
          </div>

          <div className="tactical-box p-5 rounded-sm mb-4 border-l-4 border-l-red-500/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] tracking-[0.22em] text-red-300 font-bold uppercase">
                COMBAT CAPABILITIES
              </span>
              <span className="text-[10px] text-cyan-300 font-bold tracking-[0.3em]">
                ELITE TIER
              </span>
            </div>

            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.key}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white/80 text-xs font-semibold tracking-wide">
                      {skill.label}
                    </span>
                    <span className="text-cyan-300 font-bold text-xs">
                      {skill.value}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/80 border border-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-red-500 shadow-[0_0_14px_rgba(0,217,255,0.55)]"
                      style={{ width: `${Math.min(skill.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tactical-box p-4 rounded-sm border-l-4 border-l-green-500/80">
            <div className="text-[11px] tracking-[0.22em] text-green-300 font-bold uppercase mb-2">
              SYSTEM STATUS
            </div>
            <div className="flex items-center gap-2 text-green-300 text-xs font-semibold tracking-[0.22em]">
              <span
                className="w-2.5 h-2.5 rounded-full bg-green-400"
                style={{ animation: 'pulseGreen 1.2s ease-in-out infinite' }}
              />
              DARK SYSTEMS  ERROR 404
            </div>
            <div className="text-slate-300 text-xs mt-2">
              “Don’t let me wake up—I’ll kill everything clean.”
            </div>
          </div>
        </div>

        <div className="w-[420px] flex flex-col justify-start pointer-events-auto transition-transform duration-100 ease-out pt-16 lg:pt-24"
          style={{
            transform: `translate(${mousePos.x * -0.15}px, ${mousePos.y * -0.15}px)`
          }}
        >
          <div className="mb-6 pl-4 text-right lg:text-left">
            <p className="text-xs font-bold text-cyan-300 tracking-[0.35em] uppercase drop-shadow-md mb-1">
              FRONTEND ARCHITECT
            </p>
            <h1 className="text-[78px] lg:text-[92px] font-black italic text-[#ece8e1] leading-[0.85] tracking-[-0.04em] txt-stroke">
              TOPZ
            </h1>
          </div>

          <div className="flex gap-3 mb-6 justify-end lg:justify-start">
            {Object.keys(skillData).map((key) => (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-[10px] font-bold tracking-widest transition-all duration-300 ease-out hover:scale-110 ${
                  activePanel === key
                    ? 'bg-cyan-400/20 border-2 border-cyan-400 shadow-[0_0_18px_rgba(0,217,255,0.5)] text-white'
                    : 'bg-black/40 border border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {key === 'info' ? 'INFO' : key}
              </button>
            ))}
          </div>

          <div className="text-left w-full text-sm text-gray-200 leading-relaxed bg-black/35 backdrop-blur-md p-5 rounded-sm border-l-2 border-cyan-500/30 shadow-2xl glow-cyan transition-all duration-300">
            <p className="font-bold text-cyan-300 mb-3 uppercase tracking-[0.2em] text-[11px]">
              {skillData[activePanel].title}
            </p>
            <p className="text-slate-300 text-sm leading-7">
              {skillData[activePanel].desc}
            </p>

            {skillData[activePanel].email && (
              <a
                href={`mailto:${skillData[activePanel].email}`}
                className="mt-4 inline-block text-cyan-300 font-semibold text-sm hover:underline"
              >
                {skillData[activePanel].email}
              </a>
            )}
          </div>
        </div>

        <div className="w-[240px] lg:w-[260px] absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
          <div className="text-6xl lg:text-7xl font-black text-white drop-shadow-[0_0_18px_rgba(0,0,0,0.7)] leading-none mb-3 italic">
            56
          </div>

          <button
            onClick={() => {
              setLockedIn(true);
              onPlay?.();
            }}
            className={`w-full py-3 text-lg font-black italic tracking-[0.35em] uppercase transition-all duration-300 border-b-2 border-black/30 skew-x-[-10deg] ${
              lockedIn
                ? 'bg-slate-200 text-slate-700 cursor-default'
                : 'bg-[#ff4655] hover:bg-[#ff5f6f] text-white shadow-[0_0_24px_rgba(255,70,85,0.45)]'  
            }`}
          >
            <div className="skew-x-[10deg]">
              {lockedIn ? 'LOCKED IN' : 'LOCK IN'}
            </div>
          </button>

          

          <div className="mt-4 flex flex-col items-center bg-black/70 backdrop-blur-md p-2.5 w-40 border border-white/10 shadow-2xl rounded-sm glow-cyan">
            <div className="w-full aspect-square bg-[#0c1826] relative mb-1.5 overflow-hidden border border-cyan-500/20">
              <img
                src={bgImage}
                alt="Player"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/70 text-center py-0.5">
                <span className="text-[10px] text-white font-semibold tracking-wider">
                  TOPZ
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-300 font-medium tracking-[0.3em] uppercase">
              {lockedIn ? 'Picking...' : 'Locked'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}