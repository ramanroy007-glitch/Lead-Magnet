
import React from 'react';

const Logo = ({ text }: { text: string }) => (
    <div className="text-xl sm:text-2xl font-display font-bold text-slate-300 hover:text-slate-500 transition-colors cursor-default select-none">
        {text}
    </div>
);

const SocialProof: React.FC = () => {
  return (
    <div className="w-full bg-white border-b border-slate-100 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Featured Partners
            </p>
            <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                <Logo text="NETFLIX" />
                <Logo text="Uber" />
                <Logo text="Spotify" />
                <Logo text="coinbase" />
                <Logo text="Amazon" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
