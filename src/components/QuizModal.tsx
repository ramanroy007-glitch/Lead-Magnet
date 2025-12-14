
import React, { useEffect } from 'react';
import QuizFlow from './QuizFlow';
import type { SmartLead, QuizConfig } from '../types';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizComplete: (lead: SmartLead) => void;
  initialEmail?: string;
  config: QuizConfig;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onQuizComplete, initialEmail, config }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg z-10 animate-slide-up rounded-2xl overflow-hidden shadow-2xl">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 rounded-full p-2 text-slate-500 transition-colors"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <QuizFlow 
            onQuizComplete={onQuizComplete} 
            initialEmail={initialEmail}
            config={config}
        />
      </div>
    </div>
  );
};

export default QuizModal;
