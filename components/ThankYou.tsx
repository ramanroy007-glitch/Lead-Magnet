import React, { useState } from 'react';

interface ThankYouProps {
  onNavigate: () => void;
}

type Provider = 'gmail' | 'yahoo' | 'outlook' | 'cable';

const ThankYou: React.FC<ThankYouProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Provider>('gmail');

  const tabs = [
    { id: 'gmail', label: 'Gmail', icon: 'M', color: 'bg-red-500' },
    { id: 'yahoo', label: 'Yahoo', icon: 'Y!', color: 'bg-purple-600' },
    { id: 'outlook', label: 'Outlook', icon: 'O', color: 'bg-blue-500' },
    { id: 'cable', label: 'Cable/ISP', icon: '#', color: 'bg-slate-600' },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50">
      
      <div className="w-full max-w-4xl mx-auto relative z-10 animate-fade-in-up">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12 max-w-lg mx-auto">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-md">✓</div>
                <span className="text-xs text-green-600 mt-2 font-bold uppercase tracking-wider">Applied</span>
            </div>
            <div className="w-20 h-1 bg-green-200 mx-2 rounded-full"></div>
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-md">✓</div>
                <span className="text-xs text-green-600 mt-2 font-bold uppercase tracking-wider">Screened</span>
            </div>
            <div className="w-20 h-1 bg-gray-200 mx-2 rounded-full relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-brand-primary w-1/2 animate-pulse"></div>
            </div>
             <div className="flex flex-col items-center opacity-60">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold">3</div>
                <span className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-wider">Confirm</span>
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
            <div className="p-8 sm:p-12">
                
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Confirm Your <span className="text-brand-primary">Email.</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        To activate your account and view all available offers, you <strong>must</strong> click the link sent to your email.
                    </p>
                </div>

                {/* Whitelisting Module */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-100/50">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                             </div>
                             <div className="text-left">
                                 <h3 className="text-gray-900 font-bold">Find Your Confirmation Link</h3>
                                 <p className="text-xs text-gray-500">Select your email provider:</p>
                             </div>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar bg-white">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all min-w-max border-b-2 ${activeTab === tab.id ? 'text-brand-primary border-brand-primary bg-purple-50' : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'}`}
                            >
                                <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] text-white ${tab.color}`}>
                                    {tab.icon === 'M' && <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 12.713l11.985-8.713H.015L12 12.713zm0 2.574L.015 6.574V19h23.97V6.574L12 15.287z"/></svg>}
                                    {tab.icon !== 'M' && tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8 min-h-[250px] bg-white">
                        {activeTab === 'gmail' && (
                            <div className="animate-fade-in space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                    <div>
                                        <h4 className="text-gray-900 font-bold mb-1">Check "Promotions" Tab</h4>
                                        <p className="text-sm text-gray-500">Our email often lands in the <strong>Promotions</strong> tab.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                    <div>
                                        <h4 className="text-gray-900 font-bold mb-1">Drag to "Primary"</h4>
                                        <p className="text-sm text-gray-500">Move the email to Primary to ensure you receive future alerts.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'yahoo' && (
                            <div className="animate-fade-in space-y-6">
                                 <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                    <div>
                                        <h4 className="text-gray-900 font-bold mb-1">Check Spam Folder</h4>
                                        <p className="text-sm text-gray-500">If you don't see it, check your <strong>Spam</strong> folder.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                    <div>
                                        <h4 className="text-gray-900 font-bold mb-1">Mark as "Not Spam"</h4>
                                        <p className="text-sm text-gray-500">Click <strong>Not Spam</strong> to whitelist us.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                         {/* Other tabs logic remains similar but styled for light mode if needed */}
                         {(activeTab === 'outlook' || activeTab === 'cable') && (
                             <div className="animate-fade-in flex items-center justify-center h-full pt-4">
                                 <p className="text-gray-500 text-center">Please check your Inbox and Junk folders.<br/>Add <strong>contact@natrajrewards.com</strong> to your safe senders.</p>
                             </div>
                         )}
                    </div>
                </div>

                <div className="mt-10 text-center">
                     <button 
                        onClick={onNavigate}
                        className="bg-brand-secondary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-md transition-all flex items-center gap-2 mx-auto"
                    >
                        <span>I Verified My Email</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                    <p className="mt-4 text-xs text-gray-400">
                        Didn't receive it? <button className="text-brand-primary underline">Resend Confirmation</button>
                    </p>
                </div>

            </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYou;