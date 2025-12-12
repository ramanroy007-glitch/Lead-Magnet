
import { GoogleGenAI } from "@google/genai";
import type { CpaOffer, SiteContentConfig } from "../types";

const getAi = () => {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
        return new GoogleGenAI({ apiKey });
    }
    console.warn("Gemini API Key is missing. AI features will be disabled or in demo mode.");
    return null;
}

export const generateSeoContent = async (): Promise<{ title: string; content: string }> => {
    const ai = getAi();
    const fallback = {
        title: "Your Ultimate Guide to Earning Money Online in 2024",
        content: "Discover how Natraj Rewards is revolutionizing the world of online rewards. Our platform connects you with premier opportunities from top brands, providing a reliable way to earn money online. Whether it's through paid surveys, trying new apps for cash, or discovering exclusive deals, Natraj Rewards is your gateway to maximizing your online earning potential. We leverage cutting-edge technology to filter and match you with the most relevant and lucrative side hustle ideas, ensuring you never waste a moment. Join a community of savvy earners who are turning their spare time into real rewards. Our system is secure, user-friendly, and designed for your success."
    };
    
    if (!ai) return fallback;

    const prompt = `
    You are a Market Analyst for a top financial publication, writing a feature on "Natraj Rewards".
    Your tone must be authoritative, insightful, and optimized for SEO.
    The primary keyword is "earn money online".
    Secondary keywords: "online rewards", "paid surveys", "cash for apps", "instant payout", "side hustle".
    
    TASK: Write a title and a detailed, engaging paragraph for the homepage.
    Focus on what makes Natraj Rewards a market leader: its proprietary AI matching (reducing user disqualification rates), speed of payouts (citing an impressive average), and bank-grade security.
    Use illustrative statistics to add credibility (e.g., "reducing wasted time by up to 70%").

    Return ONLY a valid JSON object with "title" and "content" keys.
    Example: { "title": "The Data-Driven Approach to Earning Money Online in 2026", "content": "In an increasingly fragmented digital economy, Natraj Rewards emerges as a leader by tackling the primary pain points of the online rewards sector: inefficiency and slow payouts. Our analysis shows their AI matching technology reduces user disqualification by over 65%, connecting users only with surveys and offers they are pre-qualified for. This results in a higher earning potential and an average cash-out time of under 24 hours, a significant improvement over the industry standard of 3-5 business days. Combined with bank-grade data security, Natraj Rewards presents a compelling, data-backed platform for monetizing spare time effectively." }
    Do not include any markdown formatting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text || "{}";
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI SEO Content Generation Error", error);
        return fallback;
    }
};

export const generateOfferFromLink = async (input: string): Promise<Partial<CpaOffer>> => {
    const ai = getAi();
    const isPhoneNumber = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(input.replace(/\s/g, ''));
    
    if (!ai) return { 
        title: "New Opportunity",
        description: "AI Key Missing - Manual Edit Required",
        payout: "View Reward",
        category: "Other",
        offerType: isPhoneNumber ? 'call' : 'link',
        phoneNumber: isPhoneNumber ? input : undefined,
        url: isPhoneNumber ? '#' : input
    };

    const prompt = `
    You are an expert Affiliate Marketer. Analyze this input: "${input}"
    Return VALID JSON ONLY with these keys:
    - offerType: "call" or "link"
    - title: Catchy headline (max 50 chars)
    - description: Persuasive text (max 100 chars)
    - category: One of ['Health', 'Insurance', 'Home Services', 'Finance', 'Shopping', 'Research', 'Gaming', 'Apps', 'Other']
    - payout: A realistic reward string (e.g. "Earn $25")
    - conversionTrigger: e.g. "90s Duration", "Email Submit"
    - ctaText: "Claim Now", "Call Agent", etc.
    - imageUrl: A valid https://images.unsplash.com/... URL (High res, niche relevant).
    JSON ONLY. No markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text || "{}";
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        if (data.offerType === 'call') {
            data.phoneNumber = input;
            data.url = '#'; 
        } else {
            data.url = input;
        }

        return data;
    } catch (error) {
        console.error("AI Offer Generation Error", error);
        return {
            title: "AI Error - Manual Input Needed",
            description: "The AI could not process this request.",
            payout: "N/A",
            category: "Other",
            offerType: isPhoneNumber ? 'call' : 'link',
            phoneNumber: isPhoneNumber ? input : undefined,
            url: isPhoneNumber ? '#' : input
        };
    }
};

export const analyzeOfferCompliance = async (offer: Partial<CpaOffer>): Promise<{ isSafe: boolean; score: number; flags: string[] }> => {
    const ai = getAi();
    if (!ai) return { isSafe: true, score: 100, flags: ["AI Not Connected"] };

    const prompt = `
    Audit this Ad Offer for Google/Facebook Compliance.
    Title: ${offer.title} | Desc: ${offer.description} | Payout: ${offer.payout}
    Return JSON: { "score": number (0-100), "isSafe": boolean, "flags": string[] }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text || "{}";
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        return { isSafe: true, score: 50, flags: ["Error checking compliance."] };
    }
};
