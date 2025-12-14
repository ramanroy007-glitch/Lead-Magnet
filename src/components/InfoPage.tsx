
import React, { useEffect } from 'react';

const AnimatedLogo = () => (
    <div className="flex items-center gap-3 group">
        <div className="w-9 h-9 bg-nat-dark rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-nat-teal/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-px bg-nat-teal rounded-lg blur-lg animate-pulse-slow opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
            <span className="relative text-white font-black text-xl z-10">N</span>
        </div>
        <div className="text-xl font-extrabold tracking-tight text-white relative">
            Natraj
            <span className="
                text-transparent bg-clip-text bg-gradient-to-r from-nat-teal to-cyan-400
                transition-all duration-300
            ">Rewards</span>
        </div>
    </div>
);

interface InfoPageProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const InfoPage: React.FC<InfoPageProps> = ({ title, onBack, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-nat-dark min-h-screen text-white font-sans flex flex-col">
      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 bg-nat-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between h-20">
          <button onClick={(e) => { e.preventDefault(); onBack(); }} className="focus:outline-none focus:ring-2 focus:ring-nat-teal focus:ring-offset-2 focus:ring-offset-nat-dark rounded-lg" aria-label="Home">
            <AnimatedLogo />
          </button>
          <button 
            onClick={onBack}
            className="text-sm font-semibold text-nat-white/60 hover:text-nat-teal transition-colors flex items-center gap-2"
          >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Home
          </button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-6">{title}</h1>
            <p className="text-nat-white/40 mb-12 border-b border-white/10 pb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-a:text-nat-teal leading-relaxed text-nat-white/80">
                {children}
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 text-center">
                 <button 
                    onClick={onBack}
                    className="text-nat-teal hover:underline font-bold transition-colors flex items-center gap-2 mx-auto"
                >
                    &larr; Return to Home
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default InfoPage;
