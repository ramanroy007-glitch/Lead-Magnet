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
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
                {content.subheading}
            </p>

            <button 
                onClick={onStartQuiz}
                className="inline-block px-10 py-4 bg-white text-brand-primary font-bold text-lg rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all"
            >
                {content.buttonText}
            </button>

            <p className="mt-6 text-xs text-purple-200 opacity-80">
                Join 50,000+ others today. No credit card required.
            </p>

        </div>
    </section>
  );
};

export default FinalCta;