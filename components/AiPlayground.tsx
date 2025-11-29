import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AiPlayground: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'chat' | 'idea' | 'image'>('chat');

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setResponse('');
        setGeneratedImage(null);
        
        try {
            const apiKey = process.env.API_KEY || '';
            if (!apiKey) {
                setResponse("Demo Mode: AI Key not configured. Please add API_KEY to environment.");
                setLoading(false);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            
            if (mode === 'image') {
                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                        parts: [{ text: prompt }]
                    }
                });

                // Check for image part
                let imageFound = false;
                if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
                    for (const part of result.candidates[0].content.parts) {
                        if (part.inlineData) {
                            const base64String = part.inlineData.data;
                            const mimeType = part.inlineData.mimeType || 'image/png';
                            setGeneratedImage(`data:${mimeType};base64,${base64String}`);
                            imageFound = true;
                        }
                    }
                }
                
                if (!imageFound) {
                    setResponse("I couldn't generate an image for that request. Try a different description.");
                }

            } else {
                let systemPrompt = "You are a helpful AI assistant for the Natraj Rewards platform.";
                if (mode === 'idea') {
                    systemPrompt = "You are a creative business idea generator. Provide 3 quick, actionable side-hustle ideas based on the user's input.";
                }

                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        systemInstruction: systemPrompt
                    }
                });
                setResponse(result.text || "No response generated.");
            }

        } catch (error) {
            setResponse("Error connecting to AI services. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                
                {/* Sidebar */}
                <div className="bg-gray-50 p-6 md:w-64 border-r border-gray-200">
                    <h3 className="text-gray-900 font-extrabold text-lg mb-6 flex items-center gap-2">
                        <span className="text-2xl">⚡</span> Tools
                    </h3>
                    <div className="space-y-2">
                        <button 
                            onClick={() => { setMode('chat'); setResponse(''); setGeneratedImage(null); }}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'chat' ? 'bg-white shadow-sm text-brand-primary border border-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            💬 AI Chat
                        </button>
                        <button 
                            onClick={() => { setMode('idea'); setResponse(''); setGeneratedImage(null); }}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'idea' ? 'bg-white shadow-sm text-brand-primary border border-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            💡 Idea Gen
                        </button>
                         <button 
                            onClick={() => { setMode('image'); setResponse(''); setGeneratedImage(null); }}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'image' ? 'bg-white shadow-sm text-brand-primary border border-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            🎨 Image Gen
                        </button>
                    </div>
                    
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-800 font-bold mb-1">Pro Tip:</p>
                        <p className="text-xs text-blue-600 leading-relaxed">
                            {mode === 'image' 
                                ? "Describe the scene, style, and colors for the best image results." 
                                : "Use this tool to write emails, generate business names, or get advice while you earn rewards."}
                        </p>
                    </div>
                </div>

                {/* Main Area */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1 mb-6 overflow-y-auto bg-gray-50 rounded-2xl p-6 border border-gray-100 min-h-[300px]">
                        {generatedImage ? (
                            <div className="animate-fade-in-up flex justify-center h-full items-center">
                                <div className="relative group">
                                    <img src={generatedImage} alt="Generated" className="rounded-2xl shadow-lg max-h-[400px] object-contain border border-gray-200" />
                                    <a 
                                        href={generatedImage} 
                                        download="generated-image.png"
                                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-lg font-bold text-xs shadow-md hover:bg-white transition-colors"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        ) : response ? (
                            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line animate-fade-in-up">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                                        AI
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200">
                                        {response}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                                <span className="text-4xl mb-2">
                                    {mode === 'chat' ? '💬' : mode === 'idea' ? '💡' : '🎨'}
                                </span>
                                <p className="font-bold">
                                    {mode === 'image' ? 'Describe an image to generate.' : 'Ready to help.'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-2xl pl-4 pr-14 py-4 shadow-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none h-16"
                            placeholder={mode === 'image' ? "A futuristic robot painting a canvas..." : (mode === 'chat' ? "Ask me anything..." : "Describe your interests...")}
                            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}}
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-primary hover:bg-purple-800 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {loading ? (
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiPlayground;