
import React, { useState, useEffect } from 'react';
import { saveLead } from '../services/smartCapture';
import type { SmartLead, QuizConfig } from '../types';
import EmailWhitelistInstructions from './EmailWhitelistInstructions';
import { fireConfetti } from '../services/confetti';

interface QuizFlowProps {
  onQuizComplete: (lead: SmartLead) => void;
  initialEmail?: string;
  config: QuizConfig;
}

type Step = number | 'calculating' | 'email' | 'bridge';

const QuizFlow: React.FC<QuizFlowProps> = ({ onQuizComplete, initialEmail, config }) => {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState(initialEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedLead, setCapturedLead] = useState<SmartLead | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Simulation for calculation step
  useEffect(() => {
    if (step === 'calculating') {
        const sequence = [
            "Initializing AI Match Engine...",
            "Scanning Partner Inventory...",
            "Verifying Geographic Eligibility...",
            "Filtering High-Ticket Offers...",
            "Optimizing Payout Structure...",
            "Match Confirmed."
        ];
        
        let i = 0;
        setLogs([]); // Reset logs
        const interval = setInterval(() => {
            if (i < sequence.length) {
                setLogs(prev => {
                    const newLogs = [...prev, sequence[i]];
                    return newLogs.slice(-4); // Keep last 4 logs to prevent overflow
                });
                i++;
            }
        }, 800);

        setTimeout(() => setStep('email'), 5500); 
        return () => clearInterval(interval);
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
      
      const lead = await saveLead(email, 'quiz_flow', answers);
      setCapturedLead(lead);
      
      setTimeout(() => {
          setIsSubmitting(false);
          setStep('bridge'); 
          fireConfetti(); // Trigger dopamine release
      }, 1500);
  };

  const handleBridgeContinue = () => {
      if (capturedLead) onQuizComplete(capturedLead);
  };

  const calculateProgress = () => {
      if (typeof step === 'number') {
          return ((step + 1) / (config.questions.length + 2)) * 100;
      }
      if (step === 'calculating') return 80;
      if (step === 'email') return 90;
      return 100;
  };

  const renderQuestion = (qIndex: number) => {
      const q = config.questions[qIndex];
      if (!q) return null;

      return (
        <div className="animate-slide-up w-full max-w-lg mx-auto flex flex-col h-full">
            <div className="flex-1">
                <h3 className="text-xl md:text-3xl font-black text-slate-800 mb-2 md:mb-3 tracking-tight leading-tight">{q.text}</h3>
                <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 font-medium leading-relaxed">{q.subtext}</p>
                
                <div className="space-y-3 md:space-y-4">
                    {q.options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionSelect(q.id, opt.id)}
                            className="w-full p-4 md:p-5 text-left rounded-xl md:rounded-2xl bg-white border-2 border-slate-100 shadow-sm hover:border-inbox-orange/50 hover:shadow-[0_8px_30px_rgb(243,109,54,0.1)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] active:scale-95 group flex items-center gap-4 relative overflow-hidden touch-manipulation"
                        >
                            {/* Gradient Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative w-10 h-10 md:w-14 md:h-14 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-inner group-hover:bg-white group-hover:shadow-md transition-all duration-300 shrink-0">
                                {opt.icon}
                            </div>
                            <div className="flex-1 z-10">
                                <span className="font-bold text-slate-700 text-sm md:text-lg group-hover:text-inbox-orange transition-colors">{opt.text}</span>
                            </div>
                            <div className="relative z-10 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-inbox-orange hidden sm:block">
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      );
  };

  if (step === 'bridge') {
      return (
          <div className="bg-white/95 backdrop-blur-xl p-4 md:p-8 flex flex-col items-center text-center animate-slide-up rounded-2xl md:rounded-3xl relative max-w-md mx-auto shadow-2xl border border-white/50 ring-1 ring-slate-100 max-h-[85vh] overflow-y-auto">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 md:mb-4 animate-bounce-slow shadow-lg shadow-green-200 shrink-0">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tight">Account Created!</h2>
              
              <div className="w-full mb-4">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
                    <div className="relative shrink-0">
                        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full absolute top-0 left-0 animate-ping"></span>
                        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full relative z-10 block"></span>
                    </div>
                    <div className="text-left overflow-hidden">
                        <p className="text-orange-800 font-bold text-xs uppercase tracking-wider">Status: Pending Verification</p>
                        <p className="text-slate-600 text-xs truncate w-full">
                            Confirmation sent to <span className="font-bold text-slate-800">{email}</span>
                        </p>
                    </div>
                </div>
              </div>

              {/* Whitelist Instructions - Compact wrapper */}
              <div className="w-full mb-4 shrink-0 overflow-hidden">
                 <EmailWhitelistInstructions />
              </div>
              
              <div className="mt-auto w-full space-y-3 shrink-0">
                <button 
                    onClick={handleBridgeContinue}
                    className="w-full py-3.5 md:py-4 bg-gradient-to-r from-inbox-orange to-orange-600 text-white font-bold text-base md:text-lg rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all active:scale-[0.98] touch-manipulation animate-pulse"
                >
                    Continue to Offers &rarr;
                </button>
                <p className="text-[10px] text-slate-400 font-medium">
                    You can verify your email later to unlock VIP payouts.
                </p>
              </div>
          </div>
      );
  }

  return (
    <div className="w-full flex flex-col justify-center relative z-10 p-2 md:p-4">
        
        {step !== 'calculating' && step !== 'email' && (
             <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-5 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] min-h-[50vh] md:min-h-[550px] flex flex-col border border-white/50 relative overflow-hidden transition-all duration-500">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                    <div 
                        className="h-full bg-gradient-to-r from-inbox-orange to-purple-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(243,109,54,0.5)]"
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>

                <div className="mt-4 h-full flex flex-col justify-center">
                    {renderQuestion(step as number)}
                </div>
             </div>
        )}

        {step === 'calculating' && (
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-6 md:p-10 shadow-2xl min-h-[50vh] md:min-h-[500px] flex flex-col items-center justify-center font-mono text-sm max-w-lg mx-auto w-full border border-white/50 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
                
                <div className="relative z-10 text-center mb-8">
                     <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2 tracking-tight">AI Agent Working...</h3>
                     <p className="text-slate-500 font-medium text-sm">Matching your profile with premium partners.</p>
                </div>
                
                {/* CSS AI Loader - No Lottie */}
                <div className="relative w-32 h-32 mb-8 z-10 flex items-center justify-center">
                     <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                     <div className="absolute inset-4 border-4 border-purple-400 border-b-transparent rounded-full animate-spin-reverse"></div>
                     <div className="text-4xl animate-pulse">🤖</div>
                </div>

                <div className="w-full max-w-xs space-y-2 text-left bg-white/80 p-4 rounded-xl border border-slate-100 shadow-xl relative z-10">
                    {logs.map((log, i) => (
                        <div key={i} className="text-green-600 text-xs font-bold animate-fade-in flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            {log}
                        </div>
                    ))}
                    <div className="flex items-center gap-2 text-slate-400 text-xs border-t border-slate-100 pt-2 mt-2">
                        <div className="h-3 w-3 border-2 border-slate-300 border-t-inbox-blue rounded-full animate-spin"></div>
                        Processing Data...
                    </div>
                </div>
            </div>
        )}

        {step === 'email' && (
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-6 md:p-12 shadow-2xl min-h-[50vh] md:min-h-[500px] flex flex-col justify-center text-center max-w-lg mx-auto w-full border-t-4 md:border-t-8 border-inbox-green relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl md:text-4xl animate-bounce shadow-lg border-4 border-white">
                        🔒
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">{config.emailStepTitle}</h3>
                    <p className="text-slate-500 text-sm md:text-base mb-8 max-w-xs mx-auto leading-relaxed">{config.emailStepSubtext}</p>
                

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                            <input 
                                type="email"
                                required
                                placeholder="Enter your best email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative w-full px-5 py-4 md:py-5 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 outline-none focus:border-inbox-green focus:ring-4 focus:ring-green-500/10 transition-all text-center font-bold text-lg shadow-sm"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 md:py-5 bg-gradient-to-r from-inbox-green to-green-600 hover:to-green-700 text-white font-black text-lg md:text-xl rounded-2xl shadow-xl shadow-green-500/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Securing Spot...
                                </>
                            ) : "View My Matches"}
                        </button>
                        <p className="text-[10px] text-slate-400 mt-6 font-medium">
                            By clicking, you agree to receive matching offers. No spam.
                        </p>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default QuizFlow;
