import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-inbox-green text-white border-b-8 border-inbox-green-dark">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            
            {/* Title Block */}
            <div className="md:w-1/4 text-center md:text-left">
                <h2 className="text-4xl font-extrabold uppercase leading-tight border-b-4 border-white/30 inline-block pb-2 mb-2">
                    How It<br/>Works
                </h2>
            </div>

            {/* Steps Container */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                
                {/* Arrow Lines (Desktop Only) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/20 -translate-y-1/2 z-0"></div>

                {/* Step 1 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-inbox-green-dark rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-lg mb-4 transform hover:scale-110 transition-transform">
                        🏷️
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2">Brands</h3>
                    <p className="text-sm font-medium text-white/90 px-4">
                        Brands pay us for your consumer feedback.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-inbox-green-dark rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-lg mb-4 transform hover:scale-110 transition-transform">
                        👥
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2">We Recruit</h3>
                    <p className="text-sm font-medium text-white/90 px-4">
                        We recruit members like you to take surveys.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-inbox-green-dark rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-lg mb-4 transform hover:scale-110 transition-transform">
                        💵
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2">You Earn</h3>
                    <p className="text-sm font-medium text-white/90 px-4">
                        You earn Real Cash for your online activities.
                    </p>
                </div>

            </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;