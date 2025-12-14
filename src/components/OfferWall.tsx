
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
  
  // Progress Logic for Gamification
  const tasksCompleted = openedOfferIds.size;
  const tasksRequired = 3;
  const progressPercentage = Math.min((tasksCompleted / tasksRequired) * 100, 100);

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
      <div className="min-h-screen bg-[#f0f2f5] font-sans pb-24">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
                  <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">N</div>
                  <span className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">Natraj<span className="text-brand-primary">Rewards</span></span>
              </div>
              <div className="flex items-center gap-3 sm:gap-6">
                  {/* Account Status Badge */}
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-bold uppercase tracking-wide">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Active Session
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 shadow-inner">
                    {lead?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
              </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-3 sm:px-6 mt-6 sm:mt-8">
            
            {/* GAMIFICATION HEADER: This drives conversion by creating a "goal" */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-1">Verify Your Account</h2>
                        <p className="text-slate-500 text-sm">Complete <strong className="text-brand-primary">{Math.max(0, tasksRequired - tasksCompleted)} more tasks</strong> to unlock your full reward dashboard.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-slate-900">{tasksCompleted}/{tasksRequired}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase block tracking-wider">Completed</span>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative z-10">
                    <div 
                        className="h-full bg-gradient-to-r from-brand-primary to-orange-400 transition-all duration-1000 ease-out relative"
                        style={{ width: `${progressPercentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shine_1s_linear_infinite]"></div>
                    </div>
                </div>
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -z-0 opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-700">Available Tasks</h3>
                <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                     <button onClick={()=>setSortBy('popularity')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${sortBy === 'popularity' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-gray-50'}`}>Trending</button>
                     <button onClick={()=>setSortBy('payout')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${sortBy === 'payout' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-gray-50'}`}>High Value</button>
                </div>
            </div>
            
            {/* Featured Hero Card */}
            {featuredOffer && (
                <div className="bg-white rounded-2xl p-0 mb-8 shadow-card-hover border border-gray-100 relative overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-all duration-300" onClick={() => handleClaim(featuredOffer)}>
                    <div className="absolute top-0 left-0 w-2 h-full bg-brand-primary"></div>
                    <div className="p-5 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                         {/* Image Container: Strictly sized and aligned */}
                         <div className="relative shrink-0">
                             <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative z-10 group-hover:shadow-md transition-all">
                                <img 
                                    src={featuredOffer.imageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=400&q=80"} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                                    alt="Featured" 
                                    loading="eager"
                                />
                             </div>
                             <div className="absolute -inset-4 bg-brand-primary/10 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         </div>
                         
                         <div className="flex-1 text-center md:text-left min-w-0">
                            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-md mb-3 uppercase tracking-wider border border-blue-100">
                                <span>⭐</span> Editor's Choice
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 truncate w-full">{featuredOffer.title}</h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{featuredOffer.description}</p>
                            
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Under 5 mins
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Verified
                                </div>
                            </div>
                         </div>

                         <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 shrink-0">
                            <div className="text-right hidden md:block">
                                <span className="block text-xs text-slate-400 font-bold uppercase">Task Value</span>
                                <span className="block text-2xl font-black text-slate-800 tracking-tight">{featuredOffer.payout}</span>
                            </div>
                            <button className="w-full md:w-auto bg-brand-primary hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/20 text-sm uppercase tracking-wide animate-pulse-slow">
                                Start Task
                            </button>
                            <span className="md:hidden text-sm font-bold text-slate-800">Value: {featuredOffer.payout}</span>
                         </div>
                    </div>
                </div>
            )}

            {/* Offer List */}
            <div className="grid grid-cols-1 gap-4">
                  {sortedOffers.map((offer) => {
                      if (loadingOfferId === offer.id) {
                          return <OfferCardSkeleton key={offer.id} />;
                      }

                      const isOpened = openedOfferIds.has(offer.id);
                      const isFeatured = offer.id === featuredOffer?.id;
                      if(isFeatured) return null; // Skip if already shown as hero

                      return (
                          <div 
                            key={offer.id} 
                            onClick={() => handleClaim(offer)}
                            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-300 relative overflow-hidden"
                          >
                               
                               {/* Image / Thumbnail */}
                               <div className="relative shrink-0">
                                   <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 relative">
                                      {offer.imageUrl ? (
                                        <img 
                                            loading="lazy" 
                                            src={offer.imageUrl} 
                                            alt={offer.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80';
                                            }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-40">⚡</div>
                                      )}
                                   </div>
                                   {/* Category Badge */}
                                   <div className="absolute -bottom-2 -right-2 bg-white shadow-sm border border-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-sm z-10">
                                        {getCategoryIcon(offer.category)}
                                   </div>
                               </div>
                               
                               {/* Content Area */}
                               <div className="flex-1 w-full text-center sm:text-left min-w-0">
                                   <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                       <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-primary transition-colors truncate">{offer.title}</h3>
                                       {offer.popularity && offer.popularity > 90 && (
                                           <span className="inline-block text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 self-center">HOT</span>
                                       )}
                                   </div>
                                   
                                   <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">{offer.description}</p>
                                   
                                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded flex items-center gap-1">
                                            ⏱️ 2 min
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded flex items-center gap-1">
                                            ✅ Free
                                        </span>
                                   </div>
                               </div>

                               {/* Action Area */}
                               <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-2 sm:gap-3 shrink-0 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                                   <div className="flex flex-row sm:flex-col items-baseline gap-2 sm:gap-0">
                                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Task Value</span>
                                       <span className="text-lg sm:text-xl font-black text-slate-800">{offer.payout}</span>
                                   </div>
                                   
                                   <button 
                                    className={`
                                        w-full sm:w-32 py-2.5 rounded-lg text-sm font-bold text-white transition-all whitespace-nowrap shadow-md
                                        ${isOpened 
                                            ? 'bg-slate-300 cursor-default shadow-none' 
                                            : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200 animate-pulse-slow'
                                        }
                                    `}
                                   >
                                       {isOpened ? 'Viewed' : 'View Offer'}
                                   </button>
                               </div>
                          </div>
                      );
                  })}
            </div>
            
            <div className="mt-12 text-center pb-8">
                <div className="inline-flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-100 px-4 py-2 rounded-full mb-4">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    System Online • Encrypted Connection
                </div>
                <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Disclaimer: Reward values are estimates. "Free" offers may require trial signup. Natraj Rewards is an independent rewards aggregator. Trademarks belong to their respective owners.
                </p>
            </div>
        </main>
      </div>
      <WelcomeModal isOpen={isWelcomeModalOpen} onClose={() => setIsWelcomeModalOpen(false)} lead={lead} />
    </>
  );
};

export default OfferWall;
