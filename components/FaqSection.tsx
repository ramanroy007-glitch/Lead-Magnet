import React, { useState } from 'react';

const faqs = [
  {
    question: "Is there a cost to join?",
    answer: "No. Prime Insights is a market research recruitment platform. We are hired by brands to find qualified participants. You will never be asked to pay to join our panel."
  },
  {
    question: "How is my data used?",
    answer: "We take data privacy seriously. Your demographic information is used solely to match you with relevant research studies (e.g., matching pet owners with pet food studies). We do not sell your personal contact information to telemarketers."
  },
  {
    question: "What kind of compensation is offered?",
    answer: "Incentives vary by study type and length. Common rewards include digital gift cards, prepaid Visa cards, or direct bank transfers via partners like PayPal. Specific compensation details are always provided before you accept a study."
  },
  {
    question: "Why do I need to apply?",
    answer: "To ensure data quality for our clients, we screen all applicants. We look for real, attentive users who can provide thoughtful feedback. Duplicate accounts or bots are automatically rejected."
  }
];

const FaqItem: React.FC<{ faq: { question: string, answer: string } }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-6 px-6 focus:outline-none hover:bg-slate-50 transition-colors group"
      >
        <span className="font-bold text-brand-navy text-lg group-hover:text-brand-green transition-colors">{faq.question}</span>
        <span className={`ml-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pb-8 px-6 pt-0">
          <p className="text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="py-24 w-full bg-slate-50">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500">Transparency is our core value.</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {faqs.map((faq, index) => (
            <FaqItem key={index} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;