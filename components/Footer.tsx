
import React, { useState } from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const [clickCount, setClickCount] = useState(0);

  // Magic 5-click access to admin
  const handleSecretClick = () => {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount >= 5) {
          onNavigate('admin-login');
          setClickCount(0);
      }
  };

  return (
    <footer className="bg-white border-t border-slate-200 py-8 text-slate-500 font-sans mt-auto">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Main Compliance Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-xs sm:text-sm font-bold text-slate-600">
            <button onClick={() => onNavigate('privacy')} className="hover:text-inbox-orange transition-colors">Privacy Policy</button>
            <span className="text-slate-300">|</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-inbox-orange transition-colors">Terms of Service</button>
            <span className="text-slate-300">|</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-inbox-orange transition-colors">Support</button>
            <span className="text-slate-300">|</span>
            <button onClick={() => onNavigate('admin-login')} className="hover:text-inbox-orange transition-colors">Staff Login</button>
        </div>

        {/* Advertiser Disclosure (Required for Ads) */}
        <div className="text-center mb-6">
            <p className="text-[10px] leading-relaxed text-slate-400 max-w-3xl mx-auto">
                <strong>Advertiser Disclosure:</strong> Natraj Rewards is an independent rewards program. We are not affiliated with any of the listed merchants or brands. The merchants represented are not sponsors of the rewards or otherwise affiliated with this company. The logos and other identifying marks attached are trademarks of and owned by each represented company and/or its affiliates.
            </p>
        </div>

        {/* Copyright & Secret Access */}
        <div className="flex flex-col items-center justify-center border-t border-slate-100 pt-6">
            <p 
                onClick={handleSecretClick}
                className="text-[10px] text-slate-400 select-none cursor-default hover:text-slate-500 transition-colors"
            >
                © {currentYear} Natraj Rewards. All rights reserved.
            </p>
            
            {/* Extremely discreet Admin Icon */}
            <button 
                onClick={() => onNavigate('admin-login')}
                className="mt-4 text-slate-200 hover:text-slate-400 transition-colors"
                aria-label="Admin Access"
            >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
