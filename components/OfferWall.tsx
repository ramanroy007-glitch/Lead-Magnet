
import React, { useState } from 'react';
import type { CpaOffer, SmartLead } from '../types';

interface OfferWallProps {
  offers: CpaOffer[];
  lead?: SmartLead | null;
  onNavigateHome?: () => void;
}

const OfferWall: React.FC<OfferWallProps> = ({ offers, lead, onNavigateHome }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [clickedOffers, setClickedOffers] = useState<Record<string, 'loading' | 'opened'>>({});

  const handleClaim = (offer: CpaOffer) => {
      setClickedOffers(prev => ({ ...prev, [offer.id]: 'loading' }));
      setTimeout(() => {
          setClickedOffers(prev => ({ ...prev, [offer.id]: 'opened' }));
          const cleanUrl = offer.url.replace('{subid}', lead?.email || 'guest');
          window.open(cleanUrl, '_blank');
      }, 1500);
  };

  const categories = ['All', 'Shopping', 'Research', 'Finance', 'Gaming', 'Health', 'Software'];
  
  const filteredOffers = offers.filter(o => {
      if (!o.is_active) return false;
      if (activeCategory === 'All') return true;
      return o.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-nat-dark text-nat-white font-sans pb-32">
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-nat-dark/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  {onNavigateHome && (
                      <button onClick={onNavigateHome} className="p-2 text-nat-white/50 hover:text-nat-teal transition-colors">
                          &larr;
                      </button>
                  )}
                  <span className="text-xl font-display font-bold text-white tracking-tight">
                      Natraj<span className="text-nat-teal">Rewards</span>
                  </span>
              </div>
              <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                      <p className="text-[10px] uppercase text-nat-white/40 tracking-wider">Balance</p>
                      <p className="text-nat-teal font-mono font-bold">$0.00</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10">
                      {lead?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
              </div>
          </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6">
              {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                        activeCategory === cat 
                        ? 'bg-nat-teal text-nat-dark border-nat-teal' 
                        : 'bg-transparent text-nat-white/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map((offer) => {
                    const isLoading = clickedOffers[offer.id] === 'loading';
                    const isOpened = clickedOffers[offer.id] === 'opened';
                    
                    return (
                        <div 
                            key={offer.id}
                            onClick={() => handleClaim(offer)}
                            className={`glass-panel rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:border-nat-teal/30 hover:shadow-neon/20 ${isOpened ? 'border-nat-teal' : ''}`}
                        >
                             <div className="relative h-48 bg-nat-gray overflow-hidden">
                                {offer.imageUrl ? (
                                    <img src={offer.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={offer.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🎁</div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wide">
                                        {offer.category}
                                    </span>
                                </div>
                                {isLoading && (
                                    <div className="absolute inset-0 bg-nat-dark/80 backdrop-blur-sm flex items-center justify-center z-20">
                                        <div className="w-8 h-8 border-2 border-nat-teal border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                             </div>
                             
                             <div className="p-6">
                                 <div className="flex justify-between items-start mb-3">
                                     <h3 className="font-display font-bold text-white text-lg leading-tight line-clamp-1 group-hover:text-nat-teal transition-colors">
                                         {offer.title}
                                     </h3>
                                 </div>
                                 
                                 <p className="text-nat-white/60 text-sm mb-6 line-clamp-2">
                                     {offer.description}
                                 </p>

                                 <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                     <div className="flex flex-col">
                                         <span className="text-[10px] text-nat-white/40 uppercase tracking-wider">Reward</span>
                                         <span className="text-nat-teal font-bold">{offer.payout}</span>
                                     </div>
                                     <button className="bg-white/10 hover:bg-nat-teal hover:text-nat-dark text-white px-5 py-2 rounded-lg text-sm font-bold transition-all">
                                         {isOpened ? 'Open' : 'Claim'}
                                     </button>
                                 </div>
                             </div>
                        </div>
                    );
                })}
          </div>
      </main>
    </div>
  );
};

export default OfferWall;
