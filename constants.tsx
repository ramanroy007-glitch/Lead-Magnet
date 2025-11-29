
import React from 'react';
import type { QuizQuestion, SiteContent, CpaOffer } from './types';

export const DEFAULT_SITE_CONTENT: SiteContent = {
    hero: {
        headline: "Exclusive Market Research.",
        subheadline: "Join our elite panel to test apps, take surveys, and provide feedback on digital products.",
        ctaText: "CHECK ELIGIBILITY"
    },
    features: {
        title: "Participant Benefits",
        subtitle: "How our market research panel works.",
        items: [
            { title: "Verified Studies", desc: "Access legitimate research opportunities." },
            { title: "Fair Compensation", desc: "Get rewarded for your time and data." },
            { title: "Instant Access", desc: "See available studies immediately." },
            { title: "Privacy First", desc: "Your data is anonymized and secure." },
            { title: "Flexible Tasks", desc: "Participate from any device." },
            { title: "Premium Support", desc: "Dedicated team for panelists." }
        ]
    },
    testimonials: [
        { name: "Sarah J.", role: "Panelist", text: "I love testing new apps before they are released. The rewards are a nice bonus!", location: "Verified User" },
        { name: "Marcus R.", role: "Tester", text: "Legit platform. I qualify for about 3-4 studies a week. Good experience so far.", location: "Verified User" },
        { name: "Jessica L.", role: "Participant", text: "Simple interface and quick approval process. Highly recommend.", location: "Verified User" }
    ],
    seoSection: {
        title: "About Natraj Rewards",
        content: "Natraj Rewards is a premier market research recruitment platform. We connect consumers with brands looking for feedback on new products, services, and applications. Our goal is to facilitate valuable insights while rewarding participants for their time."
    },
    finalCta: {
        heading: "Ready to Participate?",
        subheading: "Check if you qualify for our current research studies.",
        buttonText: "APPLY NOW"
    }
};

export const DEFAULT_OFFERS: CpaOffer[] = [
    {
        id: '1',
        title: '$750 Research Study',
        description: 'New participant opportunity. Complete the screener to enter.',
        payout: '$750 VALUE',
        payoutValue: 750,
        popularity: 100,
        ctaText: 'APPLY NOW',
        url: 'https://example.com',
        category: 'sweepstakes',
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=600&q=80',
        instructions: "1. Click Apply.\n2. Complete the short survey.\n3. Enter your details to qualify."
    },
    {
        id: '2',
        title: 'Tech Review Panel',
        description: 'Test the latest gadgets. Provide feedback on usability.',
        payout: 'HARDWARE',
        payoutValue: 1000,
        popularity: 98,
        ctaText: 'ACCESS',
        url: 'https://example.com',
        category: 'app',
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
        instructions: "1. Register.\n2. Verify Address.\n3. Wait for selection."
    },
    {
        id: '3',
        title: 'Consumer Shopper Panel',
        description: 'Get a $500 gift card for your favorite store feedback.',
        payout: '$500 CARD',
        payoutValue: 500,
        popularity: 95,
        ctaText: 'START',
        url: 'https://example.com',
        category: 'sweepstakes',
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
        instructions: "1. Select Store.\n2. Complete Survey.\n3. Get Code."
    },
    {
        id: '4',
        title: 'Gaming Beta Test',
        description: 'Play a new game and reach Level 10 to provide data.',
        payout: 'REWARDS',
        payoutValue: 50,
        popularity: 90,
        ctaText: 'PLAY',
        url: 'https://example.com',
        category: 'app',
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
        instructions: "1. Install App.\n2. Play to Level 10.\n3. Redeem credits."
    }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "Select Primary Device",
    type: 'icon-choice',
    options: [
      { id: 'iphone', text: 'iOS', icon: '📱' },
      { id: 'android', text: 'Android', icon: '🤖' },
      { id: 'desktop', text: 'Desktop', icon: '💻' },
    ],
  },
  {
      id: 2,
      text: 'Interests for Studies?',
      type: 'multiple-choice',
      options: [
          { id: 'gaming', text: 'Gaming & Apps' },
          { id: 'shopping', text: 'Retail & Shopping' },
          { id: 'finance', text: 'Finance & Banking' },
      ]
  },
  {
    id: 3,
    text: 'Reward Preference',
    type: 'icon-choice',
    options: [
      { id: 'paypal', text: 'PayPal', icon: '🅿️' },
      { id: 'giftcard', text: 'Gift Card', icon: '💳' },
      { id: 'check', text: 'Check', icon: '🏦' },
    ],
  }
];
