
import React from 'react';

const MagicBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-nat-dark pointer-events-none select-none">
      
      {/* Base Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
            backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Moving Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] animate-float opacity-50"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-nat-teal/5 rounded-full blur-[150px] animate-float opacity-50" style={{animationDelay: '-3s'}}></div>
      
      {/* Top Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nat-dark/20 to-nat-dark"></div>
    </div>
  );
};

export default MagicBackground;
