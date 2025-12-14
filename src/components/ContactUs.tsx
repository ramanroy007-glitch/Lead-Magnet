
import React, { useState } from 'react';

const ContactUs: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
        setStatus('sent');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
        {status === 'sent' ? (
            <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-2xl text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Received</h3>
                <p className="text-slate-300">Our support team will respond within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-nat-teal hover:underline font-bold">Send another message</button>
            </div>
        ) : (
            <>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                    Have questions about your rewards? Need help with a specific offer? 
                    Our dedicated support team is here to assist you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="font-bold text-white text-lg mb-2">General Inquiries</h3>
                        <p className="text-slate-400 text-sm mb-4">For account questions and general help.</p>
                        <a href="mailto:support@natrajrewards.com" className="text-nat-teal font-bold hover:underline">support@natrajrewards.com</a>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="font-bold text-white text-lg mb-2">Partnerships</h3>
                        <p className="text-slate-400 text-sm mb-4">For advertisers and affiliate networks.</p>
                        <a href="mailto:partners@natrajrewards.com" className="text-nat-teal font-bold hover:underline">partners@natrajrewards.com</a>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Your Name</label>
                            <input required className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-nat-teal outline-none transition-colors" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                            <input required type="email" className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-nat-teal outline-none transition-colors" placeholder="john@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subject</label>
                        <select className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-nat-teal outline-none transition-colors">
                            <option>Missing Reward Credit</option>
                            <option>Account Issue</option>
                            <option>Report Broken Offer</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Message</label>
                        <textarea required rows={5} className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-nat-teal outline-none transition-colors" placeholder="Describe your issue..."></textarea>
                    </div>
                    <button disabled={status === 'sending'} className="w-full py-4 bg-nat-teal hover:bg-cyan-400 text-nat-dark font-black text-lg rounded-xl shadow-lg transition-all transform active:scale-95">
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </>
        )}
    </div>
  );
};

export default ContactUs;
