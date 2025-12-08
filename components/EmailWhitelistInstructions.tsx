
import React, { useState } from 'react';

type Provider = 'gmail' | 'yahoo' | 'outlook' | 'comcast';

const EmailWhitelistInstructions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Provider>('gmail');

  const instructions = {
    gmail: [
      "Open the email from 'Natraj Rewards'.",
      "Click the 3 dots (⋮) in the top right corner.",
      "Select 'Mark as important' or 'Add to Contacts'.",
      "If it's in Promotions, drag it to the Primary tab."
    ],
    yahoo: [
      "Open the email.",
      "Click the '+' symbol next to the sender's name.",
      "Select 'Add to contacts'.",
      "Click 'Save'."
    ],
    outlook: [
      "Open the email.",
      "Click the 3 dots (...) at the top.",
      "Select 'Add to Safe Senders'.",
      "Click 'OK' to confirm."
    ],
    comcast: [
      "Log into Xfinity Connect.",
      "Click the Address Book tab.",
      "Click 'New Contact'.",
      "Add 'rewards@natrajrewards.com' and click Save."
    ]
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mt-6 text-left shadow-inner">
      <div className="bg-slate-100 border-b border-slate-200 flex overflow-x-auto no-scrollbar">
        {(['gmail', 'yahoo', 'outlook', 'comcast'] as Provider[]).map((p) => (
          <button
            key={p}
            onClick={() => setActiveTab(p)}
            className={`px-4 py-3 text-sm font-bold capitalize transition-colors whitespace-nowrap ${
              activeTab === p 
                ? 'bg-white text-inbox-orange border-b-2 border-inbox-orange' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="p-5">
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-inbox-green animate-pulse"></span>
          Don't miss your reward:
        </h4>
        <ol className="space-y-2">
          {instructions[activeTab].map((step, i) => (
            <li key={i} className="text-sm text-slate-600 flex gap-3">
              <span className="font-mono text-inbox-orange font-bold">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default EmailWhitelistInstructions;
