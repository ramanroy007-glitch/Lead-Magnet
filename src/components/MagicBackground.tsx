
import React, { useEffect } from 'react';

const MagicBackground: React.FC = () => {

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-nat-dark pointer-events-none select-none">
      
      {/* Reactive Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] transition-all duration-300 ease-out"
        style={{
            transform: 'translate(calc(var(--mouse-x, 50%) * -0.02), calc(var(--mouse-y, 50%) * -0.02))',
            backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Reactive Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] animate-float opacity-50 transition-all duration-300 ease-out" style={{
         transform: 'translate(calc(var(--mouse-x, 50%) * -0.05), calc(var(--mouse-y, 50%) * -0.05))',
      }}></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-nat-teal/5 rounded-full blur-[150px] animate-float opacity-50 transition-all duration-300 ease-out" style={{
         animationDelay: '-3s',
         transform: 'translate(calc(var(--mouse-x, 50%) * 0.05), calc(var(--mouse-y, 50%) * 0.05))',
      }}></div>
      
      {/* Top Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nat-dark/20 to-nat-dark"></div>
    </div>
  );
};

export default MagicBackground;
