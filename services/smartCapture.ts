
import type { SmartLead, AppConfig } from "../types";

const getDeviceType = (): string => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
    return "desktop";
};

const getUtmParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_content: params.get('utm_content') || undefined,
        gclid: params.get('gclid') || undefined,
        fbclid: params.get('fbclid') || undefined,
    };
};

export const saveLead = async (
    email: string, 
    source: SmartLead['source'],
    quizData?: Record<string, string>
): Promise<SmartLead> => {
    
    const lead: SmartLead = {
        id: crypto.randomUUID(),
        email,
        source,
        timestamp: new Date().toISOString(),
        device: getDeviceType(),
        ...getUtmParams(),
        quiz_data: quizData,
        status: 'captured'
    };

    // 1. Local Persistence (Backup)
    try {
        const existingLeads: SmartLead[] = JSON.parse(localStorage.getItem('smart_leads') || '[]');
        // Dedupe check
        if (!existingLeads.some(l => l.email.toLowerCase() === email.toLowerCase())) {
            existingLeads.push(lead);
            localStorage.setItem('smart_leads', JSON.stringify(existingLeads));
        }
    } catch (e) {
        console.error("Local storage failed", e);
    }

    // 2. Data Layer Push (GA4 / GTM)
    if (window.dataLayer) {
        window.dataLayer.push({
            'event': 'lead_capture',
            'lead_id': lead.id,
            'user_email_hash': 'sha256_placeholder', // Should hash in real app
            'source': source
        });
    }

    // 3. Webhook Integration (Make.com / Zapier)
    try {
        const config: AppConfig = JSON.parse(localStorage.getItem('app_config') || '{}');
        const webhookUrl = config.webhookUrl;
        
        if (webhookUrl && (webhookUrl.startsWith('http') || webhookUrl.startsWith('https'))) {
            const payload = JSON.stringify({
                event: "lead_captured",
                lead: lead,
                meta: {
                    user_agent: navigator.userAgent,
                    referrer: document.referrer
                }
            });
            
            // PREFERRED METHOD: sendBeacon (Reliable during redirects)
            const blob = new Blob([payload], { type: 'application/json' });
            const beaconSent = navigator.sendBeacon(webhookUrl, blob);

            if (!beaconSent) {
                // Fallback to Fetch with Keepalive if beacon fails or is too large
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload,
                    keepalive: true
                }).catch(err => console.error("Webhook fetch failed", err));
            } else {
                console.log("Webhook queued via Beacon");
            }
        } else {
            console.log("No webhook URL configured in Admin");
        }
    } catch (e) {
        console.error("Integration logic failed", e);
    }

    return lead;
};

// Global type for GTM
declare global {
    interface Window {
        dataLayer: any[];
    }
}
