import React, { useRef, useEffect, useState } from 'react';
import { DEFAULT_SITE_CONTENT as SITE_CONTENT } from '../constants';

interface HeroProps {
    onStartQuiz: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartQuiz }) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const parallaxStyle = (factor: number) => ({
        transform: `translateY(${scrollY * factor}px)`,
    });
    
    return (
        <section className="relative w-full h-[120vh] md:h-screen flex items-center justify-center overflow-hidden text-white pt-24 md:pt-0">
            {/* Background Layers for Parallax */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-brand-gold/10 rounded-full blur-[150px]" 
                    style={parallaxStyle(0.3)}
                ></div>
                 <div 
                    className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-brand-gold/10 rounded-full blur-[150px]" 
                    style={parallaxStyle(0.5)}
                ></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                {/* Text Content */}
                <div 
                    className="mb-12 md:mb-16"
                    style={parallaxStyle(0.2)}
                >
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6 animate-fade-in-up">
                        {SITE_CONTENT.hero.headline}
                    </h1>
                    <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {SITE_CONTENT.hero.subheadline}
                    </p>
                    <button
                        onClick={onStartQuiz}
                        className="px-10 py-4 bg-brand-gold text-black font-bold text-lg rounded-full shadow-gold hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                        style={{ animationDelay: '400ms' }}
                    >
                        {SITE_CONTENT.hero.ctaText}
                    </button>
                </div>

                {/* 3D Interactive Card - with Parallax */}
                <div 
                    className="w-full h-auto flex items-center justify-center group" 
                    style={{ ...parallaxStyle(-0.1), perspective: '1000px' }}
                >
                    <div
                        className="w-full max-w-md h-[240px] bg-black rounded-2xl shadow-2xl relative transition-transform duration-500 ease-out will-change-transform border-2 border-brand-gold/30 animate-fade-in-up"
                        style={{ transformStyle: 'preserve-3d', animationDelay: '600ms' }}
                    >
                        {/* Card Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className="text-2xl font-serif font-bold tracking-widest text-white">NATRAJ</span>
                                    <div className="w-12 h-8 bg-gradient-to-r from-brand-gold to-yellow-600 rounded"></div>
                                </div>
                                <span className="text-[8px] text-gray-400 uppercase tracking-[0.3em]">Portfolio Access Card</span>
                            </div>
                            <div>
                                <p className="font-mono text-xl text-gray-400 tracking-wider">**** **** **** 7890</p>
                                <div className="flex justify-between items-end mt-2">
                                    <p className="font-bold text-white uppercase text-lg">MEMBER</p>
                                    <p className="text-xs text-brand-gold font-bold">VERIFIED</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;