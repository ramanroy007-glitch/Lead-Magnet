
import React, { useState } from 'react';

interface VerifyEmailProps {
  onNavigate: () => void;
  onNavigateHome: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ onNavigate, onNavigateHome }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate backend network call
    setTimeout(() => {
        onNavigate();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-inbox-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xl animate-fade-in-up relative z-10">
         
         {/* Icon */}
         <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
            <div className="absolute inset-0 rounded-full border border-brand-primary/20 animate-ping opacity-20"></div>
            <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
         </div>

         <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Check Your Inbox</h1>
         <p className="text-slate-500 mb-8 leading-relaxed">
            We need to verify you're a human. Please click the link we just sent to your email to unlock your <strong>Rewards Dashboard</strong>.
         </p>

         <div className="space-y-4">
             <button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full py-4 bg-brand-primary hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 flex items-center justify-center gap-2 transform active:scale-95"
             >
                {isVerifying ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying Status...
                    </>
                ) : "I've Verified My Email"}
             </button>
             
             <div className="pt-2">
                 <button 
                    onClick={() => alert("Verification link resent to your email!")}
                    className="text-sm font-bold text-slate-400 hover:text-brand-primary transition-colors"
                 >
                    Resend Verification Link
                 </button>
             </div>
         </div>

         <div className="mt-8 pt-6 border-t border-slate-100">
             <button onClick={onNavigateHome} className="text-slate-400 hover:text-slate-600 text-sm flex items-center justify-center gap-2 transition-colors mx-auto font-medium">
                 &larr; Back to Home
             </button>
         </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
