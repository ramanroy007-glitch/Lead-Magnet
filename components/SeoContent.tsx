
import React from 'react';

interface SeoContentProps {
    content: {
        title: string;
        content: string;
    }
}

const SeoContent: React.FC<SeoContentProps> = ({ content }) => {
  return (
    <section className="py-20 lg:py-32 bg-transparent relative z-0">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Darker Glass Background for Readability */}
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl z-0"></div>
                
                {/* Background Image Effect */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-10 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529927066849-79b791a69825?auto=format&fit=crop&w=1200&q=20')" }}
                ></div>

                {/* Decorative Glows */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px]"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]"></div>

                <div className="relative z-10 p-8 sm:p-12 lg:p-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 font-display tracking-tight leading-tight">
                        {content.title}
                    </h2>
                    <div className="prose prose-invert prose-base sm:prose-lg max-w-none text-slate-300">
                        <p className="leading-relaxed whitespace-pre-line text-lg opacity-90">
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
