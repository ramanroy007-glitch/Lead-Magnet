import React from 'react';
import { useScrollAnimate } from '../hooks/useScrollAnimate';

interface FeaturesProps {
    onStartQuiz: () => void;
    content: {
        title: string;
        subtitle: string;
        items: Array<{title: string; desc: string}>;
    }
}

const FeatureCard: React.FC<{ icon: string, title: string, text: string, className: string }> = ({ icon, title, text, className }) => {
    const [ref, isVisible] = useScrollAnimate<HTMLDivElement>();
    
    return (
        <div 
            ref={ref}
            className={`p-12 lg:p-16 flex flex-col justify-center items-center text-center group transition-all duration-1000 ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/10">
                {icon}
            </div>
            <h3 className="text-2xl font-bold font-sans text-white mb-4">{title}</h3>
            <p className="text-white/80 leading-relaxed max-w-xs">
                {text}
            </p>
        </div>
    );
};

const Features: React.FC<FeaturesProps> = ({ onStartQuiz, content }) => {
  return (
    <section className="w-full border-y border-white/5">
      <div className="w-full grid grid-cols-1 md:grid-cols-3">
          
          <FeatureCard 
              icon="📹" 
              title="Market Research" 
              text="Share your opinion on brands you love. Video surveys, quick polls, and product testing."
              className="bg-brand-cyan/10"
          />
          <FeatureCard 
              icon="🚀" 
              title="Beta Testing" 
              text="Get early access to new apps and software. Test features and report bugs for cash."
              className="bg-brand-violet/10 md:border-x md:border-white/5"
          />
          <FeatureCard 
              icon="📊" 
              title="Data Insights" 
              text="Your browsing habits are valuable. Earn passive rewards just by being online."
              className="bg-brand-gold/10"
          />

      </div>
    </section>
  );
};

export default Features;