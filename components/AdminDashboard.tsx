import React, { useState, useEffect } from 'react';
import type { SmartLead, CpaOffer, SiteContentConfig, QuizConfig, VersionData } from '../types';
import { generateOfferFromLink, analyzeOfferCompliance } from '../services/gemini';

interface AdminDashboardProps {
    onLogout: () => void;
    currentOffers: CpaOffer[];
    onUpdateOffers: (offers: CpaOffer[]) => void;
    currentContent: SiteContentConfig;
    onUpdateContent: (content: SiteContentConfig) => void;
    currentQuizConfig: QuizConfig;
    onUpdateQuizConfig: (config: QuizConfig) => void;
    versionHistory: VersionData[];
    onRestoreVersion: (version: VersionData) => void;
    onSaveVersion: (note: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    onLogout, 
    currentOffers, 
    onUpdateOffers,
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'connections' | 'launchpad'>('overview');
    
    // State
    const [leads, setLeads] = useState<SmartLead[]>([]);
    const [webhookUrl, setWebhookUrl] = useState('');
    
    // Offer Edit State
    const [isEditingOffer, setIsEditingOffer] = useState(false);
    const [offerForm, setOfferForm] = useState<Partial<CpaOffer>>({});
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [magicLinkInput, setMagicLinkInput] = useState('');
    
    // Compliance State
    const [complianceReport, setComplianceReport] = useState<{ isSafe: boolean; score: number; flags: string[] } | null>(null);
    const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);

    // Launchpad State
    const [userDomain, setUserDomain] = useState('');
    const [vpsIp, setVpsIp] = useState('');
    const [domainError, setDomainError] = useState('');
    const [ipError, setIpError] = useState('');

    useEffect(() => {
        const savedLeads = JSON.parse(localStorage.getItem('smart_leads') || '[]');
        setLeads(savedLeads);
        const config = JSON.parse(localStorage.getItem('app_config') || '{}');
        if (config.webhookUrl) setWebhookUrl(config.webhookUrl);
    }, []);

    // --- ACTIONS ---

    const handleMagicImport = async () => {
        if (!magicLinkInput) return alert("Please paste a link first");
        setIsAiLoading(true);
        try {
            const data = await generateOfferFromLink(magicLinkInput);
            setOfferForm({ ...data, url: magicLinkInput });
            setIsEditingOffer(true);
            setMagicLinkInput('');
            setComplianceReport(null); 
        } catch (e) {
            alert("AI could not scan this link. Opening manual editor.");
            setOfferForm({ url: magicLinkInput });
            setIsEditingOffer(true);
            setComplianceReport(null);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleCheckCompliance = async () => {
        setIsCheckingCompliance(true);
        const report = await analyzeOfferCompliance(offerForm);
        setComplianceReport(report);
        setIsCheckingCompliance(false);
    };

    const handleSaveOffer = () => {
        const newOffer: CpaOffer = {
            id: offerForm.id || crypto.randomUUID(),
            title: offerForm.title || 'New Offer',
            url: offerForm.url || 'https://google.com',
            description: offerForm.description || '',
            payout: offerForm.payout || 'View Reward',
            category: offerForm.category || 'Other',
            imageUrl: offerForm.imageUrl || '',
            ctaText: offerForm.ctaText || 'Claim',
            weight: offerForm.weight || 100,
            is_active: offerForm.is_active ?? true,
            popularity: 90
        };

        if (offerForm.id) {
            onUpdateOffers(currentOffers.map(o => o.id === newOffer.id ? newOffer : o));
        } else {
            onUpdateOffers([newOffer, ...currentOffers]);
        }
        setIsEditingOffer(false);
        setOfferForm({});
        setComplianceReport(null);
    };

    const handleDeleteOffer = (id: string) => {
        if(confirm("Delete this offer?")) {
            onUpdateOffers(currentOffers.filter(o => o.id !== id));
        }
    };

    const handleToggleOffer = (id: string) => {
        onUpdateOffers(currentOffers.map(o => o.id === id ? { ...o, is_active: !o.is_active } : o));
    };

    const saveConnections = () => {
        const config = JSON.parse(localStorage.getItem('app_config') || '{}');
        config.webhookUrl = webhookUrl;
        localStorage.setItem('app_config', JSON.stringify(config));
        alert("Settings Saved!");
    };

    // --- GENERATORS ---

    const generateGodScript = () => {
        // Validation
        let valid = true;
        if (!userDomain.includes('.')) { setDomainError("Invalid domain (e.g. site.com)"); valid = false; } else setDomainError('');
        if (vpsIp.split('.').length !== 4) { setIpError("Invalid IP Address"); valid = false; } else setIpError('');
        if (!valid) return;

        const script = `
#!/bin/bash
# NATRAJ REWARDS - ONE-CLICK VPS SETUP
# Domain: ${userDomain}
# Created via Admin Panel

set -e

echo "🚀 INITIALIZING DEPLOYMENT..."
echo "Target: ${userDomain}"

# 1. Update System & Install Dependencies
echo "📦 Updating packages..."
apt-get update && apt-get upgrade -y
apt-get install -y curl git unzip

# 2. Install Docker & Docker Compose
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

# 3. Setup Project Directory
echo "📂 Creating directories..."
mkdir -p /var/www/natraj
cd /var/www/natraj

# 4. Create Web Server Config (Caddy - Automatic HTTPS)
echo "🔒 Configuring SSL..."
cat > Caddyfile <<EOF
${userDomain} {
    reverse_proxy app:80
}
www.${userDomain} {
    redir https://${userDomain}{uri}
}
EOF

# 5. Create Docker Service Config
echo "🏗️ Configuring services..."
cat > docker-compose.yml <<EOF
version: '3'
services:
  app:
    image: nginx:alpine
    volumes:
      - ./dist:/usr/share/nginx/html
    restart: always
  caddy:
    image: caddy:latest
    restart: always
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - app
volumes:
  caddy_data:
  caddy_config:
EOF

# 6. Final Instructions
echo ""
echo "✅ SERVER CONFIGURATION COMPLETE!"
echo "------------------------------------------------"
echo "NEXT STEPS (MANUAL):"
echo "1. Build your project on your computer: 'npm run build'"
echo "2. Upload the 'dist' folder to this server at: /var/www/natraj/dist"
echo "   (Command: scp -r dist root@${vpsIp}:/var/www/natraj)"
echo "3. Run this command to start: 'cd /var/www/natraj && docker compose up -d'"
echo "------------------------------------------------"
`.trim();

        downloadFile('setup_vps.sh', script);
    };

    const downloadFile = (filename: string, content: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
            
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full z-20 shadow-sm hidden md:flex">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-inbox-orange rounded-lg shadow-md flex items-center justify-center text-white font-bold">N</div>
                    <div>
                        <h1 className="font-bold text-slate-900 tracking-tight">Natraj<span className="text-slate-400">Admin</span></h1>
                        <span className="text-[10px] text-green-600 font-bold uppercase bg-green-50 px-2 py-0.5 rounded-full">v2.0 Pro</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <SidebarItem icon="📊" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon="💎" label="Offers Manager" active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} />
                    <SidebarItem icon="🔌" label="Data Sync" active={activeTab === 'connections'} onClick={() => setActiveTab('connections')} />
                    <SidebarItem icon="🚀" label="Deployment" active={activeTab === 'launchpad'} onClick={() => setActiveTab('launchpad')} />
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <button onClick={onLogout} className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-500 transition-colors">Log Out</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 md:ml-64 p-4 md:p-12 overflow-y-auto">
                
                {/* --- OVERVIEW --- */}
                {activeTab === 'overview' && (
                    <div className="max-w-5xl animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-8">System Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <StatCard label="Total Leads Captured" value={leads.length} color="text-blue-600" />
                            <StatCard label="Active Offers" value={currentOffers.filter(o => o.is_active).length} color="text-green-600" />
                            <StatCard label="Recent Conversion Rate" value={`${leads.length > 0 ? '12.5%' : '0%'}`} color="text-purple-600" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900">Live Lead Stream</h3>
                                <span className="text-xs font-mono text-green-600 animate-pulse">● Live</span>
                            </div>
                            {leads.length === 0 ? (
                                <p className="text-slate-500 text-sm py-8 text-center bg-slate-50 rounded-xl">No leads captured yet. Run a test flow.</p>
                            ) : (
                                <table className="w-full text-left text-sm text-slate-500">
                                    <thead><tr className="border-b border-slate-100"><th className="pb-3 pl-2 font-bold text-slate-700">Email</th><th className="pb-3 font-bold text-slate-700">Source</th><th className="pb-3 font-bold text-slate-700">Time</th></tr></thead>
                                    <tbody>
                                        {leads.slice(-5).reverse().map(lead => (
                                            <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50">
                                                <td className="py-3 pl-2 text-slate-900 font-medium">{lead.email}</td><td className="py-3">{lead.source}</td><td className="py-3">{new Date(lead.timestamp).toLocaleTimeString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* --- OFFERS --- */}
                {activeTab === 'offers' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-8">
                             <div>
                                 <h2 className="text-3xl font-extrabold text-slate-900">Offer Management</h2>
                                 <p className="text-slate-500 text-sm mt-1">Manage your CPA offers and affiliate links.</p>
                             </div>
                             <button onClick={() => { setOfferForm({}); setIsEditingOffer(true); }} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 transition-all active:scale-95 flex items-center gap-2">
                                 <span>+</span> New Offer
                             </button>
                        </div>

                        {/* MAGIC BAR */}
                        <div className="bg-white border border-slate-200 p-2 rounded-2xl flex items-center shadow-lg mb-10 max-w-2xl ring-4 ring-slate-50 mx-auto">
                            <input 
                                type="text"
                                placeholder="Paste Affiliate Link (e.g., https://netflix.com)..."
                                className="flex-1 bg-transparent border-none text-slate-900 px-4 py-3 outline-none placeholder-slate-400 font-medium"
                                value={magicLinkInput}
                                onChange={(e) => setMagicLinkInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleMagicImport()}
                            />
                            <button onClick={handleMagicImport} disabled={isAiLoading || !magicLinkInput} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-md whitespace-nowrap">
                                {isAiLoading ? <span className="animate-spin">⏳</span> : '✨ AI Auto-Fill'}
                            </button>
                        </div>

                        {/* OFFERS TABLE VIEW */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                            <table className="w-full text-left min-w-[700px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Offer Details</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Weight</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentOffers.map(offer => (
                                        <tr key={offer.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                                        {offer.imageUrl ? <img src={offer.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300">⚡️</div>}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">{offer.title}</h4>
                                                        <p className="text-xs text-emerald-600 font-bold font-mono">{offer.payout}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{offer.category}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="range" min="0" max="100" 
                                                        value={offer.weight || 0} 
                                                        onChange={(e) => {
                                                            const newWeight = parseInt(e.target.value);
                                                            onUpdateOffers(currentOffers.map(o => o.id === offer.id ? { ...o, weight: newWeight } : o));
                                                        }}
                                                        className="w-24 accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                                                    />
                                                    <span className="text-xs font-mono text-slate-400 w-6">{offer.weight}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleToggleOffer(offer.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${offer.is_active ? 'bg-green-500' : 'bg-slate-300'}`}>
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${offer.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setOfferForm(offer); setIsEditingOffer(true); setComplianceReport(null); }} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 shadow-sm transition-all" title="Edit">✏️</button>
                                                    <button onClick={() => handleDeleteOffer(offer.id)} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-500 hover:text-red-600 shadow-sm transition-all" title="Delete">🗑</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- CONNECTIONS --- */}
                {activeTab === 'connections' && (
                    <div className="max-w-3xl animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Integrations</h2>
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">⚡️</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Webhook Connection</h3>
                                    <p className="text-slate-500 text-sm">Send leads instantly to Make.com, Zapier, or Google Sheets.</p>
                                </div>
                            </div>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 mb-4 focus:border-purple-500 outline-none transition-colors" placeholder="https://hook.us1.make.com/..." value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} />
                            <button onClick={saveConnections} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors">Save Connection</button>
                        </div>
                    </div>
                )}

                {/* --- DEPLOYMENT LAUNCHPAD --- */}
                {activeTab === 'launchpad' && (
                    <div className="max-w-4xl animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Deployment Center</h2>
                        <p className="text-slate-500 mb-8 text-lg">Deploy your rewards site to a VPS in minutes.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* VPS Card */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 z-0"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🚀</div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">One-Click VPS Setup</h3>
                                    <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                                        Generates a "God Mode" script for DigitalOcean, Vultr, or Hetzner. 
                                        Automatically installs Docker, SSL (HTTPS), and your Website.
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Your Domain</label>
                                            <input className={`w-full bg-slate-50 border ${domainError ? 'border-red-500' : 'border-slate-200'} rounded-lg px-4 py-3 text-slate-900 focus:border-blue-500 outline-none`} placeholder="example.com" value={userDomain} onChange={e => setUserDomain(e.target.value)} />
                                            {domainError && <span className="text-red-500 text-xs font-bold mt-1 block">{domainError}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">VPS IP Address</label>
                                            <input className={`w-full bg-slate-50 border ${ipError ? 'border-red-500' : 'border-slate-200'} rounded-lg px-4 py-3 text-slate-900 focus:border-blue-500 outline-none`} placeholder="123.45.67.89" value={vpsIp} onChange={e => setVpsIp(e.target.value)} />
                                            {ipError && <span className="text-red-500 text-xs font-bold mt-1 block">{ipError}</span>}
                                        </div>
                                        <button onClick={generateGodScript} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Download Setup Script
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="space-y-6">
                                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        DNS Configuration
                                    </h3>
                                    <ul className="space-y-4 text-sm text-slate-600">
                                        <li className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-800">1. A Record (Root)</span>
                                            <div className="flex items-center gap-2 font-mono bg-slate-50 px-3 py-2 rounded border border-slate-100">
                                                <span className="text-slate-400">@</span>
                                                <span>→</span>
                                                <span className="text-blue-600">{vpsIp || 'YOUR_VPS_IP'}</span>
                                            </div>
                                        </li>
                                        <li className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-800">2. CNAME Record (Subdomain)</span>
                                            <div className="flex items-center gap-2 font-mono bg-slate-50 px-3 py-2 rounded border border-slate-100">
                                                <span className="text-slate-400">www</span>
                                                <span>→</span>
                                                <span className="text-blue-600">{userDomain || 'example.com'}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-8">
                                    <h3 className="font-bold text-yellow-800 mb-2">Instructions</h3>
                                    <ol className="text-sm text-yellow-800/80 list-decimal pl-4 space-y-2">
                                        <li>Purchase a domain (Namecheap) and VPS (DigitalOcean).</li>
                                        <li>Configure the DNS records as shown above.</li>
                                        <li>Download the script and paste it into your VPS terminal.</li>
                                        <li>Upload your built <strong>dist</strong> folder.</li>
                                    </ol>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </main>

            {/* EDIT OFFER MODAL */}
            {isEditingOffer && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-slate-900 font-extrabold text-lg">Edit Offer Details</h3>
                            <button onClick={() => setIsEditingOffer(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <button onClick={handleCheckCompliance} disabled={isCheckingCompliance} className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-bold transition-colors">
                                {isCheckingCompliance ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                        Scanning...
                                    </>
                                ) : '🛡️ Check Ad Compliance (AI)'}
                            </button>
                            {complianceReport && (
                                <div className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${complianceReport.isSafe ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                    <span className="text-xl">{complianceReport.isSafe ? '✅' : '⚠️'}</span>
                                    <div>
                                        <p className="font-bold">Safety Score: {complianceReport.score}/100</p>
                                        {complianceReport.flags.length > 0 && (
                                            <ul className="list-disc pl-4 mt-1 space-y-1">
                                                {complianceReport.flags.map((flag, i) => <li key={i}>{flag}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
                                <input className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-blue-500 outline-none transition-all" placeholder="Enter offer title" value={offerForm.title} onChange={e => setOfferForm({...offerForm, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Affiliate Link</label>
                                <input className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 font-mono text-xs focus:border-blue-500 outline-none transition-all" placeholder="https://..." value={offerForm.url} onChange={e => setOfferForm({...offerForm, url: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                                <textarea className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 text-sm focus:border-blue-500 outline-none transition-all" placeholder="Short persuasive description" rows={3} value={offerForm.description} onChange={e => setOfferForm({...offerForm, description: e.target.value})} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Payout Text</label>
                                    <input className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900" placeholder="$25 or Win iPhone" value={offerForm.payout} onChange={e => setOfferForm({...offerForm, payout: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                                    <select className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900" value={offerForm.category} 
                                    // @ts-ignore
                                    onChange={e => setOfferForm({...offerForm, category: e.target.value})}>
                                        {['Shopping', 'Research', 'Finance', 'Gaming', 'Health', 'Software', 'Home Services', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                             <button onClick={() => setIsEditingOffer(false)} className="text-slate-500 hover:text-slate-800 px-4 py-2 font-bold text-sm">Cancel</button>
                             <button onClick={handleSaveOffer} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
        <span className="text-lg">{icon}</span><span className="text-sm">{label}</span>
    </button>
);

const StatCard = ({ label, value, color }: any) => (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <p className="text-slate-400 text-xs font-bold uppercase mb-2">{label}</p><p className={`text-4xl font-black ${color}`}>{value}</p>
    </div>
);

export default AdminDashboard;
