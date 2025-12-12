

import React, { useState, useEffect } from 'react';

const AnimatedLogo = () => (
    <div className="flex items-center gap-3 group">
        <div className="w-9 h-9 bg-nat-dark rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-nat-teal/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-px bg-nat-teal rounded-lg blur-lg animate-pulse-slow opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
            <span className="relative text-white font-black text-xl z-10">N</span>
        </div>
        <div className="text-xl font-extrabold tracking-tight text-white relative">
            Natraj
            <span className="
                text-transparent bg-clip-text bg-gradient-to-r from-nat-teal to-cyan-400
                transition-all duration-300
            ">Rewards</span>
        </div>
    </div>
);


const MinimalHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-nat-dark/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center h-20">
            <button 
                onClick={() => window.location.hash = '#/home'} 
                className="focus:outline-none focus:ring-2 focus:ring-nat-teal focus:ring-offset-2 focus:ring-offset-nat-dark rounded-lg"
                aria-label="Go to homepage"
            >
                <AnimatedLogo />
            </button>
        </div>
    </header>
  );
};

export default MinimalHeader;