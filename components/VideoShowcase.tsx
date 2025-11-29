import React from 'react';

const VideoShowcase: React.FC = () => {
  return (
    <section className="w-full py-20 bg-brand-dark relative overflow-hidden border-t border-white/5">
      
      {/* Gradient divider at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-30"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left z-10 order-2 lg:order-1">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                Smart Matching System
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-8">
              Curated Research <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 animate-hologram">
                Opportunities.
              </span>
            </h2>
            
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Our matching engine pairs your profile with relevant studies from top US companies. Stop wasting time on surveys you don't qualify for.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-green-500/50 transition-all group cursor-default backdrop-blur-md">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">🎁</div>
                    <h3 className="font-bold text-white text-lg mb-2">Premium Incentives</h3>
                    <p className="text-sm text-slate-400">Access higher-paying studies and product trials unavailable to the general public.</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group cursor-default backdrop-blur-md">
                     <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">🛡️</div>
                    <h3 className="font-bold text-white text-lg mb-2">Data Privacy</h3>
                    <p className="text-sm text-slate-400">Your personal information is encrypted and never sold to unauthorized third parties.</p>
                </div>
            </div>
          </div>

          {/* Right: Floating Rewards Cloud */}
          <div className="flex-1 w-full flex items-center justify-center relative h-[400px] lg:h-[500px] order-1 lg:order-2">
            
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-[90px] animate-pulse-subtle will-change-transform"></div>
            
            {/* Floating Elements Container */}
            <div className="relative w-full max-w-[500px] h-full">
                
                {/* Item 1: Gaming (Center Main) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64 animate-float z-20 will-change-transform">
                    <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900 group">
                        <img src="https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=600&q=80" referrerPolicy="no-referrer" alt="Gaming Reward" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute bottom-4 left-4 right-4 px-3 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex justify-between items-center">
                            <span className="text-white text-sm font-bold">Gaming Gear</span>
                            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">Unlocked</span>
                        </div>
                    </div>
                </div>

                {/* Item 2: Sneakers (Top Right) */}
                <div className="absolute top-[10%] right-[5%] w-32 h-32 sm:w-48 sm:h-48 animate-float-fast z-10 will-change-transform hidden sm:block" style={{animationDelay: '1s'}}>
                    <div className="w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                         <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" referrerPolicy="no-referrer" alt="Fashion Reward" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Item 3: VR/Tech (Bottom Left) */}
                <div className="absolute bottom-[15%] left-[0%] w-32 h-32 sm:w-40 sm:h-40 animate-float z-30 will-change-transform hidden sm:block" style={{animationDelay: '2s'}}>
                    <div className="w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                         <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=500&q=80" referrerPolicy="no-referrer" alt="Tech Reward" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                    </div>
                </div>
                
                {/* Item 4: Gift Card (Top Left - Small) */}
                <div className="absolute top-[5%] left-[5%] sm:top-[15%] sm:left-[-5%] w-28 h-16 sm:w-32 sm:h-20 animate-float z-20 will-change-transform" style={{animationDelay: '3s'}}>
                    <div className="w-full h-full rounded-xl overflow-hidden border border-white/20 shadow-xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform">
                         <span className="text-white font-bold text-xl font-mono">$100</span>
                    </div>
                </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;