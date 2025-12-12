
import React, { useState, useEffect } from 'react';
import { saveLead } from '../services/smartCapture';
import type { SmartLead, QuizConfig } from '../types';

interface QuizFlowProps {
  onQuizComplete: (lead: SmartLead) => void;
  initialEmail?: string;
  config: QuizConfig;
}

type Step = number | 'calculating' | 'email';

const QuizFlow: React.FC<QuizFlowProps> = ({ onQuizComplete, initialEmail, config }) => {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState(initialEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progressValue, setProgressValue] = useState(0);

  // Faster Simulation for high conversion
  useEffect(() => {
    if (step === 'calculating') {
        const sequence = [
            "Analyzing Profile Data...",
            "Checking Location Eligibility...",
            "Ping: Survey_Network_A [Success]",
            "Ping: Advertiser_Exchange_V2 [Success]",
            "Matching High-Ticket Offers...",
            "Finalizing Dashboard..."
        ];
        
        let i = 0;
        setLogs([]);
        
        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgressValue(old => {
                if (old >= 100) return 100;
                return old + 2; // reaches 100 in roughly 2.5s (50 ticks * 50ms)
            });
        }, 50);

        const logInterval = setInterval(() => {
            if (i < sequence.length) {
                setLogs(prev => [...prev.slice(-3), sequence[i]]);
                i++;
            }
        }, 400); 

        // Reduced wait time from 5.5s to 2.5s to reduce bounce rate
        const timer = setTimeout(() => setStep('email'), 2800); 
        
        return () => {
            clearInterval(progressInterval);
            clearInterval(logInterval);
            clearTimeout(timer);
        };
    }
  }, [step]);

  const handleOptionSelect = (key: string, value: string) => {
    // 1. Visually select immediately
    setAnswers(prev => ({ ...prev, [key]: value }));
    
    // 2. Delay slightly for visual feedback before moving next
    setTimeout(() => {
        const currentStepIndex = step as number;
        if (currentStepIndex < config.questions.length - 1) {
            setStep(currentStepIndex + 1);
        } else {
            setStep('calculating');
        }
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return;
      setIsSubmitting(true);
      
      // Fire and forget - Don't wait for API to be perfect, just move them
      try {
        const lead = await saveLead(email, 'quiz_flow', answers);
        onQuizComplete(lead);
      } catch (e) {
        // Even if save fails, move user to offers (don't block money)
        const fallbackLead: SmartLead = { 
            id: 'temp', email, source: 'quiz_flow', timestamp: new Date().toISOString(), 
            device: 'unknown', status: 'failed' 
        };
        onQuizComplete(fallbackLead);
      }
  };

  const calculateProgress = () => {
      if (typeof step === 'number') {
          return ((step + 1) / (config.questions.length + 2)) * 100;
      }
      if (step === 'calculating') return 80;
      if (step === 'email') return 95;
      return 100;
  };

  const renderQuestion = (qIndex: number) => {
      const q = config.questions[qIndex];
      if (!q) return null;

      return (
        <div className="animate-slide-up w-full max-w-lg mx-auto flex flex-col h-full">
            <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 mb-2 tracking-tight leading-tight">{q.text}</h3>
                <p className="text-sm md:text-base text-slate-500 mb-8 font-medium leading-relaxed">{q.subtext}</p>
                
                <div className="space-y-4">
                    {q.options.map(opt => {
                        const isSelected = answers[q.id] === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => handleOptionSelect(q.id, opt.id)}
                                className={`w-full p-4 md:p-5 text-left rounded-2xl border-2 transition-all duration-200 transform active:scale-95 group flex items-center gap-4 relative overflow-hidden
                                    ${isSelected 
                                        ? 'border-nat-teal bg-nat-teal/5 shadow-md scale-[1.02]' 
                                        : 'border-slate-100 bg-white hover:border-nat-teal/50 hover:bg-slate-50 hover:shadow-lg'
                                    }
                                `}
                            >
                                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 shrink-0
                                    ${isSelected ? 'bg-white shadow-sm scale-110' : 'bg-slate-100 group-hover:bg-white'}
                                `}>
                                    {opt.icon}
                                </div>
                                <div className="flex-1 z-10">
                                    <span className={`font-bold text-lg transition-colors ${isSelected ? 'text-nat-dark' : 'text-slate-700'}`}>
                                        {opt.text}
                                    </span>
                                </div>
                                <div className={`relative z-10 transition-colors ${isSelected ? 'text-nat-teal' : 'text-slate-200 group-hover:text-nat-teal/50'}`}>
                                    {isSelected ? (
                                        <svg className="w-7 h-7 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="w-full flex flex-col justify-center relative z-10 p-2 md:p-4">
        
        {step !== 'calculating' && step !== 'email' && (
             <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-10 min-h-[60vh] md:min-h-[550px] flex flex-col relative overflow-hidden shadow-2xl border border-slate-100">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-slate-50">
                    <div 
                        className="h-full bg-gradient-to-r from-nat-teal to-brand-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>

                <div className="mt-6 h-full flex flex-col justify-center">
                    {renderQuestion(step as number)}
                </div>
             </div>
        )}

        {step === 'calculating' && (
            <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-10 min-h-[50vh] md:min-h-[500px] flex flex-col items-center justify-center font-mono text-sm max-w-lg mx-auto w-full relative overflow-hidden shadow-2xl border border-slate-100">
                
                <div className="relative z-10 text-center mb-8 w-full">
                     <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-2 tracking-tight">AI Agent Working...</h3>
                     <p className="text-slate-500 font-medium text-sm mb-6">Matching your profile with premium partners.</p>
                     
                     {/* The Progress Line */}
                     <div className="w-full max-w-xs mx-auto h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                         <div 
                            className="h-full bg-nat-teal relative overflow-hidden transition-all duration-75"
                            style={{ width: `${progressValue}%` }}
                         >
                             <div className="absolute inset-0 bg-white/30 w-full animate-shine"></div>
                         </div>
                     </div>
                </div>
                
                {/* Tech Visual */}
                <div className="grid grid-cols-4 gap-2 mb-8 opacity-20">
                     {[...Array(16)].map((_, i) => (
                         <div key={i} className={`w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-nat-teal animate-pulse' : 'bg-slate-300'}`} style={{ animationDelay: `${i * 100}ms`}}></div>
                     ))}
                </div>

                <div className="w-full max-w-xs space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {logs.map((log, i) => (
                        <div key={i} className="text-slate-600 text-xs font-bold flex items-center gap-2 animate-fade-in">
                            <span className="text-green-500">✓</span> {log}
                        </div>
                    ))}
                    <div className="text-nat-teal text-xs animate-pulse">_</div>
                </div>
            </div>
        )}

        {step === 'email' && (
            <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-12 shadow-2xl min-h-[50vh] md:min-h-[500px] flex flex-col justify-center text-center max-w-lg mx-auto w-full border-t-8 border-nat-teal relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce shadow-lg shadow-green-100 text-green-500 border border-green-100">
                        🎉
                    </div>
                    <h3 className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-2 tracking-tight">You Qualify!</h3>
                    <p className="text-slate-500 text-sm md:text-base mb-8 max-w-xs mx-auto leading-relaxed">
                        We found <span className="text-nat-dark font-black bg-yellow-200 px-1 rounded">3 Premium Offers</span> matching your profile. Enter your email to unlock them.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-6 w-6 text-slate-400 group-focus-within:text-nat-teal transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                            </div>
                            <input 
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative w-full pl-12 pr-5 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 outline-none focus:border-nat-teal focus:ring-4 focus:ring-nat-teal/10 transition-all font-bold text-lg"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-nat-teal hover:bg-nat-teal-dim text-nat-dark font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-6 w-6 text-nat-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Unlocking...
                                </>
                            ) : "SEE MY REWARDS >>"}
                        </button>
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                SSL Secure
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">No Spam Guarantee</span>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default QuizFlow;
