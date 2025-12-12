
import React, { useState, useEffect } from 'react';
import type { CpaOffer, SmartLead } from '../types';
import WelcomeModal from './WelcomeModal';
import OfferCardSkeleton from './OfferCardSkeleton';

interface OfferWallProps {
  offers: CpaOffer[];
  lead?: SmartLead | null;
  onNavigateHome?: () => void;
}

const OfferWall: React.FC<OfferWallProps> = ({ offers, lead, onNavigateHome }) => {
  const [loadingOfferId, setLoadingOfferId] = useState<string | null>(null);
  const [openedOfferIds, setOpenedOfferIds] = useState<Set<string>>(new Set());
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'payout'>('popularity');

  useEffect(() => {
    const isNewSignup = sessionStorage.getItem('new_signup');
    if (isNewSignup) {
      setIsWelcomeModalOpen(true);
      sessionStorage.removeItem('new_signup');
    }
  }, []);

  const handleClaim = (offer: CpaOffer) => {
      setLoadingOfferId(offer.id);
      setTimeout(() => {
          setOpenedOfferIds(prev => new Set(prev).add(offer.id));
          setLoadingOfferId(null);
          const cleanUrl = offer.url.replace('{subid}', lead?.email || 'guest');
          window.open(cleanUrl, '_blank');
      }, 1000);
  };

  const getCategoryIcon = (category?: string) => {
      switch(category?.toLowerCase()) {
          case 'finance': return '💳';
          case 'insurance': return '🛡️';
          case 'apps': return '📱';
          case 'gaming': return '🎮';
          case 'research': return '📝';
          case 'shopping': return '🛍️';
          default: return '⚡';
      }
  };

  const activeOffers = offers.filter(o => o.is_active);

  const sortedOffers = [...activeOffers].sort((a, b) => {
    if (sortBy === 'payout') {
      const payoutA = parseFloat(a.payout?.replace(/[^0-9.]/g, '') || '0');
      const payoutB = parseFloat(b.payout?.replace(/[^0-9.]/g, '') || '0');
      return payoutB - payoutA;
    }
    return (b.popularity || 0) - (a.popularity || 0);
  });

  const featuredOffer = [...activeOffers].sort((a, b) => b.weight - a.weight)[0];

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans pb-24">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm">N</div>
                  <span className="text-xl font-black text-slate-900 tracking-tight hidden sm:block">Natraj<span className="text-brand-primary">Rewards</span></span>
              </div>
              <div className="flex items-center gap-4">
                  <div className="text-right flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <span className="text-lg">💰</span>
                    <p className="text-green-600 font-mono font-black text-lg">$0.00</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-600 border border-slate-300">
                    {lead?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
              </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-3 sm:px-6 mt-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">Available Tasks</h1>
                    <p className="text-slate-500 text-sm">Complete tasks to earn cash. Funds released instantly.</p>
                </div>
                
                <div className="bg-white p-1 rounded-lg border border-slate-200 flex text-xs shrink-0 self-start sm:self-auto shadow-sm">
                    <button onClick={()=>setSortBy('popularity')} className={`px-4 py-2 rounded-md font-bold transition-colors ${sortBy === 'popularity' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>🔥 Popular</button>
                    <button onClick={()=>setSortBy('payout')} className={`px-4 py-2 rounded-md font-bold transition-colors ${sortBy === 'payout' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>💵 High Pay</button>
                </div>
            </div>
            
            {/* Featured Hero Card */}
            {featuredOffer && (
                <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden group cursor-pointer border border-slate-800" onClick={() => handleClaim(featuredOffer)}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-20 transition-opacity"></div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                         <div className="w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center text-4xl shrink-0 border border-white/10 shadow-inner">
                            ⭐
                         </div>
                         <div className="flex-1 text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider shadow-sm">
                                <span>🏆</span> Top Pick for You
                            </div>
                            <h2 className="text-2xl font-bold mb-2 leading-tight">{featuredOffer.title}</h2>
                            <p className="opacity-70 text-sm leading-relaxed max-w-lg">{featuredOffer.description}</p>
                         </div>
                         <div className="mt-2 sm:mt-0 w-full sm:w-auto">
                            <button className="relative w-full sm:w-auto bg-green-500 hover:bg-green-400 text-slate-900 font-black px-8 py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-900/20 text-sm uppercase tracking-wide overflow-hidden">
                                <span className="relative z-10">Claim {featuredOffer.payout}</span>
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000"></div>
                            </button>
                         </div>
                    </div>
                </div>
            )}

            {/* List View - Optimized for "App Store" feel */}
            <div className="space-y-4">
                  {sortedOffers.map((offer) => {
                      if (loadingOfferId === offer.id) {
                          return <OfferCardSkeleton key={offer.id} />;
                      }

                      const isOpened = openedOfferIds.has(offer.id);
                      const popularity = offer.popularity || 85;
                      const isHighDemand = popularity > 90;
                      const progressColor = isHighDemand ? 'bg-red-500' : 'bg-green-500';
                      const textColor = isHighDemand ? 'text-red-600' : 'text-green-600';

                      return (
                          <div key={offer.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row items-center gap-5 transition-all hover:shadow-lg hover:border-slate-300 transform hover:-translate-y-0.5 group">
                               
                               {/* Icon Area - Square with rounded corners */}
                               <div className="w-full sm:w-auto flex justify-between sm:block items-center">
                                   <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden shrink-0 relative border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                      {offer.imageUrl ? (
                                        <img 
                                            loading="lazy" 
                                            src={offer.imageUrl} 
                                            alt={offer.title} 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=100&q=80';
                                            }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-50">⚡</div>
                                      )}
                                      
                                      {/* Category Icon Badge (Overlay) */}
                                      <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur rounded-tl-lg px-1.5 py-0.5 border-t border-l border-slate-100 text-xs">
                                          {getCategoryIcon(offer.category)}
                                      </div>
                                   </div>

                                   {/* Mobile Only Payout Display */}
                                   <div className="sm:hidden text-right">
                                       <div className="text-green-600 font-black text-lg tracking-tight">{offer.payout}</div>
                                       <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-full uppercase">{offer.category}</span>
                                   </div>
                               </div>
                               
                               {/* Content Area */}
                               <div className="flex-1 w-full text-left">
                                   <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                {getCategoryIcon(offer.category)} {offer.category || 'Task'}
                                            </span>
                                            {isHighDemand && <span className="text-[10px] bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">🔥 Hot</span>}
                                        </div>
                                   </div>
                                   
                                   <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight mb-1">{offer.title}</h3>
                                   <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-1 mb-2.5">{offer.description}</p>
                                   
                                   {/* Progress Bar - Compliance Safe "Daily Cap" */}
                                   <div className="w-full max-w-[200px]">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Daily Cap</span>
                                            <span className={`text-[10px] font-bold ${textColor}`}>{popularity}% Claimed</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${progressColor} transition-all duration-1000`} 
                                                style={{ width: `${popularity}%` }}
                                            ></div>
                                        </div>
                                   </div>
                               </div>

                               {/* Action Area */}
                               <div className="w-full sm:w-auto flex flex-col items-end gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                                   <div className="hidden sm:block text-green-600 font-black text-xl tracking-tight">{offer.payout}</div>
                                   <button 
                                    onClick={() => handleClaim(offer)} 
                                    disabled={isOpened} 
                                    className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md active:scale-95 whitespace-nowrap ${isOpened ? 'bg-slate-300 cursor-default' : 'bg-slate-900 hover:bg-brand-primary hover:shadow-lg'}`}
                                   >
                                       {isOpened ? 'Viewed' : 'Start Now >'}
                                   </button>
                               </div>
                          </div>
                      );
                  })}
            </div>
        </main>
      </div>
      <WelcomeModal isOpen={isWelcomeModalOpen} onClose={() => setIsWelcomeModalOpen(false)} lead={lead} />
    </>
  );
};

export default OfferWall;
