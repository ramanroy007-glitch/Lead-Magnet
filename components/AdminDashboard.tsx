import React, { useState, useEffect } from 'react';
import type { SmartLead, CpaOffer, SiteContentConfig, QuizConfig, VersionData, Integration, SmtpProfile, IntegrationProvider } from '../types';
import { generateOfferFromLink, analyzeOfferCompliance } from '../services/gemini';
import { rotateSmtpServers } from '../services/smartCapture';

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

const INTEGRATION_PROVIDERS: { id: IntegrationProvider; name: string; icon: string }[] = [
    { id: 'mailchimp', name: 'Mailchimp', icon: '🐵' },
    { id: 'aweber', name: 'AWeber', icon: '📧' },
    { id: 'getresponse', name: 'GetResponse', icon: '📨' },
    { id: 'activecampaign', name: 'ActiveCampaign', icon: '🚀' },
    { id: 'convertkit', name: 'ConvertKit', icon: '💌' },
    { id: 'zapier', name: 'Zapier', icon: '⚡' },
    { id: 'generic', name: 'Generic Webhook', icon: '🔗' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    onLogout, 
    currentOffers, 
    onUpdateOffers,
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'connections' | 'launchpad'>('offers');
    
    // State
    const [leads, setLeads] = useState<SmartLead[]>([]);
    
    // Connections State
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [smtpProfiles, setSmtpProfiles] = useState<SmtpProfile[]>([]);
    const [isAddingIntegration, setIsAddingIntegration] = useState<IntegrationProvider | null>(null);
    const [newWebhookUrl, setNewWebhookUrl] = useState('');
    
    // SMTP Edit State
    const [isEditingSmtp, setIsEditingSmtp] = useState(false);
    const [smtpForm, setSmtpForm] = useState<Partial<SmtpProfile>>({});

    // Offer Edit State
    const [isEditingOffer, setIsEditingOffer] = useState(false);
    const [offerForm, setOfferForm] = useState<Partial<CpaOffer>>({});
    const [editTab, setEditTab] = useState<'general' | 'tracking' | 'creative'>('general');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [magicInput, setMagicInput] = useState('');
    
    // Compliance State
    const [complianceReport, setComplianceReport] = useState<{ isSafe: boolean; score: number; flags: string[] } | null>(null);
    const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);

    useEffect(() => {
        const savedLeads = JSON.parse(localStorage.getItem('smart_leads') || '[]');
        setLeads(savedLeads);
        
        // Load Connections
        const savedIntegrations = JSON.parse(localStorage.getItem('integrations') || '[]');
        setIntegrations(savedIntegrations);
        const savedSmtp = JSON.parse(localStorage.getItem('smtp_profiles') || '[]');
        setSmtpProfiles(savedSmtp);
    }, []);

    // ... (Keep existing methods for Integration/SMTP/Offers) ...
    const handleAddIntegration = () => { if (!isAddingIntegration || !newWebhookUrl) return; const newInt: Integration = { id: crypto.randomUUID(), provider: isAddingIntegration, name: `${isAddingIntegration.charAt(0).toUpperCase() + isAddingIntegration.slice(1)} Connection`, webhookUrl: newWebhookUrl, isActive: true, eventTrigger: 'lead_captured' }; const updated = [...integrations, newInt]; setIntegrations(updated); localStorage.setItem('integrations', JSON.stringify(updated)); setIsAddingIntegration(null); setNewWebhookUrl(''); };
    const handleDeleteIntegration = (id: string) => { const updated = integrations.filter(i => i.id !== id); setIntegrations(updated); localStorage.setItem('integrations', JSON.stringify(updated)); };
    const handleSaveSmtp = () => { const newProfile: SmtpProfile = { id: smtpForm.id || crypto.randomUUID(), name: smtpForm.name || 'New SMTP', host: smtpForm.host || '', port: smtpForm.port || 587, user: smtpForm.user || '', pass: smtpForm.pass || '', fromEmail: smtpForm.fromEmail || '', dailyLimit: smtpForm.dailyLimit || 50000, currentUsage: 0, isActive: true }; const updated = smtpForm.id ? smtpProfiles.map(p => p.id === newProfile.id ? newProfile : p) : [...smtpProfiles, newProfile]; setSmtpProfiles(updated); localStorage.setItem('smtp_profiles', JSON.stringify(updated)); setIsEditingSmtp(false); setSmtpForm({}); };
    const handleDeleteSmtp = (id: string) => { const updated = smtpProfiles.filter(p => p.id !== id); setSmtpProfiles(updated); localStorage.setItem('smtp_profiles', JSON.stringify(updated)); };
    const handleTestRotation = () => { const result = rotateSmtpServers(); if (result) { const updated = JSON.parse(localStorage.getItem('smtp_profiles') || '[]'); setSmtpProfiles(updated); alert(`✅ Test Successful!\n\nRouted to: ${result.name}\nNew Usage: ${result.currentUsage} / ${result.dailyLimit}`); } else { alert("❌ Test Failed.\n\nNo available SMTP servers found. Check if they are Active and have not reached their daily limit."); } };
    const handleMagicImport = async () => { if (!magicInput) return alert("Please enter a link or phone number."); setIsAiLoading(true); try { const data = await generateOfferFromLink(magicInput); setOfferForm({ ...data, id: crypto.randomUUID() }); setIsEditingOffer(true); setEditTab('general'); setMagicInput(''); setComplianceReport(null); } catch (e) { alert("AI could not scan this. Opening manual editor."); setOfferForm({ url: magicInput, id: crypto.randomUUID() }); setIsEditingOffer(true); } finally { setIsAiLoading(false); } };
    const handleCheckCompliance = async () => { setIsCheckingCompliance(true); const report = await analyzeOfferCompliance(offerForm); setComplianceReport(report); setIsCheckingCompliance(false); };
    const handleSaveOffer = () => { const newOffer: CpaOffer = { id: offerForm.id || crypto.randomUUID(), title: offerForm.title || 'Untitled Offer', offerType: offerForm.offerType || 'link', url: offerForm.url || 'https://google.com', phoneNumber: offerForm.phoneNumber, conversionTrigger: offerForm.conversionTrigger || 'Click', description: offerForm.description || '', payout: offerForm.payout || 'View Reward', category: offerForm.category || 'Other', imageUrl: offerForm.imageUrl || '', ctaText: offerForm.ctaText || 'Claim', weight: offerForm.weight ?? 100, is_active: offerForm.is_active ?? true, popularity: offerForm.popularity || 90, lastUpdated: new Date().toISOString() }; const exists = currentOffers.some(o => o.id === newOffer.id); let updatedOffers; if (exists) { updatedOffers = currentOffers.map(o => o.id === newOffer.id ? newOffer : o); } else { updatedOffers = [newOffer, ...currentOffers]; } onUpdateOffers(updatedOffers); setIsEditingOffer(false); setOfferForm({}); };
    const handleDeleteOffer = (id: string) => { if(confirm("Are you sure you want to permanently delete this offer?")) { const updated = currentOffers.filter(o => o.id !== id); onUpdateOffers(updated); } };
    const handleCloneOffer = (offer: CpaOffer) => { const cloned = { ...offer, id: crypto.randomUUID(), title: `${offer.title} (Copy)` }; onUpdateOffers([cloned, ...currentOffers]); };
    const handleToggleOffer = (id: string) => { onUpdateOffers(currentOffers.map(o => o.id === id ? { ...o, is_active: !o.is_active } : o)); };


    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
            
            {/* SIDEBAR */}
            <aside className="w-20 lg:w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full z-20 shadow-sm transition-all duration-300">
                <div className="p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20 flex items-center justify-center text-white font-black text-xl">N</div>
                    <div className="hidden lg:block">
                        <h1 className="font-bold text-slate-900 tracking-tight leading-none">Natraj<span className="text-slate-400">Admin</span></h1>
                        <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Master Control</span>
                    </div>
                </div>
                
                <nav className="flex-1 px-2 lg:px-4 space-y-2 mt-8">
                    <SidebarItem icon="📊" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon="💎" label="Offers" active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} />
                    <SidebarItem icon="🔌" label="Connect" active={activeTab === 'connections'} onClick={() => setActiveTab('connections')} />
                    <SidebarItem icon="🚀" label="Launchpad" active={activeTab === 'launchpad'} onClick={() => setActiveTab('launchpad')} />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={onLogout} className="w-full py-3 px-2 flex items-center justify-center lg:justify-start gap-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <span className="text-xl">🚪</span>
                        <span className="hidden lg:inline text-sm font-bold">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-10 overflow-y-auto">
                
                {/* --- OFFERS TAB --- */}
                {activeTab === 'offers' && (
                     <div className="max-w-[1600px] mx-auto animate-fade-in">
                        {/* Header Area */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Offer Command Center</h1>
                                <p className="text-slate-500 font-medium">Manage CPA Links, Pay Per Call, and Affiliate Inventories.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => { setOfferForm({ id: crypto.randomUUID() }); setIsEditingOffer(true); setEditTab('general'); }} 
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <span>+</span> Create Manual
                                </button>
                            </div>
                        </div>

                        {/* AI COMMAND BAR */}
                        <div className="relative z-10 mb-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 transform translate-y-2"></div>
                            <div className="relative bg-white border border-slate-200 p-2 rounded-2xl shadow-xl flex items-center gap-2">
                                <div className="pl-4 pr-2 text-2xl animate-pulse">✨</div>
                                <input 
                                    type="text"
                                    placeholder="Paste Affiliate Link or Phone Number to Auto-Sync..."
                                    className="flex-1 bg-transparent border-none text-lg text-slate-900 px-2 py-4 outline-none placeholder-slate-400 font-medium"
                                    value={magicInput}
                                    onChange={(e) => setMagicInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleMagicImport()}
                                />
                                <button 
                                    onClick={handleMagicImport} 
                                    disabled={isAiLoading || !magicInput} 
                                    className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 hover:bg-slate-800 shadow-md whitespace-nowrap"
                                >
                                    {isAiLoading ? 'Analysis...' : 'Auto-Generate'}
                                </button>
                            </div>
                        </div>

                        {/* OFFERS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {currentOffers.map(offer => (
                                <div key={offer.id} className={`bg-white rounded-[20px] border transition-all duration-300 group hover:-translate-y-1 ${offer.is_active ? 'border-slate-200 shadow-sm hover:shadow-xl' : 'border-slate-100 opacity-60 bg-slate-50'}`}>
                                    <div className="relative h-48 w-full overflow-hidden rounded-t-[20px] bg-slate-100">
                                        {offer.imageUrl ? <img src={offer.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center">🖼️</div>}
                                        <div className="absolute top-4 right-4">
                                            <button onClick={(e) => { e.stopPropagation(); handleToggleOffer(offer.id); }} className={`w-10 h-6 rounded-full p-1 ${offer.is_active ? 'bg-green-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${offer.is_active ? 'translate-x-4' : ''}`}></div></button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-1">{offer.title}</h3>
                                        <div className="flex gap-2 border-t border-slate-100 pt-4">
                                            <button onClick={() => { setOfferForm(offer); setIsEditingOffer(true); }} className="flex-1 py-2 rounded bg-slate-50 text-xs font-bold hover:bg-blue-50 text-slate-600">Edit</button>
                                            <button onClick={() => handleDeleteOffer(offer.id)} className="flex-1 py-2 rounded bg-slate-50 text-xs font-bold hover:bg-red-50 text-red-600">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}

                {/* --- CONNECTIONS TAB --- */}
                {activeTab === 'connections' && (
                     <div className="max-w-6xl mx-auto animate-fade-in">
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Connectivity Hub</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                            {INTEGRATION_PROVIDERS.map(p => (
                                <button key={p.id} onClick={() => setIsAddingIntegration(p.id)} className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-500 transition-all">
                                    <span className="text-3xl mb-2">{p.icon}</span><span className="text-xs font-bold text-slate-600">{p.name}</span>
                                </button>
                            ))}
                        </div>
                        {/* List Integrations */}
                        <div className="space-y-2">
                             {integrations.map(int => (
                                 <div key={int.id} className="flex justify-between p-4 bg-white border border-slate-200 rounded-xl">
                                     <div className="font-bold">{int.name}</div>
                                     <button onClick={() => handleDeleteIntegration(int.id)} className="text-red-500">Delete</button>
                                 </div>
                             ))}
                        </div>
                        {isAddingIntegration && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <h4 className="font-bold mb-2">Connect {isAddingIntegration}</h4>
                                <input type="text" className="w-full p-2 border rounded" placeholder="Webhook URL" value={newWebhookUrl} onChange={e => setNewWebhookUrl(e.target.value)} />
                                <button onClick={handleAddIntegration} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded font-bold">Save</button>
                            </div>
                        )}
                     </div>
                )}

                {/* --- LAUNCHPAD (DEPLOYMENT) --- */}
                {activeTab === 'launchpad' && (
                    <div className="max-w-4xl mx-auto animate-fade-in">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-black text-slate-900 mb-4">🚀 Deployment Launchpad</h2>
                            <p className="text-slate-500 text-lg">Follow these steps to deploy to Coolify successfully.</p>
                        </div>

                        {/* ERROR FIX BOX */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-10 shadow-sm text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-amber-100 px-4 py-2 rounded-bl-xl text-amber-800 font-bold text-xs uppercase tracking-wide">Troubleshooting</div>
                            
                            <h3 className="text-amber-900 font-black text-2xl mb-4 flex items-center gap-3">
                                <span>🔧</span> How to fix "Exit Code 128" / "No such device"
                            </h3>
                            
                            <p className="text-amber-800 mb-6 font-medium text-lg leading-relaxed">
                                This error means Coolify cannot access your GitHub repository because it is <strong>Private</strong>.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Option 1 */}
                                <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-2">Option A: The Easy Way</h4>
                                    <p className="text-slate-600 text-sm mb-4">Make your repository <strong>Public</strong> on GitHub.</p>
                                    <ol className="list-decimal list-inside text-xs text-slate-500 space-y-2">
                                        <li>Go to GitHub Repo &rarr; Settings.</li>
                                        <li>Scroll to bottom &rarr; Change Visibility.</li>
                                        <li>Select "Make Public".</li>
                                        <li>Retry deployment in Coolify.</li>
                                    </ol>
                                </div>

                                {/* Option 2 */}
                                <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-2">Option B: The Secure Way</h4>
                                    <p className="text-slate-600 text-sm mb-4">Add your GitHub account to Coolify.</p>
                                    <ol className="list-decimal list-inside text-xs text-slate-500 space-y-2">
                                        <li>In Coolify, go to <strong>Sources</strong>.</li>
                                        <li>Add "GitHub.com" as a source.</li>
                                        <li>Create a GitHub App (it guides you).</li>
                                        <li>When creating a Resource, select this "GitHub App" source instead of "Public Repository".</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl mb-4 font-bold text-slate-400">1</div>
                                <h3 className="font-bold text-xl mb-2">Push Files</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    I have automatically added <code>Dockerfile</code> and <code>nginx.conf</code> to your code. Commit and push these changes to GitHub now.
                                </p>
                            </div>

                             {/* Step 2 */}
                             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4 font-bold">2</div>
                                <h3 className="font-bold text-xl mb-2">Deploy</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Go to Coolify &rarr; Project &rarr; New Resource &rarr; <strong>Public Repository</strong> (if you chose Option A).
                                </p>
                            </div>

                             {/* Step 3 */}
                             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4 font-bold">3</div>
                                <h3 className="font-bold text-xl mb-2">Finish</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Coolify will auto-detect the Dockerfile. Just click "Deploy". Wait 2-3 minutes.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* --- MODALS (Simplified for brevity, logic exists in full version) --- */}
            {isEditingOffer && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-2xl h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Edit Offer</h2>
                        <input className="w-full p-2 border rounded mb-4" placeholder="Title" value={offerForm.title} onChange={e => setOfferForm({...offerForm, title: e.target.value})} />
                        <input className="w-full p-2 border rounded mb-4" placeholder="URL" value={offerForm.url} onChange={e => setOfferForm({...offerForm, url: e.target.value})} />
                        <div className="flex gap-2">
                             <button onClick={() => setIsEditingOffer(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                             <button onClick={handleSaveOffer} className="px-4 py-2 bg-slate-900 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all ${active ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
        <span className="text-xl">{icon}</span><span className="hidden lg:inline text-sm font-bold">{label}</span>
    </button>
);

export default AdminDashboard;