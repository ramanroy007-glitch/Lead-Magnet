
import React from 'react';

interface SeoContentProps {
    content: {
        title: string;
        content: string;
    }
}

const SeoContent: React.FC<SeoContentProps> = ({ content }) => {
  return (
    <section className="py-20 bg-[#020617]">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/5 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-6 font-display">
                        {content.title}
                    </h2>
                    <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-400">
                        <p className="leading-relaxed whitespace-pre-line">
                            {content.content}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default SeoContent;
