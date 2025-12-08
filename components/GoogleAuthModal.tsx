
import React, { useEffect, useState } from 'react';

interface GoogleAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAccountClick = () => {
    setLoading(true);
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-[28px] w-full max-w-[400px] overflow-hidden shadow-2xl animate-scale-up relative font-sans text-slate-800">
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-slate-600">Signing in...</p>
          </div>
        )}

        {/* Header */}
        <div className="px-10 pt-10 pb-2">
            <div className="flex justify-start mb-4">
                <svg className="w-12 h-12" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
            </div>
            
            <h2 className="text-2xl font-normal text-left text-gray-900 mb-2">Sign in with Google</h2>
            <div className="text-left">
                <p className="text-base text-gray-900">Choose an account</p>
                <p className="text-sm text-gray-600 mt-1">to continue to <span className="text-blue-600 font-medium">Natraj Rewards</span></p>
            </div>
        </div>

        {/* Account List */}
        <div className="px-4 pb-8 space-y-2">
            <button 
                onClick={handleAccountClick}
                className="w-full flex items-center gap-4 px-6 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 rounded-lg transition-colors text-left group"
            >
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    U
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">User Account</p>
                    <p className="text-xs text-gray-500 truncate">user@example.com</p>
                </div>
            </button>
             <button 
                onClick={handleAccountClick}
                className="w-full flex items-center gap-4 px-6 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 rounded-lg transition-colors text-left group"
            >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Use another account</p>
                </div>
            </button>
        </div>

        {/* Footer */}
        <div className="px-10 pb-10 pt-2 flex flex-col gap-6 text-[11px] text-gray-500">
            <p className="leading-relaxed">
                To continue, Google will share your name, email address, and language preference with Natraj Rewards. Before using this app, you can review Natraj Rewards's <button className="text-blue-600 font-medium hover:underline">privacy policy</button> and <button className="text-blue-600 font-medium hover:underline">terms of service</button>.
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
                <button className="hover:bg-slate-100 px-2 py-1 rounded transition-colors text-slate-600">English (United States)</button>
                <div className="flex gap-4">
                    <button className="hover:bg-slate-100 px-2 py-1 rounded transition-colors">Help</button>
                    <button className="hover:bg-slate-100 px-2 py-1 rounded transition-colors">Privacy</button>
                    <button className="hover:bg-slate-100 px-2 py-1 rounded transition-colors">Terms</button>
                </div>
            </div>
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

      </div>
    </div>
  );
};

export default GoogleAuthModal;
