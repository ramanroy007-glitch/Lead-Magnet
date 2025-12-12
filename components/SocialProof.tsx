
import React from 'react';

// Replaced pravatar.cc with reliable Unsplash images to prevent broken links
const PAYOUTS = [
    { name: 'Sarah J.', amount: '$45.00', method: 'PayPal', time: '2 mins ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
    { name: 'Michael R.', amount: '$120.00', method: 'Visa Card', time: '5 mins ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
    { name: 'David K.', amount: '$15.50', method: 'Amazon', time: '8 mins ago', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80' },
    { name: 'Jessica T.', amount: '$85.00', method: 'Bank Transfer', time: '12 mins ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
    { name: 'Amanda L.', amount: '$250.00', method: 'PayPal', time: '15 mins ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' },
    { name: 'Chris P.', amount: '$60.00', method: 'Venmo', time: '22 mins ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
];

const SocialProof: React.FC = () => {
    return (
        <section className="py-12 bg-slate-900/50 border-y border-white/5 backdrop-blur-sm">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Trust Badges - Improved mobile grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-center justify-center mb-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-2xl">🔒</span>
                        <span className="font-bold text-white text-sm sm:text-base">SSL Secure</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-2xl">🛡️</span>
                        <span className="font-bold text-white text-sm sm:text-base">Verified Data</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-2xl">⚡</span>
                        <span className="font-bold text-white text-sm sm:text-base">Instant Payout</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-2xl">👥</span>
                        <span className="font-bold text-white text-sm sm:text-base">25k+ Users</span>
                    </div>
                </div>

                {/* Live Payout Feed */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Live Verified Payouts</h3>
                        </div>
                        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">UPDATED: JUST NOW</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PAYOUTS.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-white/5 shadow-lg transform hover:-translate-y-1 transition-transform">
                                <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full border-2 border-slate-700 object-cover" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className="text-white font-bold truncate text-sm">{p.name}</p>
                                        <span className="text-green-400 font-mono font-bold text-sm">{p.amount}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>via {p.method}</span>
                                        <span>{p.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SocialProof;
