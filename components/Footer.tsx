import React, { useState } from 'react';
import type { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleSecretAccess = () => {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount === 3) {
          window.location.hash = '#/portal';
          setClickCount(0);
      }
      setTimeout(() => setClickCount(0), 1000); 
  };

  const linkClass = "hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0";

  return (
    <footer className="bg-[#0f1014] text-gray-500 py-12 font-sans border-t border-gray-800 text-center">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Logo Small */}
        <div className="mb-6">
            <span className="text-lg font-black text-white tracking-tighter">
                NATRAJ<span className="text-brand-primary">+</span>
            </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400 mb-8">
            <button onClick={() => onNavigate('privacy')} className={linkClass}>Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className={linkClass}>Terms of Service</button>
            <button onClick={() => onNavigate('help')} className={linkClass}>Help Center</button>
            <button onClick={() => onNavigate('success-stories')} className={linkClass}>Success Stories</button>
            <button onClick={() => onNavigate('contact')} className={linkClass}>Contact Us</button>
        </div>
        
        <div className="mb-6 text-[10px] text-gray-600">
             <span className="cursor-default">San Francisco, CA 94105</span>
        </div>

        {/* Compliance Disclaimers (REQUIRED FOR ADS) */}
        <div className="mb-8 px-4">
             <p className="text-[10px] text-gray-600 leading-relaxed max-w-2xl mx-auto mb-2">
                <strong>Disclaimer:</strong> This website is a market research recruitment platform. We are not affiliated with, endorsed by, or sponsored by Facebook, Meta, Google, Amazon, or any of the brands listed. All trademarks belong to their respective owners.
             </p>
             <p className="text-[10px] text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Results vary. Testimonials are from real users but may not reflect typical results. Participation is voluntary and subject to eligibility requirements.
             </p>
        </div>

        {/* Copyright */}
        <p 
            className="text-[10px] text-gray-700 cursor-default hover:text-gray-600 transition-colors" 
            onClick={handleSecretAccess}
        >
            &copy; {new Date().getFullYear()} Natraj Rewards. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;