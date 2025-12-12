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
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden bg-nat-dark pt-24 pb-12">
            
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-nat-teal/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    
                    {/* LEFT: Copy */}
                    <div className="flex-1 text-center lg:text-left">
                        
                        {/* Status Chip */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
                             <div className="w-2 h-2 bg-nat-teal rounded-full animate-pulse"></div>
                             <span className="text-xs font-bold text-nat-teal uppercase tracking-widest font-display">
                                Official Reward Portal
                             </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] mb-6 tracking-tight animate-fade-in-up" style={{animationDelay: '100ms'}}>
                            Your Opinion.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-nat-teal">
                                Real Value.
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-nat-white/70 mb-10 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                            {content.hero.subheadline} Connect with 500+ top brands looking for your feedback. Secure, verified, and instant.
                        </p>
                        
                        {/* Stats Row */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-8 animate-fade-in-up" style={{animationDelay: '300ms'}}>
                            <div>
                                <p className="text-3xl font-display font-bold text-white">$8.5M+</p>
                                <p className="text-xs text-nat-white/50 uppercase tracking-wide">Paid Out</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div>
                                <p className="text-3xl font-display font-bold text-white">45k+</p>
                                <p className="text-xs text-nat-white/50 uppercase tracking-wide">Active Members</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div>
                                <p className="text-3xl font-display font-bold text-white">24/7</p>
                                <p className="text-xs text-nat-white/50 uppercase tracking-wide">Support</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Glass Card Interface */}
                    <div className="w-full max-w-md animate-fade-in-up" style={{animationDelay: '400ms'}}>
                        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group">
                            
                            {/* Scanning Line Animation */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-nat-teal to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-y-[400px] transition-all duration-[2s] ease-linear"></div>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                                    <svg className="w-8 h-8 text-nat-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-2">Check Eligibility</h3>
                                <p className="text-nat-white/60 text-sm">Enter your email to verify access.</p>
                            </div>

                            <form onSubmit={handleInitialSubmit} className="space-y-4">
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="name@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-nat-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-nat-teal/50 focus:ring-1 focus:ring-nat-teal/50 transition-all"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full py-4 bg-nat-teal text-nat-dark font-bold text-lg rounded-xl hover:bg-nat-teal-dim transition-all transform active:scale-95 shadow-neon"
                                >
                                    Get Started
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-white/5 text-center">
                                <p className="text-xs text-nat-white/40">
                                    <span className="text-nat-teal">🔒 Secure 256-bit SSL Connection.</span> Your data is protected.
                                </p>
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