
import React, { useState, useEffect } from 'react';
import type { SmartLead, CpaOffer, SiteContentConfig, QuizConfig, VersionData, Integration, IntegrationProvider } from '../types';
import { generateOfferFromLink } from '../services/gemini';
import { saveLead } from '../services/smartCapture';

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

const INTEGRATION_GUIDE = [
    { id: 'zapier', name: 'Zapier / Make', icon: '⚡', desc: 'Recommended: Connects to Mailchimp, Sheets, etc.' },
    { id: 'slack', name: 'Slack / Discord', icon: '💬', desc: 'Get notified in a channel for every lead.' },
    { id: 'custom', name: 'Custom Backend', icon: '🔌', desc: 'Direct connection to your own server.' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    onLogout, 
    currentOffers, 
    onUpdateOffers,
}) => {
    const [activeTab, setActiveTab] = useState<'offers' | 'leads' | 'connections' | 'deploy'>('offers');
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [leads, setLeads] = useState<SmartLead[]>([]);
    const [isAddingIntegration, setIsAddingIntegration] = useState<boolean>(false);
    const [newWebhookUrl, setNewWebhookUrl] = useState('');
    const [integrationName, setIntegrationName] = useState('My n8n Webhook');
    
    // Offer State
    const [isEditingOffer, setIsEditingOffer] = useState(false);
    const [offerForm, setOfferForm] = useState<Partial<CpaOffer>>({});
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [magicInput, setMagicInput] = useState('');

    useEffect(() => {
        const savedIntegrations = JSON.parse(localStorage.getItem('integrations') || '[]');
        setIntegrations(savedIntegrations);
        const savedLeads = JSON.parse(localStorage.getItem('smart_leads') || '[]');
        setLeads(savedLeads);
    }, []);

    // --- INTEGRATION LOGIC ---
    const handleAddIntegration = () => { 
        if (!newWebhookUrl) return; 
        const newInt: Integration = { 
            id: crypto.randomUUID(), 
            provider: 'zapier', 
            name: integrationName, 
            webhookUrl: newWebhookUrl, 
            isActive: true, 
            eventTrigger: 'lead_captured' 
        }; 
        const updated = [...integrations, newInt]; 
        setIntegrations(updated); 
        localStorage.setItem('integrations', JSON.stringify(updated)); 
        setIsAddingIntegration(false); 
        setNewWebhookUrl(''); 
    };

    const handleDeleteIntegration = (id: string) => { 
        const updated = integrations.filter(i => i.id !== id); 
        setIntegrations(updated); 
        localStorage.setItem('integrations', JSON.stringify(updated)); 
    };

    const handleTestIntegration = async (url: string) => {
        try {
            const testLead: SmartLead = {
                id: 'test_lead_123',
                email: 'test.admin@example.com',
                source: 'manual_entry',
                timestamp: new Date().toISOString(),
                device: 'desktop',
                status: 'synced',
                quiz_data: { goal: 'Test Connection' }
            };
            
            alert(`Sending test payload to: ${url}...`);
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: 'test_ping', lead: testLead })
            });
            alert("✅ Success! Check your n8n/Zapier history.");
        } catch (e) {
            alert("❌ Failed. Check CORS settings or URL validity.");
            console.error(e);
        }
    };

    // --- CSV EXPORT LOGIC ---
    const downloadCsv = () => {
        if (leads.length === 0) return alert("No leads to export.");
        
        const headers = ["ID", "Email", "Date", "Source", "Device", "Status"];
        const rows = leads.map(l => [l.id, l.email, l.timestamp, l.source, l.device, l.status]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `natraj_leads_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    // --- OFFER LOGIC ---
    const handleMagicImport = async () => { if (!magicInput) return; setIsAiLoading(true); try { const data = await generateOfferFromLink(magicInput); setOfferForm({ ...data, id: crypto.randomUUID() }); setIsEditingOffer(true); setMagicInput(''); } finally { setIsAiLoading(false); } };
    const handleSaveOffer = () => { const newOffer: CpaOffer = { id: offerForm.id || crypto.randomUUID(), title: offerForm.title || 'Untitled Offer', offerType: offerForm.offerType || 'link', url: offerForm.url || '#', weight: offerForm.weight || 100, is_active: offerForm.is_active ?? true, imageUrl: offerForm.imageUrl, description: offerForm.description, payout: offerForm.payout, category: offerForm.category }; const updatedOffers = offerForm.id ? currentOffers.map(o => o.id === offerForm.id ? { ...o, ...newOffer } : o) : [newOffer, ...currentOffers]; onUpdateOffers(updatedOffers); setIsEditingOffer(false); setOfferForm({}); };
    const handleDeleteOffer = (id: string) => { if(confirm("Delete this offer?")) { onUpdateOffers(currentOffers.filter(o => o.id !== id)); } };
    const handleToggleOffer = (id: string) => { onUpdateOffers(currentOffers.map(o => o.id === id ? { ...o, is_active: !o.is_active } : o)); };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
            <aside className="w-20 lg:w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full z-20 shadow-sm">
                <div className="p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3"><div className="w-10 h-10 bg-slate-900 rounded-xl shadow-lg flex items-center justify-center text-white font-black text-xl">N</div><div className="hidden lg:block"><h1 className="font-bold text-slate-900 tracking-tight">Natraj<span className="text-slate-400">Admin</span></h1></div></div>
                <nav className="flex-1 px-2 lg:px-4 space-y-2 mt-8">
                    <SidebarItem icon="💎" label="Offers" active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} />
                    <SidebarItem icon="👥" label="Lead Database" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
                    <SidebarItem icon="🔌" label="Integrations" active={activeTab === 'connections'} onClick={() => setActiveTab('connections')} />
                    <SidebarItem icon="🚀" label="Deploy" active={activeTab === 'deploy'} onClick={() => setActiveTab('deploy')} />
                </nav>
                <div className="p-4 border-t border-slate-100"><button onClick={onLogout} className="w-full py-3 px-2 flex items-center justify-center lg:justify-start gap-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><span className="text-xl">🚪</span><span className="hidden lg:inline text-sm font-bold">Log Out</span></button></div>
            </aside>

            <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-10 overflow-y-auto">
                {activeTab === 'offers' && (
                     <div className="max-w-[1600px] mx-auto animate-fade-in">
                        <div className="flex justify-between items-start mb-10"><h1 className="text-4xl font-black text-slate-900">Offer Command</h1></div>
                        <div className="relative z-10 mb-12"><div className="relative bg-white border p-2 rounded-2xl shadow-xl flex items-center gap-2"><input type="text" placeholder="Paste Affiliate Link..." className="flex-1 bg-transparent text-lg px-2 py-4 outline-none" value={magicInput} onChange={(e) => setMagicInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleMagicImport()} /><button onClick={handleMagicImport} disabled={isAiLoading || !magicInput} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold">{isAiLoading ? 'Analysis...' : 'Auto-Generate'}</button></div></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {currentOffers.map(offer => (
                                <div key={offer.id} className={`bg-white rounded-2xl border ${offer.is_active ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60 bg-slate-50'}`}>
                                    <div className="relative h-48 w-full bg-slate-100 rounded-t-2xl"><img src={offer.imageUrl} className="w-full h-full object-cover rounded-t-2xl" /><div className="absolute top-4 right-4"><button onClick={() => handleToggleOffer(offer.id)} className={`w-10 h-6 rounded-full p-1 ${offer.is_active ? 'bg-green-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${offer.is_active ? 'translate-x-4' : ''}`}></div></button></div></div>
                                    <div className="p-5"><h3 className="font-bold text-slate-900 text-lg">{offer.title}</h3><div className="flex gap-2 pt-4"><button onClick={() => { setOfferForm(offer); setIsEditingOffer(true); }} className="flex-1 py-2 rounded bg-slate-50 text-xs font-bold">Edit</button><button onClick={() => handleDeleteOffer(offer.id)} className="flex-1 py-2 rounded bg-slate-50 text-xs font-bold text-red-600">Delete</button></div></div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
                
                {activeTab === 'leads' && (
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900">Captured Leads</h2>
                                <p className="text-slate-500">Local backup of your data.</p>
                            </div>
                            <button onClick={downloadCsv} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                                <span>📥</span> Download CSV
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.length === 0 ? (
                                        <tr><td colSpan={4} className="p-8 text-center text-slate-400">No leads captured yet.</td></tr>
                                    ) : (
                                        leads.slice().reverse().slice(0, 50).map(lead => (
                                            <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="p-4 font-bold text-slate-800">{lead.email}</td>
                                                <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">{lead.status}</span></td>
                                                <td className="p-4 text-slate-500 text-sm">{new Date(lead.timestamp).toLocaleDateString()}</td>
                                                <td className="p-4 text-slate-500 text-sm">{lead.source}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'connections' && (
                     <div className="max-w-4xl mx-auto animate-fade-in">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Integrations</h2>
                        
                        {/* COOLIFY / VPS SPECIFIC GUIDE */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-8">
                            <h3 className="font-bold text-indigo-900 text-lg mb-2">🚀 Coolify / VPS User Guide</h3>
                            <p className="text-indigo-800 text-sm leading-relaxed mb-4">
                                Since you are using Coolify, you don't need to pay for Zapier! 
                                Install <strong>n8n</strong> (workflow automation) on your Coolify server for free.
                            </p>
                            <ol className="list-decimal pl-5 space-y-2 text-sm text-indigo-800">
                                <li>In Coolify: Add Resource → <strong>n8n</strong></li>
                                <li>In n8n: Create a workflow with a <strong>Webhook Trigger</strong> (POST)</li>
                                <li>In n8n: Add an <strong>AWeber</strong> or <strong>GetResponse</strong> node to add the email</li>
                                <li>Copy the n8n Webhook URL and paste it below. Done!</li>
                            </ol>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-700">Active Webhooks</h3>
                            <button onClick={() => setIsAddingIntegration(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm">+ Add New Webhook</button>
                        </div>

                        <div className="space-y-3 mb-8"> 
                            {integrations.length === 0 && <p className="text-slate-400 italic">No webhooks configured yet.</p>}
                            {integrations.map(int => (
                                <div key={int.id} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">⚡</div>
                                        <div>
                                            <div className="font-bold text-slate-900">{int.name}</div>
                                            <div className="text-xs text-slate-400 font-mono truncate max-w-xs">{int.webhookUrl}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleTestIntegration(int.webhookUrl)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-600">Test</button>
                                        <button onClick={() => handleDeleteIntegration(int.id)} className="px-3 py-1 bg-red-50 hover:bg-red-100 rounded text-xs font-bold text-red-600">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isAddingIntegration && (
                            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl mb-8 animate-fade-in-up">
                                <h4 className="font-bold text-lg mb-4">Add Universal Webhook</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Integration Name</label>
                                        <input className="w-full p-3 border rounded-xl" placeholder="e.g. n8n Main List" value={integrationName} onChange={e => setIntegrationName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Webhook URL (From n8n/Zapier/Make)</label>
                                        <input className="w-full p-3 border rounded-xl font-mono text-sm" placeholder="https://n8n.your-domain.com/webhook/..." value={newWebhookUrl} onChange={e => setNewWebhookUrl(e.target.value)} />
                                    </div>
                                    <div className="flex gap-2 justify-end pt-2">
                                        <button onClick={() => setIsAddingIntegration(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
                                        <button onClick={handleAddIntegration} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg">Save Connection</button>
                                    </div>
                                </div>
                            </div>
                        )}
                     </div>
                )}
                {activeTab === 'deploy' && <DeploymentGuide />}
            </main>
            {isEditingOffer && (<div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50"><div className="bg-white p-6 rounded-2xl w-full max-w-lg"><h2 className="text-2xl font-bold mb-4">Edit Offer</h2><input className="w-full p-2 border rounded mb-2" placeholder="Title" value={offerForm.title || ''} onChange={e => setOfferForm({...offerForm, title: e.target.value})} /><div className="flex gap-2"><button onClick={() => setIsEditingOffer(false)}>Cancel</button><button onClick={handleSaveOffer} className="px-4 py-2 bg-slate-900 text-white rounded">Save</button></div></div></div>)}
        </div>
    );
};

const DeploymentGuide = () => {
    const GEMINI_API_KEY_INSTRUCTION = `API_KEY="YOUR_API_KEY_HERE"`;
    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
    
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-black text-slate-900 mb-4">🚀 Next-Level Deployment</h2>
            <p className="text-slate-500 text-lg mb-10">Deploy your customized rewards website in minutes using GitHub and Coolify.</p>
            
            <div className="space-y-8">
                <Step number="1" title="Push to GitHub">
                    <p>First, get your project code into a new GitHub repository. This will be the source for your live website.</p>
                    <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900">Create a New GitHub Repo</a>
                </Step>
                <Step number="2" title="Deploy with Coolify">
                     <p>Coolify is a powerful open-source platform that makes hosting simple. Connect your GitHub account and point it to your new repository.</p>
                    <a href="https://coolify.io/" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Go to Coolify Dashboard</a>
                </Step>
                <Step number="3" title="Set Environment Variables">
                    <p>In your Coolify project settings, you must add your Google AI API key so the AI features will work on your live site. This keeps your key secure.</p>
                    <div className="mt-4 bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-700 relative">
                        <button onClick={() => copyToClipboard(GEMINI_API_KEY_INSTRUCTION)} className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded">Copy</button>
                        {GEMINI_API_KEY_INSTRUCTION}
                    </div>
                </Step>
                 <Step number="4" title="Launch!">
                    <p>Once you've added the environment variable, trigger a new deployment in Coolify. Your site will be live on the internet!</p>
                </Step>
            </div>
        </div>
    );
};
const Step: React.FC<{number: string, title: string, children: React.ReactNode}> = ({number, title, children}) => (<div className="bg-white p-8 rounded-2xl border shadow-sm"><div className="flex items-start gap-4"><div className="w-10 h-10 bg-slate-900 text-white font-bold text-lg rounded-full flex items-center justify-center shrink-0">{number}</div><div><h3 className="text-xl font-bold mb-2">{title}</h3><div className="text-slate-600">{children}</div></div></div></div>);

const SidebarItem = ({ icon, label, active, onClick }: any) => (<button onClick={onClick} className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl ${active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><span className="text-xl">{icon}</span><span className="hidden lg:inline text-sm font-bold">{label}</span></button>);

export default AdminDashboard;
