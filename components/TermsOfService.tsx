import React from 'react';

const TermsOfService: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
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
            <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
            <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-invert prose-slate prose-headings:font-bold">
                <h3>1. Acceptance of Terms</h3>
                <p>
                By accessing Natraj Rewards and applying to our panel, you agree to these Terms. If you do not agree, please do not use our services.
                </p>

                <h3>2. Eligibility</h3>
                <p>
                You must be at least 18 years old to participate in our studies. By applying, you represent and warrant that you meet this age requirement.
                </p>
                
                <h3>3. Participation & Rewards</h3>
                <p>
                Participation in studies is voluntary. Rewards are distributed solely upon the successful completion and verification of a study. We reserve the right to withhold rewards if we detect fraudulent activity or low-quality responses (e.g., rushing through surveys).
                </p>

                <h3>4. Limitation of Liability</h3>
                <p>
                Nataraj Innovations is a recruitment platform. We are not responsible for the actual products or services you may test during a third-party study.
                </p>

                <h3>5. Termination</h3>
                <p>
                We reserve the right to terminate your account if you violate these terms or provide false information during the screening process.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;