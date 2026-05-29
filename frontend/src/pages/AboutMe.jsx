import React, { useState, useEffect } from 'react';
// ใช้รูปภาพเดิมที่คุณมีอยู่จริงในเครื่องเพื่อไม่ให้เกิด Error
import bgImage from '../assets/main.png';
import MeImage from '../assets/me.png';

// 4. Data สำหรับแสดงรายละเอียด Skill (Lore แบบดุดัน)
const skillData = {
  info: {
    title: "BIOGRAPHY",
    desc: "ผมไม่ได้มองเว็บไซต์เป็นเพียงหน้าจอสำหรับการใช้งาน แต่ผมมองมันเป็นอีกโลกหนึ่งที่ผู้คนควร ‘รู้สึก’ ทุกครั้งที่ได้เข้ามาสัมผัส ทุก animation ทุกแสง และทุก movement ที่ผมออกแบบ ล้วนมีความหมายในแบบของมันเอง ผมหลงใหลในงาน UI/UX ที่ให้ความรู้สึก cinematic futuristic และมีเอกลักษณ์มากพอที่จะทำให้ผู้คนจดจำได้ตั้งแต่ครั้งแรก สำหรับผม design ไม่ใช่แค่ความสวยงาม แต่มันคืออารมณ์ ตัวตน และพลังที่ส่งผ่านไปถึงผู้ใช้งานอย่างเงียบงามโดยไม่จำเป็นต้องเอ่ยคำใด."
  },

  C: {
    title: "REACT SYSTEM",
    desc: "React สำหรับผมคือเครื่องมือสำคัญในการสร้างระบบที่มั่นคงและพร้อมเติบโต ผมชื่นชอบการวาง architecture ให้ทุกอย่างเป็นระเบียบ scalable และรองรับอนาคตตั้งแต่เริ่มต้น ไม่ว่า UI จะซับซ้อนเพียงใด ผมให้ความสำคัญกับความลื่นไหล responsive และประสบการณ์ที่ไร้รอยต่อ เพราะผมเชื่อว่างานที่ดีควรทั้งรวดเร็ว นิ่ง และสวยงามไปพร้อมกัน."
  },

  Q: {
    title: "TAILWIND ENGINE",
    desc: "Tailwind คือภาษาที่ผมใช้เปลี่ยนจินตนาการให้กลายเป็น interface ที่จับต้องได้ ผมชื่นชอบการจัดวาง spacing แสง สี blur และ layout เพื่อสร้างงานที่ดูเรียบหรูอย่างเป็นธรรมชาติ ทุก pixel ถูกออกแบบอย่างตั้งใจ เพื่อให้งานโดยรวมดูคมชัด ลื่นไหล และมีเอกลักษณ์เฉพาะตัวในแบบที่สะท้อนมาตรฐานระดับสากล."
  },

  E: {
    title: "CREATIVE VISION",
    desc: "ผมเชื่อว่างานที่ดีไม่ได้เกิดจากความสวยงามเพียงอย่างเดียว แต่มันเกิดจากวิสัยทัศน์ที่สามารถเชื่อมโยงความรู้สึกของผู้คนเข้ากับเทคโนโลยีได้อย่างลงตัว ทุกองค์ประกอบที่ผมสร้างจึงถูกออกแบบให้มีทั้งอารมณ์ บรรยากาศ และรายละเอียดที่ช่วยยกระดับประสบการณ์ให้ดูทันสมัย น่าจดจำ และเต็มไปด้วยเอกลักษณ์ในแบบของตัวเอง."
  },

  X: {
    title: "CONTACT",
    desc: "บางคนสร้างเว็บไซต์เพื่อให้ใช้งานได้ แต่สำหรับผม การสร้างเว็บไซต์คือการสร้างประสบการณ์ที่ผู้คนจะจดจำ หากคุณกำลังมองหาคนที่พร้อมเปลี่ยนไอเดียธรรมดาให้กลายเป็นผลงานที่มีทั้งความสวยงามและความรู้สึก ผมยินดีเสมอที่จะร่วมสร้างสิ่งนั้นไปด้วยกัน.\n\nDISCORD : topz.\nINSTAGRAM : topz.exe\nEMAIL : [topz.dev@gmail.com](mailto:topz.dev@gmail.com)"
  }
};


export default function ValorantAgentSelect() {
  const [lockedIn, setLockedIn] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // 3. State ควบคุม UI กล่องข้อความ
  const [activePanel, setActivePanel] = useState('info');

  // เอฟเฟกต์อนุภาคเรืองแสง (Particles) ด้านหลัง
  useEffect(() => {
    const generatedParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      opacity: Math.random() * 0.6 + 0.2,
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
    { key: 'C', icon: '⚡' },
    { key: 'Q', icon: '🧠' },
    { key: 'E', icon: '🧱' },
    { key: 'X', icon: '🚀' }
  ];

  return (
    <div
      className="relative w-full h-screen bg-slate-950 font-sans overflow-hidden select-none"
      onMouseMove={handleMouseMove}
    >
      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--max-opacity); }
          90% { opacity: var(--max-opacity); }
          100% { transform: translateY(-500px) translateX(var(--move-x)); opacity: 0; }
        }
        .scanline-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 217, 255, 0.03) 0px,
            rgba(0, 217, 255, 0.03) 1px,
            transparent 1px,
            transparent 2px
          );
          z-index: 40;
        }
        .tactical-box {
          background: linear-gradient(135deg, rgba(10, 15, 28, 0.75), rgba(20, 25, 45, 0.75));
          border: 1px solid rgba(0, 217, 255, 0.25);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(0, 217, 255, 0.05);
        }
      `}</style>

      {/* 1. BACKGROUND WITH PARALLAX EFFECT */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-100 ease-out"
          style={{
            backgroundImage: `url(${bgImage})`,
            transform: `scale(1.08) translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      {/* 2. BACKGROUND PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-cyan-400 shadow-[0_0_8px_#0dd9ff]"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              '--max-opacity': p.opacity,
              '--move-x': p.moveX,
              animation: `float-particle ${p.animDuration} linear infinite`,
              animationDelay: p.animDelay,
            }}
          />
        ))}
      </div>

      {/* 3. CHARACTER MODEL (CENTER) - ปรับขนาดและตำแหน่งตาม Request 1 */}
      <div className="absolute inset-0 z-20 flex justify-center items-end pb-[4%] pointer-events-none">
        <img
          src={MeImage}
          alt="Selected Agent"
          className="h-[95%] lg:h-[110%] object-contain transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.3}px)`
          }}
        />
      </div>

      {/* SCANLINE EFFECT */}
      <div className="scanline-overlay"></div>

      {/* 4. MAIN INTERFACE LAYER */}
      <div className="absolute inset-0 z-30 p-10 flex justify-between items-stretch pointer-events-none">

        {/* ==================== LEFT PANEL: AGENT INFO BOXES ==================== */}
        <div
          className="w-[340px] flex flex-col justify-start pointer-events-auto transition-transform duration-100 ease-out"
          style={{ transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px)` }}
        >
          {/* ซ้ายบน: หัวข้อ AGENT */}
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-7 h-7 bg-[#ff4655] p-1 flex flex-col justify-center items-center gap-[2px] skew-x-[-10deg]">
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-white"></div>
              <div className="w-3 h-1 bg-white"></div>
            </div>
            <div>
              <h2 className="text-4xl font-black italic uppercase text-white drop-shadow-md leading-none tracking-wider">
                AGENT
              </h2>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mt-1">
                DOSSIER // FILE SYSTEM ACTIVE
              </p>
            </div>
          </div>

          {/* กล่องข้อความ 1: Overview */}
          <div className="tactical-box p-4 rounded-sm mb-4 border-l-4 border-l-cyan-400">
            <div className="text-[11px] tracking-[2px] text-cyan-400 font-bold uppercase mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_6px_#0dd9ff]"></span>
              BIOGRAPHY
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              สตรีมเมอร์และนักพัฒนาซอฟต์แวร์ผู้หลงใหลในการออกแบบ UI/UX สไตล์ล้ำยุค มีความเชี่ยวชาญในการจัดโครงสร้าง Frontend ให้มีประสิทธิภาพและลื่นไหลเหมือนเกมระดับ AAA
            </p>
          </div>

          {/* กล่องข้อความ 2: Core Capabilities */}

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-white/70">Creative UI Direction</span>
              <span className="text-cyan-400 font-bold">99%</span>
            </div>
            <div className="w-full h-1 bg-slate-950 border border-white/10">
              <div className="h-full bg-cyan-400" style={{ width: '99%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-white/70">Frontend Architecture</span>
              <span className="text-cyan-400 font-bold">96%</span>
            </div>
            <div className="w-full h-1 bg-slate-950 border border-white/10">
              <div className="h-full bg-cyan-400" style={{ width: '96%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-white/70">Cinematic Motion Design</span>
              <span className="text-cyan-400 font-bold">98%</span>
            </div>
            <div className="w-full h-1 bg-slate-950 border border-white/10">
              <div className="h-full bg-cyan-400" style={{ width: '98%' }}></div>
            </div>
          </div>

          {/* กล่องข้อความ 3: System Status */}
          <div className="tactical-box p-4 rounded-sm border-l-4 border-l-[#ff4655]">
            <div className="text-[11px] tracking-[2px] text-red-400 font-bold uppercase mb-1.5">
              SYSTEM STATUS
            </div>
            <p className="text-xs text-green-400 font-semibold tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              DEPLOYMENT READY // NO ERRORS FOUND
            </p>
          </div>
        </div>

        {/* ==================== CENTER BOTTOM: TIMER & LOCK IN ==================== */}
        {/* ปรับขนาดตาม Request 2 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center w-[240px] pointer-events-auto">
          {/* Timer */}
          <div className="text-[64px] font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] leading-none mb-3 italic">
            53
          </div>

          {/* Lock In Button */}
          <button
            onClick={() => setLockedIn(!lockedIn)}
            className={`w-full py-2.5 text-xl font-black italic tracking-widest uppercase transition-all duration-200 border-b-2 border-black/30 skew-x-[-10deg]
              ${lockedIn
                ? 'bg-[#cccbd6] text-[#555462] cursor-default'
                : 'bg-[#ff4655] hover:bg-[#ff5865] text-white shadow-[0_0_20px_rgba(255,70,85,0.4)] active:scale-[0.98]'
              }
            `}
          >
            <div className="skew-x-[10deg]">
              {lockedIn ? 'LOCKED IN' : 'LOCK IN'}
            </div>
          </button>

          {/* Player Card Mini */}
          <div className="mt-4 flex flex-col items-center bg-black/70 backdrop-blur-md p-2.5 w-[160px] border border-white/10 shadow-2xl rounded-sm">
            <div className="w-full aspect-square bg-[#0c1826] relative mb-1.5 overflow-hidden border border-cyan-500/20">
              <img src={MeImage} alt="Player" className="w-full h-full object-cover object-top" />
              <div className="absolute bottom-0 inset-x-0 bg-black/70 text-center py-[2px]">
                <span className="text-[10px] text-white font-semibold tracking-wider">cork</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
              {lockedIn ? 'Locked' : 'Picking...'}
            </p>
          </div>
        </div>

        {/* ==================== RIGHT PANEL: AGENT DETAILS ==================== */}
        <div
          className="w-[420px] flex flex-col justify-start pointer-events-auto transition-transform duration-100 ease-out"
          style={{ transform: `translate(${mousePos.x * -0.15}px, ${mousePos.y * -0.15}px)` }}
        >
          {/* Role & Name */}
          <div className="mb-6 pl-4 text-right lg:text-left">
            <p className="text-xs font-bold text-cyan-300 tracking-[0.25em] uppercase drop-shadow-md mb-1">
              FRONTEND ARCHITECT
            </p>
            <h1 className="text-[90px] font-black italic text-[#ece8e1] leading-[0.85] tracking-[-0.04em] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
              TOPZ
            </h1>
          </div>

          {/* Skills Tray */}
          <div className="flex gap-3 mb-6 justify-end lg:justify-start">
            {/* 5. & 8. ปุ่ม INFO */}
            <div
              onClick={() => {
                setActivePanel('info');
                new Audio('/click.mp3').play().catch(e => console.log('Audio disabled')); // เพิ่มกันเหนียว
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center mr-2 shadow-inner cursor-pointer transition-all duration-300 ease-out hover:scale-110
                ${activePanel === 'info'
                  ? 'bg-cyan-400/20 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.5)]'
                  : 'bg-black/40 border border-white/60'
                }
              `}
            >
              <span className="text-white font-bold text-[10px] tracking-tighter">INFO</span>
            </div>

            {/* 6. & 8. ปุ่ม Skills */}
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 group cursor-pointer"
                onClick={() => {
                  setActivePanel(skill.key);
                  new Audio('/click.mp3').play().catch(e => console.log('Audio disabled')); // เพิ่มกันเหนียว
                }}
              >
                <div className={`w-11 h-11 flex items-center justify-center text-lg text-white transition-all duration-300 ease-out hover:scale-110
                  ${activePanel === skill.key
                    ? 'bg-cyan-400/20 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.5)]'
                    : 'bg-black/40 border border-white/20 group-hover:bg-white/20 group-hover:border-white/50'
                  }
                `}>
                  {skill.icon}
                </div>
                <span className="text-[9px] font-bold text-white/50 tracking-widest">{skill.key}</span>
              </div>
            ))}
          </div>

          {/* 7. Description Block แบบ Dynamic */}
          <div className="text-left w-full text-[13px] text-gray-200 leading-relaxed bg-black/30 backdrop-blur-md p-5 rounded-sm border-l-2 border-cyan-500/30 shadow-2xl transition-all duration-300">
            <p className="font-bold text-cyan-300 mb-3 uppercase tracking-wider text-[11px]">
              {skillData[activePanel].title}
            </p>
            <p className="drop-shadow-md text-gray-300 text-sm leading-relaxed">
              {skillData[activePanel].desc}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}