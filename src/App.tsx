import React, { useState, useEffect } from 'react';
import { generateSeoContent } from './services/gemini';

const App: React.FC = () => {
    const [content, setContent] = useState<{title: string, content: string}>({ 
        title: 'Natraj Rewards', 
        content: 'Loading AI generated content...' 
    });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await generateSeoContent();
                setContent(data);
            } catch (e) {
                console.error("Failed to load content", e);
                setContent({ title: "Welcome", content: "Service currently unavailable." });
            }
        };
        load();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 font-sans flex items-center justify-center">
            <div className="max-w-3xl w-full bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center text-black font-bold text-xl">N</div>
                    <h1 className="text-3xl font-bold text-cyan-400">{content.title}</h1>
                </div>
                <p className="text-lg leading-relaxed text-slate-300 mb-8">{content.content}</p>
                <div className="pt-6 border-t border-slate-700">
                    <span className="inline-block px-3 py-1 bg-green-900/50 text-green-400 text-xs font-bold rounded-full border border-green-800">
                        System Online
                    </span>
                    <span className="ml-3 text-xs text-slate-500">
                        Build v1.0.0 (Docker + Nginx)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default App;
