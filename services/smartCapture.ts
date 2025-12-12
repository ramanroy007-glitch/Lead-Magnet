
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

/**
 * Rotates SMTP servers based on availability and daily limits.
 * Resets limits if the day has changed.
 * Increments usage for the selected server.
 */
export const rotateSmtpServers = (): SmtpProfile | null => {
    try {
        const profiles: SmtpProfile[] = JSON.parse(localStorage.getItem('smtp_profiles') || '[]');
        if (profiles.length === 0) return null;

        const today = new Date().toISOString().split('T')[0];
        let profilesChanged = false;

        // 1. Daily Reset Check
        profiles.forEach(p => {
            if (p.lastResetDate !== today) {
                p.currentUsage = 0;
                p.lastResetDate = today;
                profilesChanged = true;
            }
        });

        // 2. Find Available Server (Simple Strategy: First Active with Capacity)
        const activeProfile = profiles.find(p => p.isActive && p.currentUsage < p.dailyLimit);

        if (activeProfile) {
            activeProfile.currentUsage++;
            profilesChanged = true;
        } else {
            console.warn("No available SMTP servers: All limits reached or inactive.");
        }

        if (profilesChanged) {
            localStorage.setItem('smtp_profiles', JSON.stringify(profiles));
        }

        return activeProfile || null;

    } catch (error) {
        console.error("SMTP Rotation Error", error);
        return null;
    }
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

    // 3. Webhook Integration (NEXT GEN CONNECTIVITY)
    try {
        const integrations: Integration[] = JSON.parse(localStorage.getItem('integrations') || '[]');
        const activeIntegrations = integrations.filter(i => i.isActive);
        
        if (activeIntegrations.length > 0) {
            const payload = JSON.stringify({
                event: "lead_captured",
                lead: lead,
                meta: {
                    user_agent: navigator.userAgent,
                    referrer: document.referrer
                }
            });
            
            // Blast to all configured endpoints
            activeIntegrations.forEach(int => {
                if (!int.webhookUrl) return;

                // Use Beacon for reliability on page unload/redirects
                const blob = new Blob([payload], { type: 'application/json' });
                const beaconSent = navigator.sendBeacon(int.webhookUrl, blob);

                if (!beaconSent) {
                    fetch(int.webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: payload,
                        keepalive: true
                    }).catch(err => console.error(`Webhook to ${int.name} failed`, err));
                } else {
                    console.log(`Lead sent to ${int.name}`);
                }
            });
        }
    } catch (e) {
        console.error("Integration logic failed", e);
    }

    // 4. SMTP Rotation (Backend Simulation)
    // We call this to increment the counters and simulate sending an email.
    // In a real backend, this would return the credentials to use for nodemailer.
    const selectedSmtp = rotateSmtpServers();
    if (selectedSmtp) {
        console.log(`[System] Lead confirmation email queued via: ${selectedSmtp.name}`);
    }

    return lead;
};

// Global type for GTM
declare global {
    interface Window {
        dataLayer: any[];
    }
}
