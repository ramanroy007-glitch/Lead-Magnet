import { GoogleGenAI } from "@google/genai";

let apiKey = '';
try {
    // Safely attempt to access the environment variable
    // @ts-ignore
    apiKey = process.env.API_KEY || '';
} catch (e) {
    console.warn("Environment variable access failed. API functionality may be limited.");
}

let ai: GoogleGenAI | null = null;

try {
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    }
} catch (e) {
    console.warn("Gemini API Client failed to initialize", e);
}

export const generateUserInsight = async (answers: Record<number, string>): Promise<string> => {
    if (!ai) return "We've matched offers based on your profile.";

    try {
        const prompt = `
        You are an expert CPA marketing analyst. A user just took a quiz to find rewards.
        
        User Profile:
        - Interests/Shopping: ${answers[1] || 'General'}
        - Reward Preference: ${answers[2] || 'Cash'}
        - Availability: ${answers[3] || 'Flexible'}

        Task: Write a 1-sentence, exciting, personalized "Success Message" for their dashboard. 
        tell them you found specific offers matching their interests.
        Do NOT mention "AI". Sound like a human account manager.
        Example: "Great news! We found 3 high-paying Gaming offers that fit your flexible schedule."
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text ? response.text.trim() : "We've found exclusive offers for you.";
    } catch (error) {
        console.error("AI Generation failed", error);
        return "We've successfully matched your profile with premium offers.";
    }
};

export const optimizeOfferText = async (currentText: string, type: 'title' | 'description' | 'instructions'): Promise<string> => {
    if (!ai) return currentText;

    try {
        let prompt = "";
        if (type === 'title') {
            prompt = `Rewrite this CPA offer title to be catchy, professional, and under 50 characters. Remove spammy words. Input: "${currentText}"`;
        } else if (type === 'description') {
            prompt = `Rewrite this CPA offer description to be persuasive, clear, and compliant. Focus on the benefit. Keep it under 2 sentences. Input: "${currentText}"`;
        } else {
            prompt = `Turn this rough info into clear, step-by-step instructions (max 3 steps) for a user to earn a reward. Use emojis for each step. Input: "${currentText}"`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text ? response.text.trim() : currentText;
    } catch (error) {
        console.error("AI Optimization failed", error);
        return currentText;
    }
};