import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AiPlayground: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'chat' | 'idea'>('idea');

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setResponse('');
        
        try {
            // In a real app, this would use a proxy to hide the key, but user requested client-side demo
            // @ts-ignore
            const apiKey = process.env.API_KEY || ''; 
            
            if (!apiKey) {
                setResponse("Demo Mode: Please configure your Google Gemini API Key in the environment.");
                setLoading(false);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            
            let systemPrompt = "You are a helpful assistant.";
            if (mode === 'idea') {
                systemPrompt = "You are an expert side-hustle consultant. Provide 3 quick, bulleted actionable ideas based on the user's input.";
            }

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { systemInstruction: systemPrompt }
            });
            setResponse(result.text || "No insights available.");

        } catch (error) {
            setResponse("AI Service is currently busy. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">✨</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Google AI Suite</h3>
                    <p className="text-slate-500 mb-6 text-sm">
                        While you earn, use our premium AI tools to generate ideas, write emails, or plan your next move.
                    </p>
                    <div className="space-y-2">
                        <button onClick={() => setMode('idea')} className={`w-full text-left p-3 rounded-lg font-bold text-sm transition-all ${mode === 'idea' ? 'bg-purple-50 text-purple-700' : 'hover:bg-slate-50'}`}>💡 Side Hustle Generator</button>
                        <button onClick={() => setMode('chat')} className={`w-full text-left p-3 rounded-lg font-bold text-sm transition-all ${mode === 'chat' ? 'bg-purple-50 text-purple-700' : 'hover:bg-slate-50'}`}>💬 General Assistant</button>
                    </div>
                </div>

                <div className="md:w-2/3 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col min-h-[400px]">
                    <div className="flex-1 mb-4 overflow-y-auto">
                        {response ? (
                            <div className="prose prose-sm max-w-none text-slate-700 animate-fade-in-up bg-white p-4 rounded-xl shadow-sm">
                                <p className="whitespace-pre-line">{response}</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                                <span className="text-4xl mb-2">🤖</span>
                                <p>Enter a topic to generate insights...</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="relative">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full pl-4 pr-12 py-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder={mode === 'idea' ? "e.g., 'I have a laptop and like writing...'" : "Ask me anything..."}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>&uarr;</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiPlayground;