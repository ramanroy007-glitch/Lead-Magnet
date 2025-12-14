
import { GoogleGenAI, Type } from "@google/genai";
import type { CpaOffer } from "../types";

const getAi = () => {
    // Access the injected variable directly
    const apiKey = process.env.API_KEY;
    
    if (apiKey && apiKey.length > 0 && apiKey !== 'undefined') {
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
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        content: { type: Type.STRING },
                    },
                    required: ["title", "content"],
                }
            }
        });

        if (response.text) {
             return JSON.parse(response.text);
        }
        return fallback;
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
    Analyze the input to create a compelling offer.
    If the input is a phone number, set offerType to "call".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        offerType: { type: Type.STRING, enum: ["call", "link"] },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        category: { type: Type.STRING, enum: ['Health', 'Insurance', 'Home Services', 'Finance', 'Shopping', 'Research', 'Gaming', 'Apps', 'Other'] },
                        payout: { type: Type.STRING },
                        conversionTrigger: { type: Type.STRING },
                        ctaText: { type: Type.STRING },
                        imageUrl: { type: Type.STRING },
                        phoneNumber: { type: Type.STRING },
                        url: { type: Type.STRING }
                    },
                    required: ["offerType", "title", "description", "category", "payout"],
                }
            }
        });

        if (response.text) {
            const data = JSON.parse(response.text);
            if (data.offerType === 'call') {
                data.phoneNumber = input;
                data.url = '#'; 
            } else {
                data.url = input;
            }
            return data;
        }
        throw new Error("Empty response");

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
