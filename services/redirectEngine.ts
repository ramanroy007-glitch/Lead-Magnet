import type { CpaOffer, AnalyticsLog, AppConfig, SmartLead } from '../types';
import { DEFAULT_OFFERS } from '../constants';

// This function selects an offer based on the rules set in the admin panel.
const selectOffer = (offers: CpaOffer[], config: AppConfig): CpaOffer | null => {
    const activeOffers = offers.filter(o => o.is_active);
    if (activeOffers.length === 0) return null;

    if (config.redirectRule === 'rotate') {
        const totalWeight = activeOffers.reduce((sum, offer) => sum + offer.weight, 0);
        if (totalWeight === 0) return activeOffers[0]; 

        let random = Math.random() * totalWeight;
        for (const offer of activeOffers) {
            if (random < offer.weight) return offer;
            random -= offer.weight;
        }
    }
    
    // Default to first active offer for 'single' rule or as a fallback
    return activeOffers[0] || null;
};

const trackRedirect = (lead: SmartLead, offerId: string) => {
    const log: AnalyticsLog = {
        redirect_id: crypto.randomUUID(),
        email: lead.email,
        offer_id: offerId,
        timestamp: new Date().toISOString(),
        device: lead.device,
    };

    try {
        const analytics: AnalyticsLog[] = JSON.parse(localStorage.getItem('app_analytics') || '[]');
        analytics.push(log);
        localStorage.setItem('app_analytics', JSON.stringify(analytics));
        console.log("Redirect tracked:", log);
    } catch(e) {
        console.error("Failed to track redirect", e);
    }
};

export const performRedirect = (lead: SmartLead) => {
    const offers: CpaOffer[] = JSON.parse(localStorage.getItem('cpa_offers') || JSON.stringify(DEFAULT_OFFERS));
    const config: AppConfig = JSON.parse(localStorage.getItem('app_config') || '{}');
    
    const selectedOffer = selectOffer(offers, config);

    let finalUrl = config.defaultCpaUrl || 'https://example.com/default-offer';
    let offerIdToTrack = 'default_fallback';

    if (selectedOffer) {
        finalUrl = selectedOffer.url;
        offerIdToTrack = selectedOffer.id;
    }

    if (lead) {
        // Append lead email as a subID for tracking, common in CPA
        if (finalUrl.includes('{subid}')) {
             finalUrl = finalUrl.replace('{subid}', encodeURIComponent(lead.email));
        }
        trackRedirect(lead, offerIdToTrack);
    }

    console.log(`Redirecting to: ${finalUrl}`);
    window.location.href = finalUrl;
};
