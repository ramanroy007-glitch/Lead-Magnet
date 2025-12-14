
import type { CpaOffer, SiteContentConfig, QuizConfig, SmtpConfig } from './types';

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
    hero: {
        headline: "Unlock Your Earning Potential Today.",
        subheadline: "Access exclusive offers for top-tier sweepstakes, high-paying surveys, and premium financial products. Your next reward is just a click away.",
        ctaText: "CHECK ELIGIBILITY",
        trustText: "OFFICIAL PARTNER NETWORK"
    },
    quiz: {
        step1Title: "Personalize Your Offers",
        step2Title: "Select Interests",
        emailTitle: "Unlock Your Dashboard"
    },
    colors: {
        primary: "#F97316", // Vibrant Orange
        secondary: "#4F46E5"
    }
};

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
    questions: [
        {
            id: 'earning_goal',
            text: "What's your primary goal?",
            subtext: "This helps our AI find the perfect opportunities for you.",
            options: [
                { id: 'side_cash', text: 'Earn Extra Side Cash', icon: '💵' },
                { id: 'win_prizes', text: 'Enter Sweepstakes', icon: '🎉' },
                { id: 'save_money', text: 'Save Money on Bills', icon: '💰' },
                { id: 'free_samples', text: 'Product Testing', icon: '📦' },
            ]
        },
        {
            id: 'interest',
            text: "Which offers are you most interested in?",
            subtext: "Select all that apply for the best matches.",
            options: [
                { id: 'surveys', text: 'Paid Surveys', icon: '📝' },
                { id: 'insurance', text: 'Insurance Quotes', icon: '🛡️' },
                { id: 'gaming', text: 'Mobile Apps', icon: '📱' },
                { id: 'finance', text: 'Credit & Loans', icon: '💳' },
            ]
        }
    ],
    emailStepTitle: "Your Exclusive Offers Are Ready!",
    emailStepSubtext: "Enter your email to unlock your personalized dashboard of high-value rewards."
};

export const DEFAULT_SMTP_CONFIG: SmtpConfig = { provider: 'none', host: 'smtp.sendgrid.net', port: 587, user: 'apikey', pass: '', fromEmail: 'rewards@natrajrewards.com' };
export const QUIZ_QUESTIONS = DEFAULT_QUIZ_CONFIG.questions;

// UPDATED: High-Reliability Images for Trust - Verified Unsplash IDs
export const DEFAULT_OFFERS: CpaOffer[] = [ 
    { 
        id: '1', 
        offerType: 'link', 
        title: 'Opinion Outpost: Paid Surveys', 
        url: 'https://google.com', 
        is_active: true, 
        weight: 100, 
        category: 'Research', 
        payout: '$5.00/Survey', 
        description: 'Share your opinion on new tech products. Instant payout via PayPal.', 
        imageUrl: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=400&q=80', // Woman on laptop
        ctaText: 'Start Survey', 
        popularity: 94 
    }, 
    { 
        id: '2', 
        offerType: 'link', 
        title: 'Credit Sesame - Free Score', 
        url: 'https://google.com', 
        is_active: true, 
        weight: 95, 
        category: 'Finance', 
        payout: 'Free Report', 
        description: 'Check your credit score instantly. No credit card required.', 
        imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80', // Money/Finance
        ctaText: 'View Score', 
        popularity: 98
    }, 
    { 
        id: '3', 
        offerType: 'link', 
        title: 'Auto Insurance Savings', 
        url: 'https://google.com', 
        is_active: true, 
        weight: 90, 
        category: 'Insurance', 
        payout: 'Save $500+', 
        description: 'Compare rates from top providers in your area in under 2 minutes.', 
        imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80', // Car
        ctaText: 'Get Quote', 
        popularity: 88 
    },
    { 
        id: '4', 
        offerType: 'link', 
        title: 'Nielsen Mobile Panel', 
        url: 'https://google.com', 
        is_active: true, 
        weight: 85, 
        category: 'Apps', 
        payout: '$50/Year', 
        description: 'Install the secure app and earn rewards just for keeping it installed.', 
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80', // Mobile Phone
        ctaText: 'Install App', 
        popularity: 82 
    }
];
