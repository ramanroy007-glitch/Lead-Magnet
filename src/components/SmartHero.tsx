
import React, { useState, useEffect } from 'react';
import type { SiteContentConfig } from '../types';

interface SmartHeroProps {
  onStartQuiz: () => void;
  content: SiteContentConfig;
}

const TEXT_ROTATION = ["Real Rewards", "PayPal Cash", "Gift Cards", "Crypto"];

const SmartHero: React.FC<SmartHeroProps> = ({ onStartQuiz, content }) => {
    const [textIndex, setTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        const currentWord = TEXT_ROTATION[textIndex];
        const typeSpeed = isDeleting ? 50 : 100;

        const timer = setTimeout(() => {
            if (!isDeleting && displayedText === currentWord) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && displayedText === '') {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % TEXT_ROTATION.length);
            } else {
                setDisplayedText(prev => 
                    isDeleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1)
                );
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, textIndex]);

    return (
        <section className="w-full relative pt-24 pb-12 lg:pt-32 lg:pb-24 overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* LEFT: Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left order-1 flex flex-col items-center lg:items-start">
                        <div className="inline-flex items-center gap-2 bg-nat-teal/10 border border-nat-teal/20 text-nat-teal text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full mb-8 animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-nat-teal animate-pulse"></span>
                            OFFICIAL REWARD PROGRAM 2024
                        </div>
                       
                        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-fade-in-up max-w-2xl" style={{animationDelay: '100ms'}}>
                            Start Earning <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nat-teal to-blue-500 relative inline-block min-h-[1.2em]">
                                {displayedText}
                                <span className="text-nat-teal animate-pulse ml-1">|</span>
                            </span>
                        </h1>
                         
                        <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{animationDelay: '200ms'}}>
                            Stop wasting time on low-paying sites. Our AI instantly matches you with premium surveys and offers you actually qualify for.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start animate-fade-in-up" style={{animationDelay: '300ms'}}>
                             <button
                                onClick={onStartQuiz}
                                className="relative w-full sm:w-auto px-8 py-4 bg-nat-teal hover:bg-nat-teal-dim text-nat-dark font-black text-lg rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 active:scale-95 overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    CHECK ELIGIBILITY
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </span>
                            </button>
                            <div className="flex items-center justify-center gap-3 text-sm text-slate-400 font-medium px-4 mt-2 sm:mt-0">
                                <span className="flex -space-x-3">
                                    <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-900 bg-cover shadow-md" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80)'}}></div>
                                    <div className="w-9 h-9 rounded-full bg-slate-600 border-2 border-slate-900 bg-cover shadow-md" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&q=80)'}}></div>
                                    <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold shadow-md">+2k</div>
                                </span>
                                <span className="whitespace-nowrap">Joined Today</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Image */}
                    <div className="w-full lg:w-1/2 relative order-2 animate-fade-in-up mt-8 lg:mt-0" style={{animationDelay: '400ms'}}>
                         <div className="relative w-full max-w-sm lg:max-w-md mx-auto aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-slate-800">
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-nat-dark/80 via-transparent to-transparent z-10"></div>
                            
                            {/* Safe Image Loading Logic */}
                            <img 
                                src={imgError 
                                    ? "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&w=800&q=80" // Backup: Mobile Phone in Hand
                                    : "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80" // Primary: Payments Screen
                                }
                                onError={() => setImgError(true)}
                                onLoad={() => setImgLoaded(true)}
                                alt="Mobile payment success screen" 
                                className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                                loading="eager"
                            />
                            
                            {/* Floating Social Proof UI */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl animate-float z-20">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-white font-bold text-sm">Payout Processed</span>
                                    </div>
                                    <span className="text-green-400 font-mono font-bold">$125.00</span>
                                </div>
                                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-green-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-nat-teal/20 blur-[80px] -z-10 rounded-full opacity-40"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SmartHero;
