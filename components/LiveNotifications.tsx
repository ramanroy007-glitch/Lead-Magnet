import React, { useState, useEffect } from 'react';

const NAMES = ["Sarah J.", "Mike T.", "David K.", "Jessica M.", "Emily R.", "Chris P.", "Alex W."];
const ACTIONS = ["earned $50", "claimed a reward", "withdrew $25", "started a trial", "completed a survey"];
const LOCATIONS = ["from Texas", "from Ohio", "from Florida", "from New York", "from California", "from UK"];

const LiveNotifications: React.FC = () => {
    const [notification, setNotification] = useState<{name: string, action: string, location: string} | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Initial delay
        const timeout = setTimeout(() => {
            showNotification();
        }, 5000);

        // Interval
        const interval = setInterval(() => {
            showNotification();
        }, 12000 + Math.random() * 5000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    const showNotification = () => {
        const name = NAMES[Math.floor(Math.random() * NAMES.length)];
        const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        
        setNotification({ name, action, location });
        setVisible(true);

        setTimeout(() => {
            setVisible(false);
        }, 4000);
    };

    if (!notification) return null;

    return (
        <div className={`fixed bottom-6 left-6 z-40 transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/50 p-4 flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl shadow-inner">
                    💸
                </div>
                <div>
                    <p className="text-xs text-gray-800 font-bold">
                        <span className="text-brand-primary">{notification.name}</span> {notification.action}
                    </p>
                    <p className="text-[10px] text-gray-500">{notification.location} • Just now</p>
                </div>
            </div>
        </div>
    );
};

export default LiveNotifications;