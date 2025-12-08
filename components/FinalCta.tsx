
import React from 'react';

interface FinalCtaProps {
    onStartQuiz: () => void;
    content: {
        heading: string;
        subheading: string;
        buttonText: string;
    }
}

const FinalCta: React.FC<FinalCtaProps> = ({ onStartQuiz, content }) => {
  return (
    <section className="py-20 bg-brand-primary text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
            
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight">
                {content.heading}
            </h2>
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto font-medium">
                {content.subheading}
            </p>

            <button 
                onClick={onStartQuiz}
                className="inline-block px-12 py-4 bg-brand-secondary hover:bg-orange-600 text-white font-bold text-lg rounded-full shadow-lg transition-all transform hover:scale-105"
            >
                {content.buttonText}
            </button>

        </div>
    </section>
  );
};

export default FinalCta;
