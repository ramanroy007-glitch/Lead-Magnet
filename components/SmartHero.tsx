import React, { useState } from 'react';
import type { SmartLead, SiteContentConfig, QuizConfig } from '../types';
import QuizModal from './QuizModal';

interface SmartHeroProps {
  onLeadCaptured: (lead: SmartLead) => void;
  content: SiteContentConfig;
  quizConfig: QuizConfig;
}

const SmartHero: React.FC<SmartHeroProps> = ({ onLeadCaptured, content, quizConfig }) => {
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [email, setEmail] = useState('');

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsQuizOpen(true);
    };

    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden bg-slate-50 pt-24 pb-12">
            
            {/* Background Blobs - Subtler */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-100/50 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    
                    {/* LEFT: Copy */}
                    <div className="flex-1 text-center lg:text-left">
                        
                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
                             <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                             </span>
                             <span className="text-xs font-bold text-slate-600 uppercase tracking-widest font-display">
                                412 Rewards Claimed Today
                             </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[1.1] mb-6 tracking-tight animate-fade-in-up" style={{animationDelay: '100ms'}}>
                            Get Paid for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-nat-teal">
                                Your Opinion.
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-500 mb-10 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                            {content.hero.subheadline} Connect with top brands like Amazon, Netflix, and Walmart.
                        </p>
                        
                        {/* Stats Row - Clean */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-8 animate-fade-in-up" style={{animationDelay: '300ms'}}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">💰</div>
                                <div className="text-left">
                                    <p className="text-lg font-bold text-slate-900">$500+</p>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Avg. Earnings</p>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-slate-200"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">⚡</div>
                                <div className="text-left">
                                    <p className="text-lg font-bold text-slate-900">Instant</p>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Payouts</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Floating Card */}
                    <div className="w-full max-w-md animate-fade-in-up" style={{animationDelay: '400ms'}}>
                        <div className="bg-white rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-slate-100">
                            
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-display font-black text-slate-900 mb-2">Check Eligibility</h3>
                                <p className="text-slate-500 text-sm">See if you qualify for current rewards.</p>
                            </div>

                            <form onSubmit={handleInitialSubmit} className="space-y-4">
                                <div>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="Enter email address..." 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-nat-teal focus:ring-4 focus:ring-nat-teal/10 transition-all font-medium"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full py-4 bg-nat-teal hover:bg-nat-teal-dim text-nat-dark font-black text-lg rounded-xl transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-nat-teal/30"
                                >
                                    Start Earning Now
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                                <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                                    <span className="font-bold text-slate-400 text-xs">Partnered with:</span>
                                    <span className="font-bold text-slate-600 text-xs">Target</span>
                                    <span className="font-bold text-slate-600 text-xs">Starbucks</span>
                                    <span className="font-bold text-slate-600 text-xs">Amazon</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <QuizModal 
                isOpen={isQuizOpen} 
                onClose={() => setIsQuizOpen(false)} 
                onQuizComplete={(lead) => {
                    setIsQuizOpen(false);
                    onLeadCaptured(lead);
                }}
                initialEmail={email}
                config={quizConfig}
            />
        </section>
    );
};

export default SmartHero;