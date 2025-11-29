
import React from 'react';

interface FeaturesProps {
    onStartQuiz: () => void;
    content: {
        title: string;
        subtitle: string;
        items: Array<{title: string; desc: string}>;
    }
}

const Features: React.FC<FeaturesProps> = ({ onStartQuiz, content }) => {
  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-gray-900 mb-4">
                {content.title}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                {content.subtitle}
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {content.items.map((item, idx) => (
            <div 
                key={idx}
                className="flex flex-col items-center text-center group"
            >
                <div className="w-16 h-16 rounded-2xl bg-green-50 text-[#00D632] flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:bg-[#00D632] group-hover:text-white transition-colors duration-300">
                    {idx === 0 && '💰'}
                    {idx === 1 && '⚡'}
                    {idx === 2 && '📱'}
                    {idx === 3 && '🔒'}
                    {idx === 4 && '🛡️'}
                    {idx === 5 && '✅'}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                </h3>
                
                <p className="text-gray-500 leading-relaxed text-sm max-w-xs">
                    {item.desc}
                </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
            <button 
                onClick={onStartQuiz} 
                className="inline-block border-b-2 border-black pb-1 text-black font-bold hover:text-[#00D632] hover:border-[#00D632] transition-colors"
            >
                Start Your First Task &rarr;
            </button>
        </div>
      </div>
    </section>
  );
};

export default Features;