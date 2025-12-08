
import React from 'react';

const SocialProof: React.FC = () => {
  return (
    <div className="w-full bg-white py-8 border-b border-slate-100">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Redeem your earnings for
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Safe, generic payment methods instead of Partner Logos to avoid legal issues */}
            
            <div className="flex items-center gap-2 group">
                <span className="text-2xl">💳</span>
                <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Visa® Prepaid</span>
            </div>

            <div className="flex items-center gap-2 group">
                <span className="text-2xl">🅿️</span>
                <span className="font-bold text-slate-700 group-hover:text-blue-800 transition-colors">PayPal™</span>
            </div>

            <div className="flex items-center gap-2 group">
                <span className="text-2xl">🎁</span>
                <span className="font-bold text-slate-700 group-hover:text-orange-500 transition-colors">Gift Cards</span>
            </div>

            <div className="flex items-center gap-2 group">
                <span className="text-2xl">🏦</span>
                <span className="font-bold text-slate-700 group-hover:text-green-600 transition-colors">Bank Transfer</span>
            </div>

            <div className="flex items-center gap-2 group">
                <span className="text-2xl">🪙</span>
                <span className="font-bold text-slate-700 group-hover:text-yellow-500 transition-colors">Crypto</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
