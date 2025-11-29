import React from 'react';

// Page types derived from Hash routes
export type Page = 'home' | 'offers' | 'offer-detail' | 'admin' | 'admin-login' | 'privacy' | 'terms' | 'info' | 'contact' | 'help' | 'success-stories';

export type UserRole = 'super_admin' | 'employee' | null;

export interface QuizQuestion {
  id: number;
  text: string;
  type: 'multiple-choice' | 'icon-choice';
  options: {
    id: string;
    text: string;
    icon?: React.ReactElement | string;
  }[];
}

export interface UserAnswers {
  [key: number]: string;
}

export interface EmailLead {
    id: string;
    name: string;
    email: string;
    quizAnswers: UserAnswers;
    submittedAt: string;
    status: 'new' | 'synced' | 'bounced' | 'complaint';
    ip?: string;
}

export interface SmtpProfile {
    id: string;
    name: string;
    provider: 'aws' | 'sendgrid' | 'gmail' | 'custom' | 'hostinger' | 'office365' | 'mailgun' | 'webhook';
    host: string;
    port: number;
    username: string;
    password?: string; // Stored securely
    fromEmail?: string;
    encryption: 'ssl' | 'tls' | 'none';
    status: 'active' | 'paused';
}

export interface CpaOffer {
    id: string;
    title: string;
    description: string;
    instructions?: string; // Step-by-step guide for the detail page
    payout: string; // Display text e.g. "$2.50" or "Chance to Win"
    payoutValue?: number; // Numeric value for sorting
    popularity?: number; // 0-100 score for sorting
    ctaText: string;
    url: string; // Your tracking link
    category: 'sweepstakes' | 'survey' | 'app' | 'finance';
    imageUrl?: string;
    isActive: boolean;
}

export interface SiteContent {
    hero: {
        headline: string;
        subheadline: string;
        ctaText: string;
    };
    features: {
        title: string;
        subtitle: string;
        items: Array<{title: string; desc: string}>;
    };
    testimonials: Array<{
        name: string;
        role: string;
        text: string;
        location: string;
    }>;
    seoSection: {
        title: string;
        content: string;
    };
    finalCta: {
        heading: string;
        subheading: string;
        buttonText: string;
    }
}