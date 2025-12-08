
import React, { useState, useEffect } from 'react';

// TypeScript support for custom element
// declare global removed as it was ineffective, using @ts-ignore instead

const MESSAGES = [
    "👋 Hi! I'm Nat, your AI rewards assistant.",
    "💡 Tip: Verify your email to unlock VIP payouts.",
    "🚀 I found 5 new high-value offers for you!",
    "🔒 Your data is fully encrypted and secure.",
    "💰 Top members are earning over $500 this month."
];

const AiGuide: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [showBubble, setShowBubble] = useState(false); // Start hidden for pop effect

    useEffect(() => {
        // Initial delay for the robot to appear
        const timer = setTimeout(() => {
            setIsVisible(true);
            // Show first message shortly after robot appears
            setTimeout(() => setShowBubble(true), 800);
        }, 1500);

        // Auto-rotate messages
        const interval = setInterval(() => {
            if (!isHovered) {
                cycleMessage();
            }
        }, 8000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [isHovered]);

    const cycleMessage = () => {
        setShowBubble(false);
        setTimeout(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
            setShowBubble(true);
        }, 400); // Wait for exit animation
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end pointer-events-none sm:bottom-10 sm:right-10">
            
            {/* Holographic Speech Bubble - Light Theme Version */}
            <div 
                className={`
                    relative mb-4 mr-2 max-w-[240px] pointer-events-auto cursor-pointer
                    transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-right
                    ${showBubble ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10'}
                `}
                onClick={cycleMessage}
            >
                <div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl rounded-tr-sm shadow-xl shadow-slate-900/10 border border-white"></div>
                
                <div className="relative p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nat AI • Live</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                        {MESSAGES[messageIndex]}
                    </p>
                </div>

                {/* Glass Arrow */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-r border-b border-slate-100"></div>
            </div>

            {/* Robot Container */}
            <div 
                className="relative group cursor-pointer pointer-events-auto"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={cycleMessage}
            >
                {/* 3D Portal Base (Shadow/Glow) */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900/10 rounded-[100%] blur-sm"></div>

                {/* Robot Body */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 transition-transform duration-300 ease-out group-hover:-translate-y-2 group-active:scale-95">
                    <lottie-player
                        src="https://lottie.host/6e0d3765-5c7d-41ea-9333-876a44558552/G5h8N6f4xW.json"
                        background="transparent"
                        speed="1"
                        style={{ width: '100%', height: '100%' }}
                        loop
                        autoplay
                    ></lottie-player>
                </div>
            </div>

        </div>
    );
};

export default AiGuide;
