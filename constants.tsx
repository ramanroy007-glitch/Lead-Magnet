
import type { CpaOffer, SiteContentConfig, QuizConfig, SmtpConfig } from './types';

// COMPLIANCE NOTE: Content focuses on "Access," "Opportunity," and "Savings" rather than guaranteed income.
export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
    hero: {
        headline: "Your Gateway to Exclusive Rewards & Savings.",
        subheadline: "Join our premier rewards community. Access verified sweepstakes, high-value surveys, and exclusive discount offers from top brands.",
        ctaText: "Find My Rewards",
        trustText: "Verified Sweepstakes & Deals"
    },
    quiz: {
        step1Title: "Personalize Your Offers",
        step2Title: "Select Interests",
        emailTitle: "Unlock Your Dashboard"
    },
    colors: {
        primary: "#F36D36", // Inbox Orange
        secondary: "#8DC63F" // Inbox Green
    }
};

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
    questions: [
        {
            id: 'age',
            text: "What is your age range?",
            subtext: "We use this to match you with age-appropriate sweepstakes and surveys.",
            options: [
                { id: '18-24', text: '18 - 24', icon: '🎓' },
                { id: '25-34', text: '25 - 34', icon: '💼' },
                { id: '35-44', text: '35 - 44', icon: '🏠' },
                { id: '45+', text: '45+', icon: '🌟' },
            ]
        },
        {
            id: 'interest',
            text: "What interests you most?",
            subtext: "Select the rewards you are looking for today.",
            options: [
                { id: 'sweepstakes', text: 'Cash Sweepstakes', icon: '🏆' },
                { id: 'surveys', text: 'Paid Surveys', icon: '📝' },
                { id: 'deals', text: 'Shopping Discounts', icon: '🛍️' },
            ]
        }
    ],
    emailStepTitle: "Save Your Progress",
    emailStepSubtext: "Enter your best email to secure your reward matches and receive offer alerts."
};

export const DEFAULT_SMTP_CONFIG: SmtpConfig = {
    provider: 'none',
    host: 'smtp.sendgrid.net',
    port: 587,
    user: 'apikey',
    pass: '',
    fromEmail: 'rewards@natrajrewards.com'
};

export const QUIZ_QUESTIONS = DEFAULT_QUIZ_CONFIG.questions; // Legacy export

export const DEFAULT_OFFERS: CpaOffer[] = [
    {
        id: '1',
        title: 'Enter to Win: Tech Bundle Giveaway',
        url: 'https://google.com',
        is_active: true,
        weight: 100,
        category: 'Shopping',
        payout: 'Sweepstakes Entry', 
        description: 'Participate in our partner giveaway for a chance to win the latest gadgets. No purchase necessary.',
        imageUrl: 'https://images.unsplash.com/photo-1531297461136-82lwDe4105q?auto=format&fit=crop&w=600&q=80',
        ctaText: 'Enter Now',
        popularity: 98
    },
    {
        id: '2',
        title: 'Premium Survey Panel Access',
        url: 'https://google.com',
        is_active: true,
        weight: 95,
        category: 'Research',
        payout: 'Earn Per Survey',
        description: 'Get invited to high-paying consumer research studies. Share your opinion on household brands.',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=600&q=80',
        ctaText: 'Join Panel',
        popularity: 92
    },
    {
        id: '3',
        title: 'Exclusive Auto Insurance Savings',
        url: 'https://google.com',
        is_active: true,
        weight: 90,
        category: 'Finance',
        payout: 'Save up to $500/yr',
        description: 'Compare rates in your area. Drivers who switch save an average of $500 per year.',
        imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80',
        ctaText: 'See Rates',
        popularity: 88
    }
];
