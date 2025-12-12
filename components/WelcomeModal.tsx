
import React, { useEffect } from 'react';
import type { SmartLead } from '../types';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: SmartLead | null;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, lead }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-lg z-10 animate-fade-in-up bg-white rounded-2xl shadow-2xl p-8 text-center border-t-8 border-brand-primary">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            🎉
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Welcome, You're In!</h1>
          <p className="text-slate-500 mb-2">Your account has been created successfully.</p>
          <p className="font-bold text-slate-700 mb-8 break-all">{lead?.email}</p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left mb-8">
            <h2 className="font-bold text-slate-800 mb-3 text-center">ACTION REQUIRED: Whitelist Our Email!</h2>
            <p className="text-sm text-slate-600 mb-4 text-center">To ensure you receive high-paying offer alerts and payment notifications, please add our email to your contacts:</p>
            <div className="text-center bg-white p-3 rounded-lg border border-slate-200 font-mono text-brand-primary font-bold">
                rewards@natrajrewards.com
            </div>
          </div>
          
          <button 
              onClick={onClose}
              className="w-full py-4 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity"
          >
              Start Earning Now
          </button>
      </div>
    </div>
  );
};

export default WelcomeModal;