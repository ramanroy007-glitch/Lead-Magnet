import React, { useEffect } from 'react';

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
    <div className="w-full bg-white min-h-screen text-brand-navy font-sans flex flex-col">
      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between h-20">
          <a href="#/home" onClick={(e) => { e.preventDefault(); onBack(); }} className="flex items-center gap-2 group focus:outline-none" aria-label="Home">
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center font-bold text-white text-lg">N</div>
            <span className="text-xl font-bold text-brand-navy tracking-tight">Natraj</span>
          </a>
          <button 
            onClick={onBack}
            className="text-sm font-semibold text-gray-600 hover:text-brand-primary transition-colors flex items-center gap-2"
          >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Home
          </button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy mb-6">{title}</h1>
            <p className="text-gray-500 mb-12 border-b border-gray-200 pb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none prose-headings:font-extrabold prose-a:text-brand-primary leading-relaxed text-gray-600">
                {children}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                 <button 
                    onClick={onBack}
                    className="text-brand-primary hover:underline font-bold transition-colors flex items-center gap-2 mx-auto"
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
