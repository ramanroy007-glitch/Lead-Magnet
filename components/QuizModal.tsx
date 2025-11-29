import React, { useEffect } from 'react';
import QuizFlow from './QuizFlow';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizComplete: () => void;
  initialEmail?: string;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onQuizComplete, initialEmail }) => {
  // Prevent scrolling on body when modal is open
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg z-10 animate-fade-in-up">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-200 transition-colors focus:outline-none flex items-center gap-2 text-sm font-bold"
          aria-label="Close modal"
        >
          Close
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <QuizFlow 
            onQuizComplete={() => {
                onQuizComplete();
            }} 
            initialEmail={initialEmail}
        />
      </div>
    </div>
  );
};

export default QuizModal;