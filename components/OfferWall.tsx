
import React, { useState } from 'react';
import type { CpaOffer } from '../types';

interface OfferWallProps {
  offers: CpaOffer[];
}

const ITEMS_PER_PAGE = 20;

const OfferWall: React.FC<OfferWallProps> = ({ offers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate Pagination
  const totalPages = Math.ceil(offers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOffers = offers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCardClick = (url: string) => {
    if (url && url !== '#') {
        window.open(url, '_blank');
    }
  };

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  return (
    <div className="bg-[#0f1014] min-h-screen py-12 px-4 font-sans text-white">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header - Clean & Compliant */}
        <div className="mb-12 text-center animate-fade-in-up">
             <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                 Available Opportunities
             </h1>
             <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                 Select a verified partner offer below to start earning. 
                 <br/><span className="text-xs opacity-50">Results may vary. Terms apply.</span>
             </p>
        </div>

        {/* Offer Grid - Professional Card Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            {currentOffers.map((offer) => (
                <div 
                    key={offer.id}
                    onClick={() => handleCardClick(offer.url)}
                    className="group bg-[#1a1d29] rounded-2xl overflow-hidden border border-white/5 hover:border-brand-primary/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-1 flex flex-col h-full"
                >
                    {/* Image Area */}
                    <div className="relative h-48 overflow-hidden bg-gray-800">
                        {offer.imageUrl ? (
                            <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-4xl">
                                {offer.category === 'sweepstakes' && '🎁'}
                                {offer.category === 'survey' && '📋'}
                                {offer.category === 'app' && '📱'}
                                {offer.category === 'finance' && '💳'}
                            </div>
                        )}
                        
                        {/* Payout Tag - Prominent */}
                        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1 border border-green-400/20">
                            <span>{offer.payout}</span>
                        </div>
                        
                        {/* Category Tag */}
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-gray-300 text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-widest">
                            {offer.category}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
                            {offer.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                            {offer.description}
                        </p>
                        
                        {/* CTA Button */}
                        <button className="w-full py-3.5 bg-brand-primary hover:bg-[#0483ee] text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 uppercase text-sm tracking-wider">
                            {offer.ctaText || 'Get Deal'}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Pagination Controls */}
        {offers.length > ITEMS_PER_PAGE && (
            <div className="mt-12 flex justify-center items-center gap-4">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-[#1a1d29] border border-white/10 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                    &larr; Previous
                </button>
                <span className="text-sm font-bold text-gray-400">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-[#1a1d29] border border-white/10 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                    Next &rarr;
                </button>
            </div>
        )}
        
        {/* Footer Disclaimer */}
        <div className="mt-16 text-center border-t border-white/5 pt-8">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                Offers update daily • User verification required for payouts
            </p>
        </div>

      </div>
    </div>
  );
};

export default OfferWall;
