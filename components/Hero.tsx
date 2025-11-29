
import React from 'react';

interface HeroProps {
  onStartQuiz: () => void;
  content: {
      headline: string;
      subheadline: string;
      ctaText: string;
  }
}

const Hero: React.FC<HeroProps> = ({ onStartQuiz, content }) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0f1014]">
      
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=2500&q=80" 
            alt="Cinematic Background" 
            className="w-full h-full object-cover opacity-60"
         />
         {/* Bottom Fade Gradient (Disney+ signature) */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/60 to-transparent"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014]/80 via-transparent to-[#0f1014]/80"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center pt-20">
        
        {/* Logo/Icon Centered */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(0,99,229,0.5)]">
                ✨
            </div>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-extrabold text-white tracking-tight mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            {content.headline}
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {content.subheadline}
        </p>

        {/* Action Area - Wide Button */}
        <div className="max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <button 
                onClick={onStartQuiz}
                className="w-full bg-brand-primary hover:bg-[#0483ee] text-white font-bold text-xl py-5 rounded-lg shadow-lg tracking-widest uppercase transition-all transform hover:scale-[1.02]"
            >
                Check Eligibility
            </button>
            <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest">
                No Credit Card Required • Free to Join
            </p>
        </div>

        {/* Partner Logos - Grayscale/Subtle */}
        <div className="mt-20 pt-10 border-t border-white/10 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <p className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-widest">Research Partners</p>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Text Placeholders for Brands - Safer for ads than Logos */}
                <span className="text-xl font-bold text-white">Nielsen</span>
                <span className="text-xl font-bold text-white">Ipsos</span>
                <span className="text-xl font-bold text-white">Swagbucks</span>
                <span className="text-xl font-bold text-white">SurveyJunkie</span>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
