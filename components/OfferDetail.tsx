import React from 'react';
import type { CpaOffer } from '../types';

interface OfferDetailProps {
  offer: CpaOffer;
  onBack: () => void;
}

const OfferDetail: React.FC<OfferDetailProps> = ({ offer, onBack }) => {
  const handleClaim = () => {
      window.open(offer.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-gray-500 font-bold hover:text-brand-primary mb-8 transition-colors"
        >
            <span className="bg-white p-2 rounded-full shadow-sm group-hover:-translate-x-1 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </span>
            Back to Offers
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Visuals & Key Info */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative group">
                    <div className="aspect-square relative overflow-hidden">
                        {offer.imageUrl ? (
                            <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand-navy to-purple-900 flex items-center justify-center text-white font-bold text-2xl">
                                {offer.payout}
                            </div>
                        )}
                        {offer.popularity && offer.popularity > 90 && (
                            <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                                🔥 High Demand
                            </div>
                        )}
                    </div>
                    <div className="p-6 text-center">
                        <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm uppercase tracking-wide mb-4">
                            Verified Offer
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">{offer.payout}</h1>
                        <p className="text-gray-500 text-sm">Estimated Completion: 5 Mins</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Offer Requirements
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold">✓</span>
                            <span>New users only</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold">✓</span>
                            <span>Valid email address required</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold">✓</span>
                            <span>Must be 18+ years old</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Column: Details & Action */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 h-full flex flex-col">
                    
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{offer.title}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {offer.description}
                        </p>
                    </div>

                    <div className="mb-10 flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Instructions to Earn</h3>
                        
                        {offer.instructions ? (
                            <div className="prose prose-purple text-gray-600 whitespace-pre-line">
                                {offer.instructions}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center font-bold text-lg shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Click "Claim Offer"</h4>
                                        <p className="text-gray-500">You will be redirected to the official partner website.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center font-bold text-lg shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Complete Registration</h4>
                                        <p className="text-gray-500">Sign up using valid information. False info may disqualify you.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center font-bold text-lg shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Confirm & Earn</h4>
                                        <p className="text-gray-500">Verify your email or complete the required action to unlock your reward.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center border border-gray-100">
                        <p className="text-gray-500 mb-6 font-medium">Ready to claim this reward?</p>
                        <button 
                            onClick={handleClaim}
                            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-brand-secondary to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white font-extrabold text-xl rounded-xl shadow-xl shadow-orange-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto"
                        >
                            {offer.ctaText}
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                        <p className="mt-4 text-xs text-gray-400">
                            By clicking, you agree to the terms of the offer provider.
                        </p>
                    </div>

                </div>
            </div>

        </div>

        {/* Similar Offers Suggestion */}
        <div className="mt-20 border-t border-gray-200 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm opacity-60">
                         <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                         <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                         <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-6">
                 <button onClick={onBack} className="text-brand-primary font-bold hover:underline">View All Offers</button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default OfferDetail;