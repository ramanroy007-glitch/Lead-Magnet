
import type { SmartLead, Integration, SmtpProfile } from "../types";

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

    // 1. Local Persistence (Browser Backup)
    try {
        const existingLeads: SmartLead[] = JSON.parse(localStorage.getItem('smart_leads') || '[]');
        if (!existingLeads.some(l => l.email.toLowerCase() === email.toLowerCase())) {
            existingLeads.push(lead);
            localStorage.setItem('smart_leads', JSON.stringify(existingLeads));
        }
    } catch (e) { console.error("Local storage failed", e); }

    // 2. Webhook Integration (The "Coolify/n8n/Zapier" Connector)
    try {
        const integrations: Integration[] = JSON.parse(localStorage.getItem('integrations') || '[]');
        const activeIntegrations = integrations.filter(i => i.isActive);
        
        if (activeIntegrations.length > 0) {
            const payload = JSON.stringify({
                event: "lead_captured",
                lead: lead,
                timestamp: new Date().toISOString(),
                meta: { user_agent: navigator.userAgent, referrer: document.referrer }
            });
            
            // We use Promise.allSettled to ensure one failure doesn't block others
            await Promise.allSettled(activeIntegrations.map(async (int) => {
                if (!int.webhookUrl) return;
                
                try {
                    // Fetch with keepalive is standard for modern analytics/tracking
                    const response = await fetch(int.webhookUrl, { 
                        method: 'POST', 
                        body: payload, 
                        keepalive: true, // Crucial: ensures request completes even if page unloads
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        } 
                    });
                    
                    if (response.ok) {
                         console.log(`✅ Lead synced to ${int.name}`);
                    } else {
                         console.warn(`⚠️ Webhook error ${int.name}: ${response.status}`);
                    }
                } catch (e) {
                    console.error(`❌ Connection failed to ${int.name}`, e);
                }
            }));
        }
    } catch (e) {
        console.error("Integration logic error", e);
    }

    return lead;
};

// Global type for GTM
declare global {
    interface Window {
        dataLayer: any[];
    }
}
