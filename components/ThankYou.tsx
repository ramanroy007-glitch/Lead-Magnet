import React from 'react';
import type { SmartLead } from '../types';

interface ThankYouProps {
  lead: SmartLead;
}

const ThankYou: React.FC<ThankYouProps> = ({ lead }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-brand-light/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-card animate-fade-in-up">
         
         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-inner">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         </div>

         <h1 className="text-3xl font-extrabold text-brand-navy mb-4">Application Complete!</h1>
         <p className="text-gray-500 mb-2">
            Your profile has been successfully submitted. We've sent a confirmation to:
         </p>
         <p className="font-bold text-brand-navy mb-8">{lead.email}</p>
         
         <div className="mt-8 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-gray-200 border-t-brand-primary rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 mt-4">Redirecting you to your best match...</p>
         </div>
      </div>
    </div>
  );
};

export default ThankYou;
