
import React, { useState, useEffect } from 'react';
import type { UserAnswers } from '../types';
import { QUIZ_QUESTIONS } from '../constants';

interface QuizFlowProps {
  onQuizComplete: () => void;
  initialEmail?: string;
}

type QuizStep = 'question_1' | 'question_2' | 'question_3' | 'scanning' | 'success';

const QuizFlow: React.FC<QuizFlowProps> = ({ onQuizComplete, initialEmail }) => {
  const [step, setStep] = useState<QuizStep>('question_1');
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [scanStage, setScanStage] = useState('Initializing...');
  
  // Form State
  const [email, setEmail] = useState(initialEmail || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes

  // Dynamic Scan Logic
  useEffect(() => {
    if (step === 'scanning') {
      const stages = [
        { text: `Analyzing Profile Matches...` },
        { text: 'Filtering High-Paying Opportunities...' },
        { text: `Verifying Eligibility...` },
        { text: 'Application Pre-Approved.' }
      ];

      let currentStage = 0;
      const interval = setInterval(() => {
        if (currentStage >= stages.length) {
          clearInterval(interval);
          setTimeout(() => setStep('success'), 500);
          return;
        }
        setScanStage(stages[currentStage].text);
        currentStage++;
      }, 800); 

      return () => clearInterval(interval);
    }
  }, [step]);

  // Timer for Urgency in Success Step
  useEffect(() => {
      if (step === 'success' && timer > 0) {
          const t = setInterval(() => setTimer(prev => prev - 1), 1000);
          return () => clearInterval(t);
      }
  }, [step, timer]);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      if (step === 'question_1') setStep('question_2');
      else if (step === 'question_2') setStep('question_3');
      else if (step === 'question_3') setStep('scanning');
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsProcessing(true);
    
    // 1. Create Lead Object
    const newLead = {
        id: new Date().toISOString(),
        name: 'Applicant', 
        email: email,
        quizAnswers: answers,
        submittedAt: new Date().toISOString(),
        status: 'new'
    };

    // 2. Save Locally (Backup)
    try {
        const existing = localStorage.getItem('emailLeads');
        const localLeads = existing ? JSON.parse(existing) : [];
        localLeads.push(newLead);
        localStorage.setItem('emailLeads', JSON.stringify(localLeads));
    } catch (e) {
        console.error("Local storage error", e);
    }

    // 3. Fire Webhook (Send to Zapier/Make)
    try {
        const smtpsStr = localStorage.getItem('crm_smtps');
        if (smtpsStr) {
            const smtps = JSON.parse(smtpsStr);
            const webhookProfile = smtps.find((s: any) => s.provider === 'webhook');
            
            if (webhookProfile && webhookProfile.host) {
                // Use fetch to send data to the webhook
                // mode: 'no-cors' allows sending to external domains without blocking, 
                // though we won't see the response. reliable for Zapier hooks.
                await fetch(webhookProfile.host, {
                    method: 'POST',
                    mode: 'no-cors', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newLead),
                });
            }
        }
    } catch (e) {
        console.warn("Webhook logic failed", e);
    }

    // 4. Proceed to Offers
    setTimeout(() => {
        setIsProcessing(false);
        onQuizComplete();
    }, 800);
  };

  const currentQuestion = QUIZ_QUESTIONS.find(q => 
    (step === 'question_1' && q.id === 1) || 
    (step === 'question_2' && q.id === 2) || 
    (step === 'question_3' && q.id === 3)
  );

  return (
    <div className="w-full bg-[#1a1d29] rounded-3xl overflow-hidden flex flex-col relative max-w-lg mx-auto min-h-[500px] shadow-2xl border border-white/10 font-sans">
      
      {/* Header */}
      <div className="bg-[#14161f] p-4 text-center border-b border-white/5 flex justify-between items-center px-6">
        <h3 className="font-bold uppercase text-xs tracking-widest text-slate-400">
            {step === 'success' ? 'Final Step' : 'Eligibility Check'}
        </h3>
        {step === 'success' && (
            <div className="text-xs font-bold text-red-500 animate-pulse">
                Expiring: {formatTime(timer)}
            </div>
        )}
      </div>

      <div className="flex-1 p-8 flex flex-col justify-center relative z-10">

        {/* --- QUESTIONS --- */}
        {currentQuestion && (
          <div className="animate-fade-in-up w-full text-center">
            
            <h3 className="text-2xl sm:text-3xl text-white font-black mb-8 tracking-tight">{currentQuestion.text}</h3>
            
            <div className={`gap-4 ${currentQuestion.type === 'multiple-choice' && currentQuestion.id === 3 ? 'grid grid-cols-1' : 'flex flex-col'}`}>
               {currentQuestion.options.map(opt => (
                 <button 
                    key={opt.id}
                    onClick={() => handleAnswer(currentQuestion.id, opt.id)}
                    className="group bg-white/5 hover:bg-white/10 border-2 border-transparent hover:border-brand-primary rounded-2xl p-5 text-left transition-all duration-200 shadow-sm flex items-center justify-between"
                 >
                    <div className="flex items-center gap-4">
                        {opt.icon && <span className="text-2xl">{opt.icon}</span>}
                        <span className="text-slate-300 font-bold group-hover:text-white text-lg">{opt.text}</span>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-brand-primary group-hover:bg-brand-primary flex items-center justify-center">
                        <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                 </button>
               ))}
            </div>
          </div>
        )}

        {/* --- SCANNING --- */}
        {step === 'scanning' && (
           <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up w-full">
              <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-brand-primary animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-500">AI</div>
              </div>
              
              <h3 className="text-xl text-white font-black mb-2">{scanStage}</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">Matching your profile with 15+ partners...</p>
           </div>
        )}

        {/* --- SUCCESS / EMAIL (The Lead Capture) --- */}
        {step === 'success' && (
           <div className="animate-fade-in-up h-full flex flex-col justify-between relative">
              
              <div className="text-center mb-6">
                 <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full mb-4 border border-green-500/30">
                     Matches Found: 15+
                 </div>
                 <h2 className="text-3xl font-black text-white mb-2">Access Granted!</h2>
                 <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Your spot is reserved for <span className="text-red-400 font-bold">{formatTime(timer)}</span>. Enter your email to instantly unlock your dashboard.
                 </p>
              </div>

               {/* Email Form */}
               <form onSubmit={handleSubmit} className="space-y-4">
                   <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-2">Email Address</label>
                       <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border border-white/20 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-bold text-white placeholder-slate-600 text-lg bg-black/40"
                            placeholder="name@example.com"
                       />
                   </div>

                   <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 rounded-xl bg-brand-primary hover:bg-[#004199] text-white font-black text-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3"
                   >
                       {isProcessing ? 'Securing Spot...' : 'Unlock My Rewards'}
                   </button>
                   
                   <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                       Secure 256-bit SSL Connection.
                   </p>
               </form>
           </div>
        )}

      </div>
    </div>
  );
};

export default QuizFlow;
