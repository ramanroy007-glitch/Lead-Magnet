import React, { useState } from 'react';
import type { SmartLead, SiteContentConfig, QuizConfig } from '../types';
import QuizModal from './QuizModal';
import MagicBackground from './MagicBackground';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': any;
    }
  }
}

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
        <section className="relative w-full min-h-[calc(100vh-60px)] flex items-center justify-center overflow-hidden bg-slate-50 pt-20 md:pt-28 pb-8 md:pb-12">
            
            {/* Dynamic Gradient Background */}
            <MagicBackground />

            <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-20">
                
                {/* Left: Text Content - High Contrast for Readability */}
                <div className="flex-1 text-center md:text-left animate-fade-in order-1 md:order-1 mt-2 md:mt-0 relative">
                    
                    {/* Trust Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/90 backdrop-blur-sm border border-inbox-orange/20 shadow-sm mb-4 md:mb-8 mx-auto md:mx-0">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-inbox-green animate-pulse"></span>
                        <span className="text-inbox-orange font-bold text-[10px] md:text-xs uppercase tracking-wide">
                            {content.hero.trustText}
                        </span>
                    </div>

                    <div className="relative">
                        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 leading-[1.1] tracking-tight text-slate-900 drop-shadow-sm">
                            {content.hero.headline}
                        </h1>
                        
                        {/* Desktop Mascot Decoration */}
                        <div className="hidden lg:block absolute -top-16 -right-16 w-32 h-32 opacity-90 animate-float pointer-events-none">
                            <lottie-player
                                src="https://lottie.host/6e0d3765-5c7d-41ea-9333-876a44558552/G5h8N6f4xW.json"
                                background="transparent"
                                speed="1"
                                style={{ width: '100%', height: '100%' }}
                                loop
                                autoplay
                            ></lottie-player>
                        </div>
                    </div>
                    
                    <p className="text-sm sm:text-xl text-slate-700 mb-6 md:mb-8 leading-relaxed max-w-lg mx-auto md:mx-0 font-medium line-clamp-2 md:line-clamp-none">
                        {content.hero.subheadline}
                    </p>
                    
                    {/* Benefits Grid */}
                    <div className="hidden sm:flex flex-wrap justify-center md:justify-start gap-3 text-sm font-bold text-slate-600 mb-4 md:mb-0">
                        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white shadow-sm">
                            <span className="text-inbox-orange text-lg">🎁</span>
                            Sweepstakes
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white shadow-sm">
                            <span className="text-inbox-green text-lg">💵</span>
                            Paid Surveys
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white shadow-sm">
                            <span className="text-purple-500 text-lg">🏷️</span>
                            Discounts
                        </div>
                    </div>
                </div>

                {/* Right: Signup Form Card - Glassmorphism */}
                <div className="w-full md:w-[460px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative animate-fade-in delay-100 border border-white ring-1 ring-slate-200 transform hover:scale-[1.01] transition-transform duration-500 order-2 md:order-2 z-20">
                    {/* Gradient Header Line */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-inbox-orange via-yellow-400 to-inbox-green rounded-t-3xl"></div>

                    <div className="text-center mb-6 mt-2">
                        <h2 className="text-slate-900 font-black text-2xl sm:text-3xl mb-1">Check Eligibility</h2>
                        <p className="text-slate-500 font-medium text-sm sm:text-base">See what offers are available for you.</p>
                    </div>
                    
                    <form onSubmit={handleInitialSubmit} className="space-y-4">
                        <div className="relative group">
                            <input 
                                type="email" 
                                required
                                placeholder="Enter your email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-inbox-orange focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-slate-900 placeholder-slate-400 font-bold text-lg bg-slate-50 focus:bg-white text-center"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-4 sm:py-5 bg-gradient-to-r from-inbox-orange to-orange-600 hover:to-orange-700 text-white font-black text-xl rounded-xl shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 hover:shadow-orange-500/40 active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
                        >
                            {content.hero.ctaText}
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>

                        <p className="text-[10px] text-slate-400 text-center px-4 leading-normal mt-4">
                            By clicking "{content.hero.ctaText}", you agree to our <a href="#/terms" className="underline hover:text-inbox-orange text-slate-500 font-bold">Terms</a> & <a href="#/privacy" className="underline hover:text-inbox-orange text-slate-500 font-bold">Privacy Policy</a>. <br className="hidden sm:block"/>We are an independent rewards aggregator.
                        </p>
                    </form>
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