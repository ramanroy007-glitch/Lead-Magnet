
import React, { useState } from 'react';
import type { UserRole } from '../types';

interface AdminLoginProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateHome: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Role-based Login Logic
      if (password === 'admin') {
        onLoginSuccess('super_admin');
      } else if (password === 'staff') {
        onLoginSuccess('employee');
      } else {
        setError('Access Denied: The access key you entered is incorrect. Please verify your credentials and try again.');
      }
      setIsLoading(false);
      setPassword('');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617] relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Natraj<span className="text-cyan-400">Portal</span></h1>
            <p className="text-slate-500 text-xs uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-violet-500"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 mb-2 uppercase">Access Key</label>
              <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-center tracking-widest"
                  placeholder="••••••••"
                  disabled={isLoading}
              />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold animate-pulse leading-relaxed">
                  ⚠ {error}
              </div>
            )}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-white text-slate-900 font-bold rounded-lg shadow-lg hover:bg-cyan-50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <>
                        <span>Secure Login</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                )}
            </button>
          </form>
          
          <div className="mt-8 border-t border-white/5 pt-4">
             <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="p-2 rounded bg-white/5">
                     <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Owner</p>
                     <code className="text-xs text-cyan-400">admin</code>
                 </div>
                 <div className="p-2 rounded bg-white/5">
                     <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Staff</p>
                     <code className="text-xs text-cyan-400">staff</code>
                 </div>
             </div>
          </div>

        </div>
        
        <button onClick={onNavigateHome} className="w-full mt-6 text-slate-500 hover:text-white text-xs transition-colors flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Return to Landing Page
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
