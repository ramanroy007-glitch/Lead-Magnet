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

  // Faster Simulation for high conversion
  useEffect(() => {
    if (step === 'calculating') {
        const sequence = [
            "Analyzing Profile...",
            "Checking Partner Inventory...",
            "Matching High-Ticket Offers...",
            "Match Found!"
        ];
        
        let i = 0;
        setLogs([]);
        const interval = setInterval(() => {
            if (i < sequence.length) {
                setLogs(prev => [...prev.slice(-2), sequence[i]]);
                i++;
            }
        }, 500); // Faster ticks

        // Reduced wait time from 5.5s to 2.5s to reduce bounce rate
        const timer = setTimeout(() => setStep('email'), 2500); 
        
        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }
  }, [step]);

  const handleOptionSelect = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    const currentStepIndex = step as number;
    if (currentStepIndex < config.questions.length - 1) {
        setStep(currentStepIndex + 1);
    } else {
        setStep('calculating');
    }
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
                <h3 className="text-xl md:text-3xl font-display font-bold text-slate-900 mb-2 md:mb-3 tracking-tight leading-tight">{q.text}</h3>
                <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 font-medium leading-relaxed">{q.subtext}</p>
                
                <div className="space-y-3 md:space-y-4">
                    {q.options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionSelect(q.id, opt.id)}
                            className="w-full p-4 md:p-5 text-left rounded-xl md:rounded-2xl bg-white border-2 border-slate-100 hover:border-nat-teal hover:bg-nat-teal/5 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 active:scale-95 group flex items-center gap-4 relative overflow-hidden"
                        >
                            <div className="relative w-10 h-10 md:w-14 md:h-14 bg-slate-100 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl group-hover:bg-white transition-all duration-300 shrink-0">
                                {opt.icon}
                            </div>
                            <div className="flex-1 z-10">
                                <span className="font-bold text-slate-700 text-sm md:text-lg group-hover:text-nat-teal transition-colors">{opt.text}</span>
                            </div>
                            <div className="relative z-10 text-slate-300 group-hover:text-nat-teal transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="w-full flex flex-col justify-center relative z-10 p-2 md:p-4">
        
        {step !== 'calculating' && step !== 'email' && (
             <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-10 min-h-[50vh] md:min-h-[550px] flex flex-col relative overflow-hidden shadow-xl border border-slate-100">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-slate-100">
                    <div 
                        className="h-full bg-gradient-to-r from-nat-teal to-brand-primary transition-all duration-500 ease-out"
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
                
                <div className="relative z-10 text-center mb-8">
                     <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-2 tracking-tight">AI Agent Working...</h3>
                     <p className="text-slate-500 font-medium text-sm">Matching your profile with premium partners.</p>
                </div>
                
                {/* Spinner */}
                <div className="relative w-24 h-24 mb-8 z-10 flex items-center justify-center">
                     <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-nat-teal border-t-transparent rounded-full animate-spin"></div>
                     <div className="text-4xl animate-pulse">⚡</div>
                </div>

                <div className="w-full max-w-xs space-y-2 text-center">
                    {logs.map((log, i) => (
                        <div key={i} className="text-nat-teal text-sm font-bold animate-fade-in">
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {step === 'email' && (
            <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-12 shadow-2xl min-h-[50vh] md:min-h-[500px] flex flex-col justify-center text-center max-w-lg mx-auto w-full border-t-8 border-nat-teal relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce shadow-sm text-green-500 border border-green-100">
                        💰
                    </div>
                    <h3 className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-3 tracking-tight">Matches Found!</h3>
                    <p className="text-slate-500 text-sm md:text-base mb-8 max-w-xs mx-auto leading-relaxed">
                        Enter your email to instantly unlock your rewards dashboard.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <input 
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative w-full px-5 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 outline-none focus:border-nat-teal focus:ring-4 focus:ring-nat-teal/10 transition-all text-center font-bold text-lg"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-nat-teal hover:bg-nat-teal-dim text-nat-dark font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? "Unlocking..." : "SEE MY REWARDS >>"}
                        </button>
                        <p className="text-[10px] text-slate-400 mt-6 font-medium">
                            By clicking, you agree to our Terms. Your data is secure.
                        </p>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default QuizFlow;