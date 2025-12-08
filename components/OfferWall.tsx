
import React, { useState, useEffect } from 'react';
import type { CpaOffer, SmartLead } from '../types';

interface OfferWallProps {
  offers: CpaOffer[];
  lead?: SmartLead | null;
  onNavigateHome?: () => void;
}

const OfferWall: React.FC<OfferWallProps> = ({ offers, lead, onNavigateHome }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [clickedOffers, setClickedOffers] = useState<Record<string, 'loading' | 'opened'>>({});
  const [scarcityData, setScarcityData] = useState<Record<string, number>>({});
  const [progress, setProgress] = useState(0);

  // Initialize fake scarcity data for social proof
  useEffect(() => {
      const data: Record<string, number> = {};
      offers.forEach(o => {
          data[o.id] = Math.floor(Math.random() * 40) + 12; // Random 12-52 claims
      });
      setScarcityData(data);
  }, [offers]);

  const handleClaim = (offer: CpaOffer) => {
      setClickedOffers(prev => ({ ...prev, [offer.id]: 'loading' }));

      // Simulate verification progress
      setProgress(prev => Math.min(prev + 33, 100));

      setTimeout(() => {
          setClickedOffers(prev => ({ ...prev, [offer.id]: 'opened' }));
          window.open(offer.url, '_blank');
      }, 1500);
  };

  const handleShare = (e: React.MouseEvent, offer: CpaOffer) => {
      e.stopPropagation();
      const shareData = {
          title: offer.title,
          text: `Check out this reward: ${offer.payout}`,
          url: window.location.href
      };

      if (navigator.share) {
          navigator.share(shareData).catch(console.error);
      } else {
          navigator.clipboard.writeText(`${offer.title} - ${offer.url}`);
          // Optional: Add toast notification here
          alert("Link copied to clipboard!"); 
      }
  };

  // Filter and Sort Logic
  const filteredOffers = offers.filter(o => {
      if (!o.is_active) return false;
      if (activeCategory === 'All') return true;
      return o.category === activeCategory;
  }).sort((a, b) => (b.weight || 0) - (a.weight || 0)); // Sort by priority/weight

  const featuredOffer = filteredOffers.length > 0 ? filteredOffers[0] : null;
  const remainingOffers = filteredOffers.length > 0 ? filteredOffers.slice(1) : [];

  const categories = ['All', 'Shopping', 'Research', 'Finance', 'Gaming', 'Health', 'Home Services', 'Software'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-32 pt-20 md:pt-24">
      
      {/* Header Bar - Clean White & Sticky */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 h-16 md:h-20 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                  {onNavigateHome && (
                      <button onClick={onNavigateHome} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      </button>
                  )}
                  <div className="flex flex-col">
                      <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">Natraj<span className="text-inbox-orange">Rewards</span></span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Official Partner Dashboard</span>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                   <div className="hidden md:flex flex-col items-end">
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Status</span>
                       <span className="text-sm font-black text-emerald-600 tracking-wide flex items-center gap-1">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                           Active
                       </span>
                   </div>
                   <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border border-slate-200 text-slate-600 font-bold shadow-sm">
                       {lead?.email?.charAt(0).toUpperCase() || 'U'}
                   </div>
              </div>
          </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          
          {/* Categories - Scrollable Pills */}
          <div className="flex overflow-x-auto gap-3 pb-4 mb-8 no-scrollbar mask-gradient-right sticky top-16 md:top-20 z-30 bg-[#F8FAFC]/95 py-2">
              {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                        activeCategory === cat 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10 scale-105' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:shadow-sm'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>

          <div className="space-y-10">
            
            {/* HERO OFFER - Vibrant Gradient Style */}
            {featuredOffer && activeCategory === 'All' && (
                <div 
                    onClick={() => handleClaim(featuredOffer)}
                    className="group relative w-full bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-slate-100 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">
                        
                        {/* Image Side - Strict Aspect Ratio Handling */}
                        <div className="relative h-64 lg:h-full overflow-hidden bg-slate-100 order-1 lg:order-2">
                             {featuredOffer.imageUrl ? (
                                <img src={featuredOffer.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={featuredOffer.title} />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10">🎁</div>
                            )}
                            {/* Overlay Gradient for Text Readability if needed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
                            
                            <div className="absolute top-6 right-6">
                                <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2 border border-white/50">
                                    <span className="w-2 h-2 rounded-full bg-inbox-orange animate-pulse"></span>
                                    Top Pick
                                </span>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center relative bg-gradient-to-br from-white to-slate-50 order-2 lg:order-1">
                            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4 lg:mb-6 leading-tight drop-shadow-sm">
                                {featuredOffer.title}
                            </h2>
                            <p className="text-slate-600 text-base lg:text-lg mb-8 leading-relaxed max-w-lg font-medium">
                                {featuredOffer.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 lg:gap-6 mt-auto">
                                <div className="flex-1 min-w-[140px] bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Potential Earnings</span>
                                    <span className="block text-2xl lg:text-3xl font-black text-emerald-600 truncate">{featuredOffer.payout}</span>
                                </div>
                                <button className="flex-[2] py-4 lg:py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-3 min-w-[160px]">
                                    {featuredOffer.ctaText || 'Start Now'}
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STANDARD OFFERS GRID */}
            <div>
                {activeCategory === 'All' && (
                    <div className="flex items-center gap-3 mb-6 lg:mb-8">
                        <div className="w-1.5 h-8 bg-inbox-orange rounded-full"></div>
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900">Recommended For You</h3>
                    </div>
                )}

                {remainingOffers.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-bold text-slate-900">No offers found in this category.</h3>
                        <p className="text-slate-500">Try selecting 'All' or checking back later.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {remainingOffers.map((offer) => {
                        const status = clickedOffers[offer.id];
                        const claimedCount = scarcityData[offer.id] || 0;
                        
                        return (
                            <div 
                                key={offer.id}
                                onClick={() => handleClaim(offer)}
                                className={`bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-card hover:shadow-2xl border border-slate-100 transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden transform hover:-translate-y-2 ${status === 'opened' ? 'ring-2 ring-emerald-500' : ''}`}
                            >
                                 {/* Status Overlay */}
                                 {status === 'opened' && (
                                     <div className="absolute inset-0 bg-white/95 backdrop-blur-[1px] z-20 flex items-center justify-center animate-fade-in">
                                         <div className="bg-emerald-50 text-emerald-700 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-sm border border-emerald-100 text-lg">
                                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                             Opened
                                         </div>
                                     </div>
                                 )}

                                 {/* Image Container - Strict 16:9 Aspect Ratio */}
                                 <div className="w-full aspect-video relative overflow-hidden bg-slate-100">
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="text-[10px] font-bold text-slate-700 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm border border-slate-100">
                                            {offer.category}
                                        </span>
                                    </div>
                                    
                                    {/* Share Button */}
                                    <button 
                                        onClick={(e) => handleShare(e, offer)}
                                        className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                                        title="Share Offer"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                    </button>

                                    {offer.imageUrl ? (
                                        <img src={offer.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={offer.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">⚡️</div>
                                    )}
                                    
                                    {/* Hot Badge Logic */}
                                    {offer.popularity && offer.popularity > 90 && (
                                        <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                                            🔥 Trending
                                        </div>
                                    )}
                                 </div>
                                 
                                 {/* Content Body */}
                                 <div className="p-5 flex flex-col flex-1">
                                     <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 line-clamp-1 group-hover:text-inbox-blue transition-colors">
                                         {offer.title}
                                     </h3>
                                     
                                     <p className="text-slate-500 text-xs leading-relaxed mb-5 line-clamp-2 h-8">
                                         {offer.description}
                                     </p>

                                     {/* Metadata Pills */}
                                     <div className="flex flex-wrap gap-2 mb-6">
                                         <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded text-[10px] text-slate-600 font-bold">
                                             <span>⏱️</span> 5 min
                                         </div>
                                         <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded text-[10px] text-slate-600 font-bold">
                                             <span>⭐</span> 4.9
                                         </div>
                                         <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded text-[10px] text-slate-600 font-bold">
                                             <span>👥</span> {claimedCount} claims
                                         </div>
                                     </div>

                                     {/* Divider */}
                                     <div className="h-px w-full bg-slate-100 mb-4 mt-auto"></div>

                                     {/* Footer / Call to Action */}
                                     <div className="flex items-center justify-between gap-3">
                                         <div className="flex flex-col">
                                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reward</span>
                                             <span className="text-lg font-black text-emerald-600 tracking-tight leading-none">{offer.payout}</span>
                                         </div>
                                         <button className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 ${
                                             status === 'loading' ? 'bg-slate-100 text-slate-400 shadow-none' :
                                             'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'
                                         }`}>
                                             {status === 'loading' ? '...' : offer.ctaText || 'Claim'}
                                         </button>
                                     </div>
                                 </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>

          {/* FLOATING HUD - DAILY GOAL (Mobile Optimized) */}
          <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[320px] z-50 animate-slide-up">
              <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 ring-1 ring-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-inbox-orange to-pink-500 flex items-center justify-center text-sm shadow-inner shrink-0 font-bold">
                      {Math.round((progress / 100) * 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Goal</p>
                          <span className="text-inbox-orange font-bold text-xs">3 Tasks</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-inbox-orange to-pink-500 transition-all duration-1000 ease-out" 
                            style={{ width: `${progress}%` }}
                          ></div>
                      </div>
                  </div>
              </div>
          </div>
          
      </main>
    </div>
  );
};

export default OfferWall;
