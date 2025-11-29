import React from 'react';
import type { Page } from '../types';

const PrivacyPolicy: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full bg-black min-h-screen text-slate-300">
      <div className="bg-white/5 border-b border-white/10 py-4 px-6 mb-8">
          <div className="container mx-auto max-w-3xl">
             <button 
                onClick={onBack}
                className="text-cyan-400 font-bold flex items-center gap-2 hover:text-white transition-colors"
             >
                 &larr; Back to Home
             </button>
          </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 sm:p-12 rounded-3xl shadow-sm">
            <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-invert prose-slate prose-headings:font-bold prose-a:text-cyan-400">
                <h3>1. Introduction</h3>
                <p>
                At Nataraj Innovations ("Natraj Rewards"), we take your privacy seriously. This policy explains how we handle your data when you apply for our user research panel. We are committed to transparency and complying with applicable data protection laws.
                </p>

                <h3>2. Information Collection</h3>
                <p>
                We collect basic demographic information (name, email, device usage habits) solely for the purpose of matching you with relevant research studies. We do not collect sensitive financial information like credit card numbers or social security numbers.
                </p>

                <h3>3. Data Usage</h3>
                <p>
                Your data is used to:
                </p>
                <ul>
                    <li>Verify your eligibility for specific studies.</li>
                    <li>Contact you with study invitations.</li>
                    <li>Process compensation for completed studies.</li>
                </ul>
                
                <h3>4. Third-Party Sharing</h3>
                <p>
                We do not sell your personal email address to spam lists. We may share anonymized demographic data with our research partners to verify panel diversity.
                </p>
                
                <h3>5. Contact Us</h3>
                <p>
                If you have questions about this policy, please contact us at <a href="mailto:contact@natraj.com">contact@natraj.com</a>.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;