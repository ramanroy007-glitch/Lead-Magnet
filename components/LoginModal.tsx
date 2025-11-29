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
        const leads = JSON.parse(localStorage.getItem('emailLeads') || '[]');
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
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md z-10 animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Member Login</h2>
                <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <p className="text-gray-500 mb-6">Enter your email to access your dashboard and current offers.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/10'} focus:ring-4 outline-none transition-all text-gray-900`}
                        placeholder="you@example.com"
                    />
                    {error && <p className="text-red-500 text-xs font-bold mt-2 animate-pulse">{error}</p>}
                </div>
                
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-purple-800 text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Validating...
                        </>
                    ) : 'Access Dashboard'}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
                Don't have an account? <button onClick={() => { onClose(); }} className="text-brand-primary font-bold hover:underline">Check Eligibility</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;