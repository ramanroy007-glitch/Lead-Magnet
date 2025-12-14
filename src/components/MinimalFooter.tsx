
import React, { useState, useRef, useEffect } from 'react';

interface MinimalFooterProps {
  onNavigate: (page: string) => void;
}

const MinimalFooter: React.FC<MinimalFooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const clickTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyrightClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    
    if (newCount >= 5) {
      setShowAdminLink(true);
    }

    clickTimeoutRef.current = window.setTimeout(() => {
      setAdminClickCount(0);
    }, 2000);
  };

  const handleNav = (e: React.MouseEvent<HTMLButtonElement>, page: string) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <footer className="bg-transparent text-sm relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6 py-10 max-w-7xl text-center">
         <div className="flex flex-wrap justify-center gap-6 mb-6">
            <button onClick={(e) => handleNav(e, 'privacy')} className="text-slate-400 hover:text-nat-teal hover:underline text-xs">Privacy Policy</button>
            <button onClick={(e) => handleNav(e, 'terms')} className="text-slate-400 hover:text-nat-teal hover:underline text-xs">Terms of Service</button>
            <button onClick={(e) => handleNav(e, 'contact')} className="text-slate-400 hover:text-nat-teal hover:underline text-xs">Contact Support</button>
            <button onClick={(e) => handleNav(e, 'dmca')} className="text-slate-400 hover:text-nat-teal hover:underline text-xs">DMCA</button>
         </div>
         
         <div className="text-xs text-slate-600">
            <p onClick={handleCopyrightClick} className="cursor-pointer select-none">&copy; {currentYear} Natraj Rewards. All rights reserved.</p>
            {showAdminLink && (
                <div className="mt-4">
                    <button onClick={(e) => handleNav(e, 'admin-login')} className="text-nat-teal font-bold animate-fade-in">Admin Portal</button>
                </div>
            )}
         </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;
