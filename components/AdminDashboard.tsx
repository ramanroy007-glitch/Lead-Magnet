
import React, { useState, useEffect } from 'react';
import type { EmailLead, SiteContent, SmtpProfile, UserRole, CpaOffer } from '../types';
import { optimizeOfferText } from '../services/gemini';
import { GoogleGenAI } from "@google/genai";

interface AdminDashboardProps {
    siteContent: SiteContent;
    offers: CpaOffer[];
    onUpdateContent: (newContent: SiteContent) => void;
    onUpdateOffers: (newOffers: CpaOffer[]) => void;
    onNavigateHome: () => void;
    role: UserRole;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ siteContent, offers, onUpdateContent, onUpdateOffers, onNavigateHome, role }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'offers' | 'leads' | 'settings' | 'scripts' | 'deploy'>('dashboard');
  const [leads, setLeads] = useState<EmailLead[]>([]);
  const [smtps, setSmtps] = useState<SmtpProfile[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  
  // Marketing Scripts State
  const [fbPixelId, setFbPixelId] = useState('');
  const [gtmId, setGtmId] = useState('');

  // Bulk Actions State
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  
  // Offer Edit State
  const [editingOffer, setEditingOffer] = useState<Partial<CpaOffer> | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  
  // AI Loading States
  const [aiLoadingState, setAiLoadingState] = useState<{[key: string]: boolean}>({});
  const [aiSuccessState, setAiSuccessState] = useState<{[key: string]: boolean}>({});

  // AI Deployment Assistant State
  const [deployStep, setDeployStep] = useState<number>(1);
  const [deployAiResponse, setDeployAiResponse] = useState('');
  const [isDeployAiLoading, setIsDeployAiLoading] = useState(false);
  const [repoName, setRepoName] = useState('natraj-rewards');

  useEffect(() => {
    try {
        const storedLeadsStr = localStorage.getItem('emailLeads');
        const storedLeads = storedLeadsStr ? JSON.parse(storedLeadsStr) : [];
        if (Array.isArray(storedLeads)) {
            setLeads(storedLeads.sort((a: any, b: any) => {
                const dateA = new Date(a.submittedAt || Date.now()).getTime();
                const dateB = new Date(b.submittedAt || Date.now()).getTime();
                return dateB - dateA;
            }));
        } else {
            setLeads([]);
        }
    } catch (e) {
        console.error("Failed to load leads", e);
        setLeads([]);
    }
    
    try {
        const savedSmtps = localStorage.getItem('crm_smtps');
        if (savedSmtps) {
            const parsed = JSON.parse(savedSmtps);
            setSmtps(parsed);
            const webhook = parsed.find((s: any) => s.provider === 'webhook');
            if (webhook) setWebhookUrl(webhook.host);
        }

        // Load Scripts
        setFbPixelId(localStorage.getItem('crm_fb_pixel') || '');
        setGtmId(localStorage.getItem('crm_gtm_id') || '');

    } catch (e) {
        console.error("Failed to load settings", e);
    }
  }, []);

  const handleExportLeads = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Email,Date,Source\n"
        + leads.map(e => `${e.name},${e.email},${e.submittedAt},Quiz`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingOffer || !editingOffer.title) return;
      
      const newOffer = {
          ...editingOffer,
          id: editingOffer.id || Date.now().toString(),
          isActive: editingOffer.isActive !== undefined ? editingOffer.isActive : true,
          payoutValue: Number(editingOffer.payoutValue) || 0,
          popularity: Number(editingOffer.popularity) || 50
      } as CpaOffer;

      const updatedOffers = editingOffer.id 
        ? offers.map(o => o.id === editingOffer.id ? newOffer : o)
        : [...offers, newOffer];
      
      onUpdateOffers(updatedOffers);
      setIsOfferModalOpen(false);
      setEditingOffer(null);
  };

  const deleteOffer = (id: string) => {
      if(confirm('Are you sure you want to delete this offer?')) {
          onUpdateOffers(offers.filter(o => o.id !== id));
      }
  }

  const handleDeleteLead = (id: string) => {
      if(confirm('Delete this lead?')) {
        const updated = leads.filter(l => l.id !== id);
        setLeads(updated);
        localStorage.setItem('emailLeads', JSON.stringify(updated));
        if (selectedLeadIds.has(id)) {
            const newSet = new Set(selectedLeadIds);
            newSet.delete(id);
            setSelectedLeadIds(newSet);
        }
      }
  };

  const handleBulkDeleteLeads = () => {
      if (confirm(`Are you sure you want to delete ${selectedLeadIds.size} selected leads?`)) {
          const updated = leads.filter(l => !selectedLeadIds.has(l.id));
          setLeads(updated);
          localStorage.setItem('emailLeads', JSON.stringify(updated));
          setSelectedLeadIds(new Set());
      }
  };

  const handleSelectAllLeads = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedLeadIds(new Set(leads.map(l => l.id)));
      } else {
          setSelectedLeadIds(new Set());
      }
  };

  const handleSelectLead = (id: string) => {
      const newSet = new Set(selectedLeadIds);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setSelectedLeadIds(newSet);
  };

  const handleSaveWebhook = () => {
      const newProfile: SmtpProfile = {
          id: 'webhook-1',
          name: 'Lead Integration',
          provider: 'webhook',
          host: webhookUrl,
          port: 0,
          username: '',
          encryption: 'none',
          status: 'active'
      };
      const filtered = smtps.filter(s => s.provider !== 'webhook');
      const updated = [...filtered, newProfile];
      setSmtps(updated);
      localStorage.setItem('crm_smtps', JSON.stringify(updated));
      alert('Integration Saved! New leads will be posted to this URL.');
  };

  const handleSaveScripts = () => {
      localStorage.setItem('crm_fb_pixel', fbPixelId);
      localStorage.setItem('crm_gtm_id', gtmId);
      alert('Tracking scripts saved. (Note: In this demo environment, these scripts are simulated).');
  };

  const handleAiOptimize = async (type: 'title' | 'description' | 'instructions') => {
      if (!editingOffer) return;
      const text = type === 'title' ? editingOffer.title : type === 'description' ? editingOffer.description : editingOffer.instructions;
      if (!text) {
          alert("Please enter some text first for the AI to optimize.");
          return;
      }

      setAiLoadingState(prev => ({...prev, [type]: true}));
      setAiSuccessState(prev => ({...prev, [type]: false}));

      const optimized = await optimizeOfferText(text, type);
      
      setEditingOffer(prev => ({
          ...prev,
          [type]: optimized
      }));

      setAiLoadingState(prev => ({...prev, [type]: false}));
      setAiSuccessState(prev => ({...prev, [type]: true}));

      setTimeout(() => {
          setAiSuccessState(prev => ({...prev, [type]: false}));
      }, 3000);
  };

  const handleGenerateGitCommands = async () => {
      setIsDeployAiLoading(true);
      try {
          const apiKey = process.env.API_KEY || '';
          if(!apiKey) {
            setDeployAiResponse("Error: API Key missing. Showing standard commands instead.\n\n1. `git init`\n2. `git add .`\n3. `git commit -m 'Initial commit'`\n4. `git branch -M main`\n5. `git remote add origin https://github.com/YOUR_USER/${repoName}.git`\n6. `git push -u origin main`");
            setIsDeployAiLoading(false);
            return;
          }
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `
          I am a user trying to push my code to GitHub. My repository name is "${repoName}".
          Please provide the EXACT terminal commands I need to run to initialize git and push this code.
          Wrap the commands in a code block.
          `;
          const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
          setDeployAiResponse(result.text || "Could not generate commands.");
      } catch (e) {
          setDeployAiResponse("AI Service unavailable. Use standard git commands.");
      } finally {
          setIsDeployAiLoading(false);
      }
  };

  // Simulated chart data
  const chartHeight = [40, 65, 30, 85, 50, 95, 75];

  return (
    <div className="min-h-screen bg-[#0f1014] flex font-sans text-slate-300">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1d29] border-r border-white/5 flex flex-col fixed inset-y-0 z-20 shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-[#14161f]">
              <h2 className="text-xl font-extrabold text-white tracking-tight">NATRAJ<span className="text-brand-primary">CRM</span></h2>
              <p className="text-xs text-slate-500 mt-1">Command Center</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {[
                { id: 'dashboard', icon: '📊', label: 'Overview' },
                { id: 'offers', icon: '🏷️', label: 'Manage Offers' },
                { id: 'leads', icon: '👥', label: 'Email Leads' },
                { id: 'settings', icon: '⚡', label: 'Integrations' },
                { id: 'scripts', icon: '📈', label: 'Pixels & Scripts' },
                { id: 'deploy', icon: '🚀', label: 'Deploy & Auto' },
              ].map((item) => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-colors ${activeTab === item.id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <span>{item.icon}</span> {item.label}
                </button>
              ))}
          </nav>

          <div className="p-4 border-t border-white/5 bg-[#0f1014]">
              <button onClick={onNavigateHome} className="w-full py-3 border border-white/10 rounded-lg text-sm font-bold text-slate-400 hover:bg-white/5 flex items-center justify-center gap-2 transition-all hover:text-white">
                  <span>←</span> Exit to Site
              </button>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
              <div className="max-w-6xl mx-auto animate-fade-in-up">
                  <h1 className="text-2xl font-bold text-white mb-8">Executive Overview</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-[#1a1d29] p-6 rounded-2xl shadow-lg border border-white/5 hover:border-brand-primary/30 transition-all">
                          <p className="text-slate-500 text-xs font-bold uppercase mb-2">Total Leads Generated</p>
                          <div className="flex items-end justify-between">
                              <h2 className="text-4xl font-extrabold text-white">{leads.length}</h2>
                              <span className="text-green-400 text-sm font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">+12%</span>
                          </div>
                      </div>
                      <div className="bg-[#1a1d29] p-6 rounded-2xl shadow-lg border border-white/5 hover:border-brand-primary/30 transition-all">
                          <p className="text-slate-500 text-xs font-bold uppercase mb-2">Offers Live</p>
                          <div className="flex items-end justify-between">
                              <h2 className="text-4xl font-extrabold text-white">{offers.filter(o => o.isActive).length}</h2>
                              <span className="text-blue-400 text-sm font-bold bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">Active</span>
                          </div>
                      </div>
                      <div className="bg-[#1a1d29] p-6 rounded-2xl shadow-lg border border-white/5 hover:border-brand-primary/30 transition-all">
                          <p className="text-slate-500 text-xs font-bold uppercase mb-2">Potential Value</p>
                          <div className="flex items-end justify-between">
                              <h2 className="text-4xl font-extrabold text-white">${(leads.length * 2.50).toFixed(2)}</h2>
                              <span className="text-slate-500 text-xs">@ $2.50 avg CPA</span>
                          </div>
                      </div>
                  </div>

                  <div className="bg-[#1a1d29] p-8 rounded-2xl shadow-lg border border-white/5 mb-8">
                      <h3 className="text-lg font-bold text-white mb-6">Traffic Volume (Real-time Simulation)</h3>
                      <div className="h-64 flex items-end justify-between gap-4">
                          {chartHeight.map((h, i) => (
                              <div key={i} className="w-full bg-white/5 rounded-t-lg relative group overflow-hidden">
                                  <div 
                                    className="absolute bottom-0 w-full bg-brand-primary rounded-t-lg transition-all duration-1000 group-hover:bg-brand-secondary"
                                    style={{ height: `${h}%` }}
                                  ></div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* OFFERS TAB */}
          {activeTab === 'offers' && (
              <div className="max-w-6xl mx-auto animate-fade-in-up">
                  <div className="flex justify-between items-center mb-8">
                      <div>
                          <h1 className="text-2xl font-bold text-white">Offer Management</h1>
                          <p className="text-slate-400">Add or edit your CPA affiliate links here.</p>
                      </div>
                      <button 
                        onClick={() => { setEditingOffer({}); setIsOfferModalOpen(true); }}
                        className="px-6 py-2 bg-brand-primary hover:bg-[#0483ee] text-white rounded-lg font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2"
                      >
                          + New Offer
                      </button>
                  </div>

                  <div className="bg-[#1a1d29] rounded-xl shadow-lg border border-white/5 overflow-hidden">
                      <table className="w-full text-left">
                          <thead className="bg-[#14161f] text-xs font-bold text-slate-500 uppercase border-b border-white/5">
                              <tr>
                                  <th className="p-4">Title</th>
                                  <th className="p-4">Category</th>
                                  <th className="p-4">Payout</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                              {offers.map(offer => (
                                  <tr key={offer.id} className="hover:bg-white/5 transition-colors">
                                      <td className="p-4">
                                          <div className="font-bold text-white">{offer.title}</div>
                                          <div className="text-xs text-blue-400 font-mono truncate max-w-xs">{offer.url}</div>
                                      </td>
                                      <td className="p-4"><span className="px-2 py-1 bg-white/5 text-slate-300 rounded text-xs font-semibold capitalize">{offer.category}</span></td>
                                      <td className="p-4 text-sm font-bold text-green-400">{offer.payout}</td>
                                      <td className="p-4">
                                          {offer.isActive 
                                            ? <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">● Active</span>
                                            : <span className="text-slate-400 text-xs font-bold bg-white/5 px-2 py-1 rounded">● Paused</span>
                                          }
                                      </td>
                                      <td className="p-4 text-right space-x-2">
                                          <button 
                                            onClick={() => { setEditingOffer(offer); setIsOfferModalOpen(true); }}
                                            className="text-brand-primary hover:text-white text-sm font-semibold transition-colors"
                                          >Edit</button>
                                          <button 
                                            onClick={() => deleteOffer(offer.id)}
                                            className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
                                          >Delete</button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {/* LEADS TAB */}
          {activeTab === 'leads' && (
              <div className="max-w-6xl mx-auto animate-fade-in-up">
                  <div className="flex justify-between items-center mb-8">
                      <div>
                          <h1 className="text-2xl font-bold text-white">Lead Database</h1>
                          <p className="text-slate-400">Collected emails from the quiz.</p>
                      </div>
                      <div className="flex gap-4 items-center">
                          {selectedLeadIds.size > 0 && (
                              <button 
                                onClick={handleBulkDeleteLeads}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-bold transition-all border border-red-500/20"
                              >
                                Delete ({selectedLeadIds.size})
                              </button>
                          )}
                          <button onClick={handleExportLeads} className="px-6 py-2 bg-white text-black hover:bg-slate-200 rounded-lg font-bold shadow-md transition-all">
                              Download CSV
                          </button>
                      </div>
                  </div>

                  <div className="bg-[#1a1d29] rounded-xl shadow-lg border border-white/5 overflow-hidden">
                      <table className="w-full text-left">
                          <thead className="bg-[#14161f] text-xs font-bold text-slate-500 uppercase border-b border-white/5">
                              <tr>
                                  <th className="p-4 w-10">
                                      <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-brand-primary focus:ring-brand-primary focus:ring-offset-slate-900"
                                        checked={leads.length > 0 && selectedLeadIds.size === leads.length}
                                        onChange={handleSelectAllLeads}
                                      />
                                  </th>
                                  <th className="p-4">User</th>
                                  <th className="p-4">Email</th>
                                  <th className="p-4">Submitted</th>
                                  <th className="p-4 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                              {leads.map(lead => (
                                  <tr key={lead.id} className={`hover:bg-white/5 transition-colors ${selectedLeadIds.has(lead.id) ? 'bg-brand-primary/10' : ''}`}>
                                      <td className="p-4">
                                          <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-brand-primary focus:ring-brand-primary focus:ring-offset-slate-900"
                                            checked={selectedLeadIds.has(lead.id)}
                                            onChange={() => handleSelectLead(lead.id)}
                                          />
                                      </td>
                                      <td className="p-4 flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-slate-300 text-xs">
                                              {lead.name.charAt(0)}
                                          </div>
                                          <span className="font-bold text-white">{lead.name}</span>
                                      </td>
                                      <td className="p-4 text-sm text-slate-300">{lead.email}</td>
                                      <td className="p-4 text-sm text-slate-500">{new Date(lead.submittedAt).toLocaleDateString()}</td>
                                      <td className="p-4 text-right">
                                          <button onClick={() => handleDeleteLead(lead.id)} className="text-slate-500 hover:text-red-400">×</button>
                                      </td>
                                  </tr>
                              ))}
                              {leads.length === 0 && (
                                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No leads captured yet.</td></tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {/* SETTINGS (WEBHOOKS) TAB */}
          {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto animate-fade-in-up">
                  <h1 className="text-2xl font-bold text-white mb-8">Auto-Responders</h1>
                  
                  <div className="bg-[#1a1d29] p-8 rounded-xl shadow-lg border border-white/5 mb-8">
                      <div className="flex items-start gap-4 mb-6">
                           <div className="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl border border-indigo-500/30">⚡</div>
                           <div>
                                <h3 className="font-bold text-lg text-white">Webhook Connection</h3>
                                <p className="text-sm text-slate-400">Send leads instantly to Zapier, Make, or Pabbly.</p>
                           </div>
                      </div>
                      
                      <div className="mb-6">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Webhook URL</label>
                          <input 
                                className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-primary font-mono text-sm placeholder-slate-600" 
                                placeholder="https://hooks.zapier.com/hooks/catch/..." 
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                           />
                      </div>

                      <div className="text-right">
                          <button onClick={handleSaveWebhook} className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-[#0483ee] transition-colors">
                              Save Configuration
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* SCRIPTS (PIXELS) TAB */}
          {activeTab === 'scripts' && (
              <div className="max-w-4xl mx-auto animate-fade-in-up">
                  <h1 className="text-2xl font-bold text-white mb-8">Tracking & Pixels</h1>
                  
                  <div className="bg-[#1a1d29] p-8 rounded-xl shadow-lg border border-white/5">
                      <div className="flex items-start gap-4 mb-6">
                           <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl border border-blue-500/30">📈</div>
                           <div>
                                <h3 className="font-bold text-lg text-white">Ad Tracking</h3>
                                <p className="text-sm text-slate-400">Install your tracking IDs here to measure conversions.</p>
                           </div>
                      </div>
                      
                      <div className="space-y-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Facebook Pixel ID</label>
                              <input 
                                    className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-primary font-mono text-sm placeholder-slate-600" 
                                    placeholder="e.g. 123456789012345" 
                                    value={fbPixelId}
                                    onChange={(e) => setFbPixelId(e.target.value)}
                               />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Google Tag Manager / Analytics ID</label>
                              <input 
                                    className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-primary font-mono text-sm placeholder-slate-600" 
                                    placeholder="e.g. G-ABC123XYZ" 
                                    value={gtmId}
                                    onChange={(e) => setGtmId(e.target.value)}
                               />
                          </div>
                      </div>

                      <div className="mt-8 text-right">
                          <button onClick={handleSaveScripts} className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-[#0483ee] transition-colors">
                              Update Tracking
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* AI DEPLOYMENT MANAGER TAB */}
          {activeTab === 'deploy' && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <h1 className="text-2xl font-bold text-white mb-6">AI Deployment Manager</h1>
                
                {/* Status Bar */}
                <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
                     <button onClick={() => setDeployStep(1)} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${deployStep === 1 ? 'bg-brand-primary text-white' : 'bg-white/5 text-slate-500'}`}>1. GitHub & Version Control</button>
                     <span className="text-slate-600">→</span>
                     <button onClick={() => setDeployStep(2)} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${deployStep === 2 ? 'bg-brand-primary text-white' : 'bg-white/5 text-slate-500'}`}>2. Hosting & Domain</button>
                     <span className="text-slate-600">→</span>
                     <button onClick={() => setDeployStep(3)} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${deployStep === 3 ? 'bg-brand-primary text-white' : 'bg-white/5 text-slate-500'}`}>3. Email Automation</button>
                </div>

                {deployStep === 1 && (
                    <div className="bg-[#1a1d29] p-8 rounded-xl shadow-lg border border-white/5">
                        <div className="flex gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-2xl border border-orange-500/30 shrink-0">1</div>
                            <div>
                                <h3 className="font-bold text-xl text-white mb-2">Version Control (GitHub)</h3>
                                <p className="text-slate-400 mb-4">
                                    To deploy automatically, you need to push your code to GitHub. <br/>
                                    Enter your repository name below, and our AI will write the commands for you.
                                </p>
                            </div>
                        </div>

                        <div className="bg-black/30 p-6 rounded-xl border border-white/10 mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Repository Name</label>
                            <div className="flex gap-2">
                                <input 
                                    value={repoName} 
                                    onChange={(e) => setRepoName(e.target.value)} 
                                    className="flex-1 bg-[#0f1014] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-primary" 
                                />
                                <button 
                                    onClick={handleGenerateGitCommands} 
                                    disabled={isDeployAiLoading}
                                    className="px-4 py-2 bg-brand-primary text-white rounded-lg font-bold"
                                >
                                    {isDeployAiLoading ? 'Thinking...' : 'Generate Commands'}
                                </button>
                            </div>

                            {deployAiResponse && (
                                <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-white/5">
                                    <pre className="text-green-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                                        {deployAiResponse}
                                    </pre>
                                </div>
                            )}
                        </div>
                        
                        <div className="text-right">
                             <button onClick={() => setDeployStep(2)} className="text-brand-primary font-bold hover:underline">Next: Connect Hosting →</button>
                        </div>
                    </div>
                )}

                {deployStep === 2 && (
                    <div className="bg-[#1a1d29] p-8 rounded-xl shadow-lg border border-white/5">
                        <div className="flex gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-2xl border border-blue-500/30 shrink-0">2</div>
                            <div>
                                <h3 className="font-bold text-xl text-white mb-2">Hosting & Domain</h3>
                                <p className="text-slate-400">
                                    We recommend <strong>Vercel</strong> for free, one-click hosting with free SSL.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                 <h4 className="font-bold text-white mb-2">1. Connect Vercel</h4>
                                 <p className="text-sm text-slate-400">Go to Vercel.com -> Add New Project -> Import from GitHub -> Select "{repoName}". Click Deploy.</p>
                             </div>
                             <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                 <h4 className="font-bold text-white mb-2">2. Add Domain</h4>
                                 <p className="text-sm text-slate-400">In Vercel Settings -> Domains. Type <code>www.yourdomain.com</code>. Copy the CNAME value (e.g., cname.vercel-dns.com) to your domain registrar (GoDaddy/Namecheap).</p>
                             </div>
                        </div>

                         <div className="text-right mt-6">
                             <button onClick={() => setDeployStep(3)} className="text-brand-primary font-bold hover:underline">Next: Email Automation →</button>
                        </div>
                    </div>
                )}

                {deployStep === 3 && (
                    <div className="bg-[#1a1d29] p-8 rounded-xl shadow-lg border border-white/5">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-2xl border border-green-500/30 shrink-0">3</div>
                            <div>
                                <h3 className="font-bold text-xl text-white mb-2">Email Marketing Automation</h3>
                                <p className="text-slate-400 mb-4">
                                    How to connect leads to Mailchimp/AWeber automatically:
                                </p>
                                <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
                                    <li>Go to <strong>Zapier.com</strong> and create a new Zap.</li>
                                    <li>Trigger: Select "Webhooks by Zapier" -> "Catch Hook".</li>
                                    <li>Copy the URL provided by Zapier.</li>
                                    <li>Go to the <button onClick={() => setActiveTab('settings')} className="text-brand-primary underline">Integrations Tab</button> in this dashboard and paste it.</li>
                                    <li>Back in Zapier, test the trigger.</li>
                                    <li>Action: Select "Mailchimp" -> "Add Subscriber". Map the email field.</li>
                                    <li>Turn on the Zap. Done!</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                )}

            </div>
          )}

      </div>

      {/* Offer Edit Modal (Optimized UI) */}
      {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#1a1d29] rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">{editingOffer?.id ? 'Edit Offer' : 'Create New Offer'}</h3>
                  <form onSubmit={handleSaveOffer} className="space-y-4">
                      {/* ... (Existing form fields unchanged) ... */}
                      {/* Internal Title Field */}
                      <div>
                          <div className="flex justify-between items-center mb-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Internal Title</label>
                              <button 
                                type="button" 
                                onClick={() => handleAiOptimize('title')} 
                                disabled={aiLoadingState['title']} 
                                className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors ${aiSuccessState['title'] ? 'bg-green-500/20 text-green-400' : 'bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30'}`}
                              >
                                {aiLoadingState['title'] ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></span>
                                        Generating...
                                    </>
                                ) : aiSuccessState['title'] ? (
                                    '✓ Optimized'
                                ) : (
                                    '✨ AI Polish'
                                )}
                              </button>
                          </div>
                          <input required value={editingOffer?.title || ''} onChange={e => setEditingOffer({...editingOffer, title: e.target.value})} className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-2.5 text-sm focus:border-brand-primary outline-none text-white placeholder-slate-600" placeholder="e.g. Win a $500 Gift Card" />
                      </div>
                      
                      {/* Tracking Link Field */}
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tracking Link</label>
                          <input required value={editingOffer?.url || ''} onChange={e => setEditingOffer({...editingOffer, url: e.target.value})} className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-2.5 text-sm font-mono text-blue-400 placeholder-slate-600" placeholder="https://..." />
                      </div>

                      {/* Category & Payout Row */}
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                              <select value={editingOffer?.category || 'sweepstakes'} onChange={e => setEditingOffer({...editingOffer, category: e.target.value as any})} className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-brand-primary outline-none">
                                  <option value="sweepstakes">Sweepstakes</option>
                                  <option value="survey">Survey</option>
                                  <option value="app">App Install</option>
                                  <option value="finance">Finance</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payout Display</label>
                              <input value={editingOffer?.payout || ''} onChange={e => setEditingOffer({...editingOffer, payout: e.target.value})} className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-2.5 text-sm text-white placeholder-slate-600" placeholder="$2.50 or 'Free'" />
                          </div>
                      </div>

                      {/* Description Field (With AI Button) */}
                      <div>
                          <div className="flex justify-between items-center mb-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                              <button 
                                type="button" 
                                onClick={() => handleAiOptimize('description')} 
                                disabled={aiLoadingState['description']} 
                                className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors ${aiSuccessState['description'] ? 'bg-green-500/20 text-green-400' : 'bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30'}`}
                              >
                                {aiLoadingState['description'] ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></span>
                                        Thinking...
                                    </>
                                ) : aiSuccessState['description'] ? (
                                    '✓ Optimized'
                                ) : (
                                    '✨ AI Polish'
                                )}
                              </button>
                          </div>
                          <textarea 
                            value={editingOffer?.description || ''} 
                            onChange={e => setEditingOffer({...editingOffer, description: e.target.value})} 
                            className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-2.5 text-sm h-20 resize-none text-white placeholder-slate-600 focus:border-brand-primary outline-none" 
                            placeholder="Short persuasive text..." 
                          />
                      </div>

                      {/* Instructions Field (With AI Button) */}
                      <div>
                          <div className="flex justify-between items-center mb-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Instructions (Optional)</label>
                               <button 
                                type="button" 
                                onClick={() => handleAiOptimize('instructions')} 
                                disabled={aiLoadingState['instructions']} 
                                className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors ${aiSuccessState['instructions'] ? 'bg-green-500/20 text-green-400' : 'bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30'}`}
                              >
                                {aiLoadingState['instructions'] ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></span>
                                        Thinking...
                                    </>
                                ) : aiSuccessState['instructions'] ? (
                                    '✓ Optimized'
                                ) : (
                                    '✨ Auto-Steps'
                                )}
                              </button>
                          </div>
                          <textarea 
                            value={editingOffer?.instructions || ''} 
                            onChange={e => setEditingOffer({...editingOffer, instructions: e.target.value})} 
                            className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-2.5 text-sm h-20 resize-none text-white placeholder-slate-600 focus:border-brand-primary outline-none" 
                            placeholder="Step 1: Click link..." 
                          />
                      </div>

                      {/* Image URL Field */}
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL (Optional)</label>
                          <input value={editingOffer?.imageUrl || ''} onChange={e => setEditingOffer({...editingOffer, imageUrl: e.target.value})} className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-2.5 text-sm text-white placeholder-slate-600" placeholder="https://..." />
                      </div>

                      <div className="flex gap-3 pt-6">
                          <button type="button" onClick={() => setIsOfferModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-lg transition-colors border border-white/5">Cancel</button>
                          <button type="submit" className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-[#0483ee] shadow-lg shadow-brand-primary/20 transition-colors">Save Offer</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
