
import React from 'react';

interface HeaderProps {
    onOpenLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenLogin }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="glass-panel mx-auto mt-4 max-w-7xl rounded-2xl px-6 h-16 flex justify-between items-center shadow-glass">
            
            {/* Logo */}
            <button 
                onClick={() => window.location.hash = '#/home'} 
                className="flex items-center gap-2 group focus:outline-none"
            >
                 <div className="w-8 h-8 bg-nat-teal rounded-lg flex items-center justify-center text-nat-dark font-display font-bold text-xl">
                    N
                 </div>
                 <span className="text-xl font-display font-bold text-white tracking-tight">
                    Natraj<span className="text-nat-teal">Rewards</span>
                 </span>
            </button>

            {/* Login */}
            <button 
                onClick={onOpenLogin}
                className="text-sm font-bold text-white hover:text-nat-teal transition-colors px-4 py-2"
            >
                Member Login
            </button>
        </div>
    </header>
  );
};

export default Header;
