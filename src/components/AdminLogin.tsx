
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
      if (password === 'admin') {
        onLoginSuccess('super_admin');
      } else if (password === 'staff') {
        onLoginSuccess('employee');
      } else {
        setError('Access Denied: The access key you entered is incorrect.');
      }
      setIsLoading(false);
      setPassword('');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-light">
      <div className="w-full max-w-sm animate-fade-in-up">
        
        <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto bg-brand-primary rounded-full flex items-center justify-center font-bold text-white text-2xl mb-4">N</div>
            <h1 className="text-3xl font-extrabold text-brand-navy">Admin Portal</h1>
            <p className="text-gray-500">Authorized Personnel Only</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-card border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 mb-2 uppercase">Access Key</label>
              <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full px-4 py-3 bg-brand-light border-2 ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg text-brand-navy focus:outline-none focus:border-brand-primary focus:shadow-input transition-all font-mono text-center tracking-widest`}
                  placeholder="••••••••"
                  disabled={isLoading}
              />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs text-center font-bold border border-red-200">
                  {error}
              </div>
            )}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    "Secure Login"
                )}
            </button>
          </form>
        </div>
        
        <button onClick={onNavigateHome} className="w-full mt-6 text-gray-500 hover:text-brand-primary text-sm transition-colors flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Return to Landing Page
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
