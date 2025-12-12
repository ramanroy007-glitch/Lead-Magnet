
import React, { useState, useEffect } from 'react';

const MESSAGES = [
    "Ready to earn? Tap me to start the 60-second quiz!",
    "I've found premium offers for you. Let's unlock them!",
    "Your first reward is waiting. Tap here to begin.",
    "Unlock your personalized dashboard in just one minute."
];

interface AiGuideProps {
    onStartQuiz: () => void;
}

const AiGuide: React.FC<AiGuideProps> = ({ onStartQuiz }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [showBubble, setShowBubble] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
            setTimeout(() => setShowBubble(true), 1000);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowBubble(false);
            setTimeout(() => {
                setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
                setShowBubble(true);
            }, 500);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (showBubble) {
            setDisplayedMessage('');
            let i = 0;
            const targetMessage = MESSAGES[messageIndex];
            const typingInterval = setInterval(() => {
                setDisplayedMessage(targetMessage.slice(0, i + 1));
                i++;
                if (i === targetMessage.length) {
                    clearInterval(typingInterval);
                }
            }, 30);
            return () => clearInterval(typingInterval);
        }
    }, [messageIndex, showBubble]);


    if (!isVisible) return null;

    return (
        <div 
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] flex flex-col items-end cursor-pointer group"
            onClick={onStartQuiz}
            aria-label="Start Quiz"
            role="button"
        >
            <div 
                className={`
                    relative mb-3 mr-1 w-56 sm:w-64
                    transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-right
                    ${showBubble ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}
                `}
            >
                <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 relative">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
                            AI Assistant
                        </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug min-h-[3em]">
                        {displayedMessage}
                        <span className="inline-block w-1 h-4 bg-slate-600 animate-pulse ml-1"></span>
                    </p>
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100"></div>
                </div>
            </div>

            <div className="relative mr-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-tr from-nat-teal to-purple-500 rounded-full blur-xl opacity-60 animate-orb-breath group-hover:opacity-80 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <div className="absolute inset-0 bg-gradient-to-tr from-nat-teal via-cyan-400 to-purple-600 animate-spin-slow"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-black">
                        N
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiGuide;