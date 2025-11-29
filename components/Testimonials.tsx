import React from 'react';

interface TestimonialsProps {
    content: Array<{
        name: string;
        role: string;
        text: string;
        location: string;
    }>;
}

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Members Say
            </h2>
            <p className="text-gray-500">Join a community of thousands of happy earners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(star => (
                            <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                    </div>
                    <p className="text-gray-600 italic mb-6 leading-relaxed min-h-[80px]">
                        "{t.text}"
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                            {t.name.charAt(0)}
                        </div>
                        <div>
                            <div className="text-gray-900 font-bold text-sm">{t.name}</div>
                            <div className="text-xs text-gray-500">
                                {t.role} • {t.location}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;