
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onNavigate: () => void;
  currentPage: string;
  onStartQuiz: () => void;
  onOpenLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenLogin }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
            scrolled 
                ? 'bg-[#0f1014]/90 backdrop-blur-md shadow-2xl py-3 border-b border-white/5' 
                : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-6'
        }`}
        role="banner"
    >
        <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
            
            {/* Logo - Refined Hover */}
            <button 
                onClick={onNavigate} 
                className="flex items-center gap-2 focus:outline-none cursor-pointer group"
                aria-label="Go to Natraj Rewards Home"
            >
                 <h1 className="text-3xl font-black text-white tracking-tighter transition-opacity duration-300 group-hover:opacity-90">
                    NATRAJ<span className="text-brand-primary transition-all duration-500 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">+</span>
                 </h1>
            </button>

            {/* Login Button - Clean & Transparent */}
            <button 
                onClick={onOpenLogin}
                className="text-white font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-white/10 px-6 py-2.5 rounded transition-all duration-300 border border-transparent hover:border-white/20"
                aria-label="Log into Member Dashboard"
            >
                Log In
            </button>

        </div>
    </div>
  );
};

export default Header;
