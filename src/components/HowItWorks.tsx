
import React from 'react';
import { useScrollAnimate } from '../hooks/useScrollAnimate';

const Step: React.FC<{ imageUrl: string; title: string; text: string; stepNumber: number }> = ({ imageUrl, title, text, stepNumber }) => {
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        // Fallback to abstract tech image
        e.currentTarget.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80";
    };

    return (
        <div className="relative group animate-fade-in-up h-full" style={{ animationDelay: `${stepNumber * 150}ms`}}>
            <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden h-full hover:border-nat-teal/30 hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-nat-teal/10">
                <div className="w-full aspect-video relative overflow-hidden bg-slate-900">
                     <img 
                        loading="lazy" 
                        src={imageUrl} 
                        onError={handleImageError}
                        alt={title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                     <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 rounded-xl bg-nat-teal/90 backdrop-blur text-nat-dark font-black flex items-center justify-center text-xl shadow-lg border border-white/20">
                            {stepNumber}
                        </div>
                     </div>
                </div>
                
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nat-teal transition-colors">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
                </div>
            </div>
        </div>
    );
};

const HowItWorks: React.FC = () => {
    const [sectionRef, isVisible] = useScrollAnimate<HTMLElement>();

    return (
        <section ref={sectionRef} className="w-full bg-nat-dark py-24 relative border-t border-white/5">
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        How It Works
                    </h2>
                    <p className="text-lg text-slate-400">
                        We've simplified the process. Three steps to your first payout.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <Step 
                        imageUrl="https://images.unsplash.com/photo-1484807353303-609e73a46034?auto=format&fit=crop&w=800&q=80" 
                        title="1. Check Eligibility" 
                        text="Complete our secure 60-second profile quiz. Our AI instantly filters matches to ensure you only see offers you qualify for." 
                        stepNumber={1} 
                    />
                    <Step 
                        imageUrl="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80" 
                        title="2. Complete Tasks" 
                        text="Choose from verified surveys, app tests, and financial offers. Clear instructions and instant tracking." 
                        stepNumber={2} 
                    />
                    <Step 
                        imageUrl="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80" 
                        title="3. Instant Cash Out" 
                        text="Redeem your earnings via PayPal, Venmo, or Gift Cards. Funds are released immediately upon approval." 
                        stepNumber={3} 
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
