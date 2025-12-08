
import React from 'react';

interface VerifyEmailProps {
  onNavigate: () => void;
  onNavigateHome: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ onNavigate, onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-[#0f1014] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1d29] rounded-2xl border border-white/10 p-8 text-center shadow-2xl animate-fade-in-up">
         {/* Icon */}
         <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,99,229,0.3)]">
            <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
         </div>

         <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Check Your Inbox</h1>
         <p className="text-gray-400 mb-8 leading-relaxed text-sm">
            We've sent a secure verification link to your email. You must click it to activate your dashboard.
         </p>

         <div className="space-y-4">
             <button 
                onClick={onNavigate}
                className="w-full py-4 bg-brand-primary hover:bg-[#004199] text-white font-bold rounded-lg transition-all uppercase tracking-widest text-sm shadow-lg hover:shadow-brand-primary/50"
             >
                I Verified My Email
             </button>
             <button 
                onClick={() => alert("Link resent! Check your spam folder.")}
                className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider block w-full"
             >
                Resend Link
             </button>
         </div>

         <div className="mt-8 pt-6 border-t border-white/5">
             <button onClick={onNavigateHome} className="text-slate-500 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors mx-auto">
                 &larr; Back to Home
             </button>
         </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
