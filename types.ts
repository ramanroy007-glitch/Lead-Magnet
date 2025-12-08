import React from 'react';

// --- CORE SYSTEM TYPES ---

export type Page = 'home' | 'admin' | 'admin-login' | 'info' | 'offers';
export type UserRole = 'super_admin' | 'employee' | string;

// Main Lead object with tracking
export interface SmartLead {
    id: string;
    email: string;
    name?: string;
    source: 'google_oauth' | 'manual_entry' | 'quiz_flow';
    timestamp: string;
    ip?: string; 
    device: string;
    // Tracking Parameters for Attribution
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    gclid?: string; // Google Ads Click ID
    fbclid?: string; // Facebook Click ID
    status: 'captured' | 'synced' | 'failed';
    quiz_data?: Record<string, string>; // Store quiz answers
}

// CPA Offer with rotation rules
export interface CpaOffer {
    id: string;
    title: string;
    url: string;
    weight: number; 
    is_active: boolean;
    description?: string;
    payout?: string;
    category?: 'Health' | 'Insurance' | 'Home Services' | 'Software' | 'Shopping' | 'Finance' | 'Research' | 'Gaming' | 'Other';
    imageUrl?: string;
    ctaText?: string;
    instructions?: string;
    popularity?: number; // 0-100
}

// Dynamic Website Content Config
export interface SiteContentConfig {
    hero: {
        headline: string;
        subheadline: string;
        ctaText: string;
        trustText: string;
    };
    quiz: {
        step1Title: string; // Legacy support
        step2Title: string; // Legacy support
        emailTitle: string; // Legacy support
    };
    colors: {
        primary: string; // Hex code
        secondary: string;
    }
}

// Dynamic Quiz Configuration
export interface QuizOption {
    id: string;
    text: string;
    icon: string;
}

export interface QuizQuestion {
    id: string;
    text: string;
    subtext: string;
    options: QuizOption[];
}

export interface QuizConfig {
    questions: QuizQuestion[];
    emailStepTitle: string;
    emailStepSubtext: string;
}

// SMTP / Email Configuration
export interface SmtpConfig {
    provider: 'sendgrid' | 'mailgun' | 'smtp' | 'none';
    host: string;
    port: number;
    user: string;
    pass: string;
    fromEmail: string;
}

// Version Control
export interface VersionData {
    id: string;
    timestamp: string;
    note: string;
    data: {
        siteContent: SiteContentConfig;
        offers: CpaOffer[];
        quizConfig: QuizConfig;
    }
}

// App-wide settings managed by admin
export interface AppConfig {
    brandName: string;
    headline: string;
    // Logic
    defaultCpaUrl: string; // The fallback URL
    redirectRule: 'single' | 'rotate' | 'offer_wall'; 
    // Integrations
    webhookUrl?: string; // For Make.com / Zapier
    googleAnalyticsId?: string;
}

// Analytics for tracking redirects
export interface AnalyticsLog {
    redirect_id: string;
    email: string;
    offer_id: string;
    timestamp: string;
    device: string;
}

// Global Custom Elements via Module Augmentation
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'lottie-player': any;
        }
    }
}
