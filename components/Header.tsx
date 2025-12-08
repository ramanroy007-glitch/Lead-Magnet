
import React from 'react';

interface HeaderProps {
    onOpenLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenLogin }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-200 h-14 md:h-20 transition-all shadow-sm">
        <div className="container mx-auto px-4 md:px-6 h-full flex justify-between items-center max-w-7xl">
            
            {/* Logo - Resets to Home */}
            <button 
                onClick={() => window.location.hash = '#/home'} 
                className="flex items-center gap-2 group focus:outline-none"
                aria-label="Natraj Rewards Home"
            >
                 {/* Icon - Smaller on mobile */}
                 <div className="w-8 h-8 md:w-10 md:h-10 text-inbox-orange bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.29 0 2.13-.86 2.13-1.9 0-1.04-.74-1.76-2.82-2.25-2.1-.49-4.05-1.11-4.05-3.8 0-1.98 1.37-3.27 3.42-3.66V3h2.67v1.93c1.61.32 2.89 1.48 3.03 3.15h-1.97c-.12-.86-.98-1.54-2.22-1.54-1.22 0-2.06.74-2.06 1.7 0 .96.77 1.54 2.76 2.01 2.37.57 4.1 1.41 4.1 3.93.01 2.27-1.63 3.54-3.54 3.91z"/></svg>
                 </div>
                 <div className="flex flex-col items-start">
                     <span className="text-lg md:text-2xl font-black text-slate-800 tracking-tight leading-none">Natraj<span className="text-inbox-orange">Rewards</span></span>
                 </div>
            </button>

            {/* Actions - Pure Conversion Focus */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={onOpenLogin}
                    className="px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold text-white bg-inbox-blue hover:bg-blue-700 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 touch-manipulation whitespace-nowrap"
                >
                    Member Login
                </button>
            </div>
        </div>
    </header>
  );
};

export default Header;
