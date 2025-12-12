
import React, { useState, useEffect } from 'react';

const MESSAGES = [
    "🚀 I found 5 new high-value offers for you!",
    "💡 Tip: Surveys paying over $10 are available now.",
    "🔒 Verified: Your profile is eligible for premium rewards.",
    "👋 Hi! Tap here if you need help getting started."
];

const AiGuide: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [showBubble, setShowBubble] = useState(false);

    useEffect(() => {
        // Initial entrance
        const timer = setTimeout(() => {
            setIsVisible(true);
            setTimeout(() => setShowBubble(true), 1000);
        }, 1500);

        // Auto-cycle messages every 8 seconds
        const interval = setInterval(() => {
            cycleMessage();
        }, 8000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const cycleMessage = () => {
        setShowBubble(false);
        setTimeout(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
            setShowBubble(true);
        }, 500);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end pointer-events-none">
            
            {/* 1. The Message Card (Exact Match to Request) */}
            <div 
                className={`
                    relative mb-3 mr-1 max-w-[260px] pointer-events-auto cursor-pointer
                    transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-right
                    ${showBubble ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}
                `}
                onClick={cycleMessage}
            >
                {/* Card Background - Clean White with subtle shadow */}
                <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 relative">
                    
                    {/* Header: Status Dot + Title */}
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
                            NAT AI • LIVE
                        </span>
                    </div>

                    {/* Body Text */}
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                        {MESSAGES[messageIndex]}
                    </p>
                    
                    {/* Little Triangle Tail pointing down to the orb */}
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100"></div>
                </div>
            </div>

            {/* 2. The Glowing Orb (Trigger) */}
            <div 
                className="relative group cursor-pointer pointer-events-auto mr-4"
                onClick={cycleMessage}
            >
                {/* Outer Glow Blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-tr from-brand-primary to-purple-500 rounded-full blur-xl opacity-60 animate-orb-breath group-hover:opacity-80 transition-opacity"></div>
                
                {/* The Sphere Itself */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary via-red-400 to-purple-600 animate-spin-slow"></div>
                    
                    {/* Glass Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 opacity-50"></div>
                    
                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
                        ✨
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AiGuide;
