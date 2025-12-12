import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginComplete: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginComplete }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API check
    setTimeout(() => {
        // Validation: Check if email exists in our "lead database" (localStorage)
        const leads = JSON.parse(localStorage.getItem('smart_leads') || '[]');
        const userExists = leads.some((lead: any) => lead.email.toLowerCase() === email.trim().toLowerCase());

        if (userExists) {
            setIsLoading(false);
            onLoginComplete();
        } else {
            setIsLoading(false);
            setError('Account not found. Please check your eligibility and sign up first.');
        }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md z-10 animate-fade-in-up">
        <div className="glass-panel bg-[#121212] rounded-2xl shadow-2xl overflow-hidden p-8 border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-display">Member Login</h2>
                <button 
                    onClick={onClose}
                    className="text-nat-white/40 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <p className="text-nat-white/60 mb-6">Enter your email to access your dashboard and current offers.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-nat-white/40 uppercase mb-1">Email Address</label>
                    <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${error ? 'border-red-500 focus:ring-red-900' : 'border-white/10 focus:border-nat-teal focus:ring-nat-teal/20'} focus:ring-1 outline-none transition-all text-white placeholder-white/20`}
                        placeholder="you@example.com"
                    />
                    {error && <p className="text-red-400 text-xs font-bold mt-2 animate-pulse">{error}</p>}
                </div>
                
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-nat-teal hover:bg-nat-teal-dim text-nat-dark font-bold text-lg shadow-neon transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Validating...
                        </>
                    ) : 'Access Dashboard'}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-nat-white/40">
                Don't have an account? <button onClick={() => { onClose(); }} className="text-nat-teal font-bold hover:underline">Check Eligibility</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;