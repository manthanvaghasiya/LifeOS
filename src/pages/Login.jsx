import React, { useState, useRef, useCallback, useEffect } from 'react';
import HolographicCommandStation from '../components/auth/HolographicCommandStation';
import LoginForm from '../components/auth/LoginForm';

// --- PRODUCTION STYLES ---
const styles = `
  :root {
    --bg-primary: #050505;
    --text-primary: #e2e8f0;
    --card-bg: rgba(17, 25, 40, 0.75);
    --input-bg: #0B1121;
    --border-color: rgba(255, 255, 255, 0.125);
    --glass-blur: blur(16px) saturate(180%);
  }
  @keyframes aurora {
    0% { background-position: 50% 50%, 50% 50%; }
    100% { background-position: 350% 50%, 350% 50%; }
  }
  @keyframes scan-beam {
    0% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(500%); opacity: 0; }
  }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes shine { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
  
  .animate-aurora {
    background-image: 
      radial-gradient(at 100% 0%, hsla(220, 80%, 40%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 0%, hsla(260, 80%, 50%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 100%, hsla(220, 80%, 40%, 1) 0px, transparent 50%);
    background-size: 200% 200%;
    animation: aurora 15s ease infinite alternate;
  }
  .perspective-container { perspective: 1200px; }
  .preserve-3d { transform-style: preserve-3d; }
  .grid-floor {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    transform: perspective(500px) rotateX(60deg);
  }
  @media (max-width: 1024px) {
    .animate-aurora { animation: none; background: radial-gradient(circle at top, #1e1b4b 0%, #050505 100%); }
    .glass-card { background: #050505; backdrop-filter: none; border: none; box-shadow: none; }
  }
  @media (min-width: 1025px) {
    .glass-card { background: var(--card-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--border-color); }
  }
`;

const Login = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const requestRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isMobile || requestRef.current) return;
    requestRef.current = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
      requestRef.current = null;
    });
  }, [isMobile]);

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] relative font-sans selection:bg-blue-500/30 py-6 sm:py-20 overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      <style>{styles}</style>
      
      {/* Background FX */}
      <div className="absolute inset-0 animate-aurora opacity-30 fixed pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay fixed pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1200px] h-auto lg:h-[750px] mx-4 rounded-2xl lg:rounded-[40px] glass-card shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/10 shrink-0">
        
        {/* LEFT: Login Form */}
        <LoginForm />

        {/* RIGHT: Visual Component (Desktop Only) */}
        { !isMobile && (
          <div className="hidden lg:block w-1/2 relative bg-black/20">
             <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
             <HolographicCommandStation mousePosition={mousePosition} />
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;