
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
 * Generates marketing details from a raw URL or Phone Number.
 * Smartly detects Pay Per Call vs CPA Link.
 */
export const generateOfferFromLink = async (input: string): Promise<Partial<CpaOffer>> => {
    const ai = getAi();
    
    // Basic heuristics to determine type before AI
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
    You are an expert Affiliate Marketer and Ad Copywriter.
    
    INPUT: "${input}"
    
    Task: 
    1. Determine if the input is a URL (Website) or a Phone Number (Pay Per Call).
    2. Guess the brand/niche (e.g. Medicare, Debt Relief, Netflix, Amazon).
    3. Write persuasive marketing copy.
    4. Select a high-quality Unsplash Image URL.
    
    Return VALID JSON ONLY with these keys:
    - offerType: "call" or "link"
    - title: Catchy headline (max 50 chars)
    - description: Persuasive text (max 100 chars)
    - category: One of ['Health', 'Insurance', 'Home Services', 'Finance', 'Shopping', 'Research', 'Gaming', 'Other']
    - payout: A realistic reward string (e.g. "Earn $25" or "Call Now")
    - conversionTrigger: e.g. "90s Duration", "Email Submit", "Purchase"
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

        // Merge input back into data
        if (data.offerType === 'call') {
            data.phoneNumber = input;
            data.url = '#'; // Placeholder
        } else {
            data.url = input;
        }

        return data;
    } catch (error) {
        console.error("AI Generation Error", error);
        return {
            title: "New Opportunity",
            description: "Click to see details.",
            payout: "View Reward",
            category: "Other",
            imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80",
            offerType: isPhoneNumber ? 'call' : 'link',
            phoneNumber: isPhoneNumber ? input : undefined,
            url: isPhoneNumber ? '#' : input
        };
    }
};

export const interpretAdminCommand = async (command: string, currentContent: SiteContentConfig): Promise<any> => {
   return { type: 'UNKNOWN' };
};

export const analyzeOfferCompliance = async (offer: Partial<CpaOffer>): Promise<{ isSafe: boolean; score: number; flags: string[] }> => {
    const ai = getAi();
    if (!ai) return { isSafe: true, score: 100, flags: ["AI Not Connected"] };

    const prompt = `
    Audit this Ad Offer for Google/Facebook Compliance.
    
    Title: ${offer.title}
    Desc: ${offer.description}
    Payout: ${offer.payout}

    Return JSON:
    { "score": number (0-100), "isSafe": boolean, "flags": string[] }
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
