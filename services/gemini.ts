import { GoogleGenAI } from "@google/genai";
import { CpaOffer, SiteContentConfig } from "../types";

/**
 * Initializes AI using the environment variable API Key.
 */
const getAi = () => {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
        return new GoogleGenAI({ apiKey });
    }
    console.warn("Gemini API Key is missing. Ensure process.env.API_KEY is set.");
    return null;
}

/**
 * Generates marketing details from a raw URL.
 * Designed to feed into the Admin Dashboard 'Auto-Fill' form.
 */
export const generateOfferFromLink = async (input: string): Promise<Partial<CpaOffer>> => {
    const ai = getAi();
    if (!ai) return { 
        title: "New Opportunity",
        description: "AI Key Missing - Manual Edit Required",
        payout: "View Reward",
        category: "Other"
    };

    const prompt = `
    You are an expert Affiliate Marketer.
    
    INPUT: "${input}"
    
    Task: 
    1. Analyze the input URL or Text to guess the brand (e.g. Netflix, Amazon, OpinionOutpost).
    2. Write persuasive marketing copy for this offer.
    3. Select a high-quality Unsplash Image URL that matches the niche.
    
    Return VALID JSON ONLY with these keys:
    - title: Catchy headline (max 50 chars)
    - description: Persuasive text (max 100 chars)
    - category: One of ['Shopping', 'Finance', 'Research', 'Gaming', 'Other']
    - payout: A realistic reward string (e.g. "Earn $25" or "Win Prize")
    - ctaText: "Claim Now" or similar
    - imageUrl: A valid https://images.unsplash.com/... URL (Do not break the link)
    
    JSON ONLY. No markdown. No code blocks.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text || "{}";
        // Clean markdown
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Generation Error", error);
        // Fallback if AI fails
        return {
            title: "New Opportunity",
            description: "Click to see details.",
            payout: "View Reward",
            category: "Other",
            imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80"
        };
    }
};

export const interpretAdminCommand = async (command: string, currentContent: SiteContentConfig): Promise<any> => {
   return { type: 'UNKNOWN' };
};

/**
 * Analyzes offer content for Google/Facebook Ad Policy compliance.
 */
export const analyzeOfferCompliance = async (offer: Partial<CpaOffer>): Promise<{ isSafe: boolean; score: number; flags: string[] }> => {
    const ai = getAi();
    if (!ai) return { isSafe: true, score: 100, flags: ["AI Not Connected - Check Skipped"] };

    const prompt = `
    You are a strict Google Ads and Facebook Ads Policy Auditor.
    
    Analyze the following CPA Offer for compliance issues, specifically:
    1. Unrealistic Income Claims (e.g. "Get Rich", "Make $500/hr").
    2. Prohibited Content (Gambling, Adult, Scams).
    3. Aggressive Punctuation/Capitalization (e.g. "FREE MONEY!!!").
    4. Misleading Payouts.

    Offer Details:
    Title: ${offer.title}
    Description: ${offer.description}
    Payout Text: ${offer.payout}

    Return JSON ONLY:
    {
        "score": number (0-100, where 100 is perfectly safe),
        "isSafe": boolean (true if score > 80),
        "flags": string[] (List of specific policy warnings, or empty array if safe)
    }
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
        console.error("Compliance Check Failed", error);
        return { isSafe: true, score: 50, flags: ["Error checking compliance."] };
    }
};
