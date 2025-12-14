
import React, { useState, useEffect } from 'react';

const NOTIFICATIONS = [
    { name: "Sarah J.", action: "cashed out $50.00", icon: "💸", bg: "bg-green-100" },
    { name: "Mike T.", action: "won a $100 Gift Card", icon: "🎁", bg: "bg-purple-100" },
    { name: "Jessica M.", action: "completed a survey", icon: "📝", bg: "bg-blue-100" },
    { name: "Chris P.", action: "claimed $25.00 via PayPal", icon: "🅿️", bg: "bg-blue-50" },
    { name: "Alex W.", action: "joined from Texas", icon: "👋", bg: "bg-orange-100" },
];

const LiveNotifications: React.FC = () => {
    const [current, setCurrent] = useState<typeof NOTIFICATIONS[0] | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Delay first popup
        const initialTimer = setTimeout(() => trigger(), 3000);

        const interval = setInterval(() => {
            trigger();
        }, 8000 + Math.random() * 5000); // Random interval between 8-13s

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, []);

    const trigger = () => {
        const next = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
        setCurrent(next);
        setVisible(true);
        setTimeout(() => setVisible(false), 4000);
    };

    if (!current) return null;

    return (
        <div className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
            <div className="bg-white rounded-full shadow-2xl border border-slate-100 p-2 pr-6 flex items-center gap-3 max-w-[calc(100vw-2rem)] sm:max-w-sm">
                <div className={`w-10 h-10 rounded-full ${current.bg} flex items-center justify-center text-xl shadow-inner shrink-0`}>
                    {current.icon}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 leading-none mb-1 truncate">
                        {current.name}
                    </p>
                    <p className="text-xs text-slate-500 font-medium truncate">
                        {current.action} <span className="text-slate-300 mx-1">•</span> <span className="text-green-500">Just now</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LiveNotifications;
