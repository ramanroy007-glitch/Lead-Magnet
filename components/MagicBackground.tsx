
import React from 'react';

const MagicBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50 select-none">
      {/* 
        AI-Generated Style Fluid Background 
        Uses CSS transforms for 60fps performance on mobile.
        Palette: Inspired by trending 'aurora' and 'glassmorphism' gradients.
      */}
      
      {/* Base Gradient Layer - Soft Warmth */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50 opacity-80"></div>
      
      {/* Moving Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-60">
        
        {/* Orb 1: Brand Orange (Top Left) - Energetic */}
        <div className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] rounded-full 
                        bg-gradient-to-r from-inbox-orange to-amber-300
                        mix-blend-multiply filter blur-[80px] md:blur-[120px]
                        animate-blob will-change-transform opacity-60"></div>
        
        {/* Orb 2: Trending Violet (Top Right) - Trust */}
        <div className="absolute top-[0%] -right-[20%] w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] rounded-full 
                        bg-gradient-to-l from-violet-300 to-indigo-300
                        mix-blend-multiply filter blur-[80px] md:blur-[120px]
                        animate-blob animation-delay-2000 will-change-transform opacity-50"></div>
        
        {/* Orb 3: Growth Green/Teal (Bottom Left) - Money */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] rounded-full 
                        bg-gradient-to-tr from-emerald-200 to-teal-300 
                        mix-blend-multiply filter blur-[80px] md:blur-[120px]
                        animate-blob animation-delay-4000 will-change-transform opacity-50"></div>

        {/* Orb 4: Central Highlight - Focus */}
        <div className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] md:w-[400px] md:h-[400px] rounded-full 
                        bg-gradient-to-b from-white to-orange-100
                        mix-blend-overlay filter blur-[60px] 
                        animate-pulse will-change-transform opacity-60"></div>
      </div>

      {/* Noise Texture for Texture/Depth */}
      <div 
        className="absolute inset-0 opacity-[0.4] mix-blend-soft-light" 
        style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};

export default MagicBackground;
