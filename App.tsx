import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import HowItWorks from './components/HowItWorks';
import SocialProof from './components/SocialProof';
import SmartHero from './components/SmartHero';
import OfferWall from './components/OfferWall';
import InfoPage from './components/InfoPage';
import LoginModal from './components/LoginModal';
import AiGuide from './components/AiGuide';
import VerifyEmail from './components/VerifyEmail';
import { performRedirect } from './services/redirectEngine';
import type { SmartLead, CpaOffer, AppConfig, SiteContentConfig, QuizConfig, VersionData } from './types';
import { DEFAULT_OFFERS, DEFAULT_SITE_CONTENT, DEFAULT_QUIZ_CONFIG } from './constants';

const App: React.FC = () => {
    const [page, setPage] = useState<string>('home');
    const [infoPageContent, setInfoPageContent] = useState<{ title: string; content: React.ReactNode } | null>(null);
    const [lastLead, setLastLead] = useState<SmartLead | null>(null);
    const [offers, setOffers] = useState<CpaOffer[]>(DEFAULT_OFFERS);
    const [siteContent, setSiteContent] = useState<SiteContentConfig>(DEFAULT_SITE_CONTENT);
    const [quizConfig, setQuizConfig] = useState<QuizConfig>(DEFAULT_QUIZ_CONFIG);
    const [versionHistory, setVersionHistory] = useState<VersionData[]>([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    
    const [config, setConfig] = useState<AppConfig>({ 
        brandName: 'Natraj Rewards', 
        headline: '', 
        defaultCpaUrl: 'https://www.google.com', 
        redirectRule: 'offer_wall' 
    });

    useEffect(() => {
        const savedOffers = localStorage.getItem('cpa_offers');
        if (savedOffers) setOffers(JSON.parse(savedOffers));
        
        const savedConfig = localStorage.getItem('app_config');
        if (savedConfig) setConfig(JSON.parse(savedConfig));

        const savedContent = localStorage.getItem('site_content');
        if (savedContent) setSiteContent(JSON.parse(savedContent));

        const savedQuiz = localStorage.getItem('quiz_config');
        if (savedQuiz) setQuizConfig(JSON.parse(savedQuiz));

        const savedVersions = localStorage.getItem('version_history');
        if (savedVersions) setVersionHistory(JSON.parse(savedVersions));

        // Magical Admin Access: Ctrl + Shift + A
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                window.location.hash = '#/admin-secret-natraj-918';
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Helper to update content from Admin
    const handleUpdateContent = (newContent: SiteContentConfig) => {
        setSiteContent(newContent);
        localStorage.setItem('site_content', JSON.stringify(newContent));
    };

    const handleUpdateOffers = (newOffers: CpaOffer[]) => {
        setOffers(newOffers);
        localStorage.setItem('cpa_offers', JSON.stringify(newOffers));
    };

    const handleUpdateQuizConfig = (newConfig: QuizConfig) => {
        setQuizConfig(newConfig);
        localStorage.setItem('quiz_config', JSON.stringify(newConfig));
    };

    const handleSaveVersion = (note: string) => {
        const newVersion: VersionData = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            note,
            data: {
                siteContent: siteContent,
                offers: offers,
                quizConfig: quizConfig
            }
        };
        const updatedHistory = [newVersion, ...versionHistory].slice(0, 10); // Keep last 10
        setVersionHistory(updatedHistory);
        localStorage.setItem('version_history', JSON.stringify(updatedHistory));
    };

    const handleRestoreVersion = (version: VersionData) => {
        if(confirm(`Restore version from ${new Date(version.timestamp).toLocaleString()}? Current unsaved changes will be lost.`)) {
            setSiteContent(version.data.siteContent);
            setOffers(version.data.offers);
            setQuizConfig(version.data.quizConfig);
            localStorage.setItem('site_content', JSON.stringify(version.data.siteContent));
            localStorage.setItem('cpa_offers', JSON.stringify(version.data.offers));
            localStorage.setItem('quiz_config', JSON.stringify(version.data.quizConfig));
        }
    };

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#/', '').toLowerCase();
            const adminSession = localStorage.getItem('admin_session') === 'true';
            const urlParams = new URLSearchParams(window.location.search);

            setInfoPageContent(null);

            // SECRET ADMIN ROUTE LOGIC
            if (hash === 'admin-secret-natraj-918' || urlParams.get('admin') === 'true') {
                if (adminSession) setPage('admin');
                else setPage('admin-login');
                return;
            }

            switch (hash) {
                case 'privacy':
                    setPage('info');
                    setInfoPageContent({ title: 'Privacy Policy', content: <p>We value your privacy. Your data is used for matching purposes only.</p> });
                    break;
                case 'terms':
                    setPage('info');
                    setInfoPageContent({ title: 'Terms of Service', content: <p>Usage of this platform constitutes agreement to our reward policies.</p> });
                    break;
                case 'contact':
                    setPage('info');
                    setInfoPageContent({ title: 'Support', content: <p>Contact us at help@natrajrewards.com</p> });
                    break;
                case 'offers':
                    setPage('offers');
                    break;
                case 'verify-email':
                    setPage('verify-email');
                    break;
                case 'home':
                default:
                    setPage('home');
                    break;
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (targetPage: string) => {
        window.location.hash = targetPage === 'admin-login' ? '#/admin-secret-natraj-918' : `#/${targetPage}`;
    };

    const handleLoginSuccess = () => {
        localStorage.setItem('admin_session', 'true');
        setPage('admin');
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_session');
        navigate('home');
    };

    const handleLeadCaptured = (lead: SmartLead) => {
        setLastLead(lead);
        if (config.redirectRule === 'single') performRedirect(lead);
        else navigate('verify-email'); // Force email verification flow before showing offers
    };

    return (
        <div className="font-sans min-h-screen flex flex-col antialiased bg-gray-50 text-slate-800">
            {page === 'admin' && (
                <AdminDashboard 
                    onLogout={handleLogout} 
                    currentOffers={offers}
                    onUpdateOffers={handleUpdateOffers}
                    currentContent={siteContent}
                    onUpdateContent={handleUpdateContent}
                    currentQuizConfig={quizConfig}
                    onUpdateQuizConfig={handleUpdateQuizConfig}
                    versionHistory={versionHistory}
                    onSaveVersion={handleSaveVersion}
                    onRestoreVersion={handleRestoreVersion}
                />
            )}
            {page === 'admin-login' && <AdminLogin onLoginSuccess={handleLoginSuccess} onNavigateHome={() => navigate('home')} />}
            {page === 'info' && infoPageContent && <InfoPage title={infoPageContent.title} onBack={() => navigate('home')}>{infoPageContent.content}</InfoPage>}
            {page === 'offers' && <OfferWall offers={offers} lead={lastLead} onNavigateHome={() => navigate('home')} />}
            {page === 'verify-email' && <VerifyEmail onNavigate={() => navigate('offers')} onNavigateHome={() => navigate('home')} />}
            
            {page === 'home' && (
                <>
                    <Header onOpenLogin={() => setIsLoginModalOpen(true)} />
                    <main>
                        <SmartHero 
                            onLeadCaptured={handleLeadCaptured} 
                            content={siteContent}
                            quizConfig={quizConfig}
                        />
                        <HowItWorks />
                        <SocialProof />
                        <AiGuide />
                    </main>
                    <Footer onNavigate={navigate} />
                    
                    <LoginModal 
                        isOpen={isLoginModalOpen} 
                        onClose={() => setIsLoginModalOpen(false)}
                        onLoginComplete={() => {
                            setIsLoginModalOpen(false);
                            navigate('offers');
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default App;