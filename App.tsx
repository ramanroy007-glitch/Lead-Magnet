
import React, { useState, useEffect, Suspense, lazy } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import SmartHero from './components/SmartHero';
import OfferWall from './components/OfferWall';
import LoginModal from './components/LoginModal';
import MinimalHeader from './components/MinimalHeader';
import MinimalFooter from './components/MinimalFooter';
import InfoPage from './components/InfoPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import LiveNotifications from './components/LiveNotifications';
import AiGuide from './components/AiGuide';
import MagicBackground from './components/MagicBackground';
import SeoContent from './components/SeoContent';
import SocialProof from './components/SocialProof';
import HowItWorks from './components/HowItWorks';
import { performRedirect } from './services/redirectEngine';
import type { SmartLead, CpaOffer, AppConfig, SiteContentConfig, QuizConfig, VersionData } from './types';
import { DEFAULT_OFFERS, DEFAULT_SITE_CONTENT, DEFAULT_QUIZ_CONFIG } from './constants';
import { generateSeoContent } from './services/gemini';

const QuizModal = lazy(() => import('./components/QuizModal'));

// Helper for safe parsing
const safeParse = <T,>(key: string, fallback: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.warn(`Failed to parse ${key}, using fallback`, e);
        return fallback;
    }
};

// Premium Loading Spinner Component
const FullScreenLoader = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-nat-dark/80 backdrop-blur-md">
        <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-nat-teal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-nat-teal font-bold tracking-widest text-xs uppercase animate-pulse">Loading Experience</p>
    </div>
);

const App: React.FC = () => {
    const [page, setPage] = useState<string>('home');
    const [lastLead, setLastLead] = useState<SmartLead | null>(null);
    const [offers, setOffers] = useState<CpaOffer[]>(DEFAULT_OFFERS);
    const [siteContent, setSiteContent] = useState<SiteContentConfig>(DEFAULT_SITE_CONTENT);
    const [quizConfig, setQuizConfig] = useState<QuizConfig>(DEFAULT_QUIZ_CONFIG);
    const [versionHistory, setVersionHistory] = useState<VersionData[]>([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [seoContent, setSeoContent] = useState({ title: 'Loading AI Content...', content: 'Please wait while our intelligent system prepares your information.'});
    
    const [config, setConfig] = useState<AppConfig>({ 
        brandName: 'Natraj Rewards', 
        headline: '', 
        defaultCpaUrl: 'https://www.google.com', 
        redirectRule: 'offer_wall' 
    });

    useEffect(() => {
        const fetchAiContent = async () => {
            const content = await generateSeoContent();
            setSeoContent(content);
        };

        fetchAiContent();
        
        // Safe loading of data
        setOffers(safeParse('cpa_offers', DEFAULT_OFFERS));
        setSiteContent(safeParse('site_content', DEFAULT_SITE_CONTENT));
        setQuizConfig(safeParse('quiz_config', DEFAULT_QUIZ_CONFIG));
        setVersionHistory(safeParse('version_history', []));
        setConfig(prev => ({ ...prev, ...safeParse('app_config', {}) }));

    }, []);

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
            data: { siteContent, offers, quizConfig }
        };
        const updatedHistory = [newVersion, ...versionHistory].slice(0, 10);
        setVersionHistory(updatedHistory);
        localStorage.setItem('version_history', JSON.stringify(updatedHistory));
    };

    const handleRestoreVersion = (version: VersionData) => {
        if(confirm(`Restore version from ${new Date(version.timestamp).toLocaleString()}?`)) {
            setSiteContent(version.data.siteContent);
            setOffers(version.data.offers);
            setQuizConfig(version.data.quizConfig);
        }
    };
    
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#/', '').toLowerCase();
            const adminSession = localStorage.getItem('admin_session') === 'true';

            if (hash === 'admin') {
                setPage(adminSession ? 'admin' : 'admin-login');
            } else {
                setPage(hash || 'home');
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (targetPage: string) => {
        window.location.hash = `#/${targetPage}`;
    };

    const handleLoginSuccess = () => {
        localStorage.setItem('admin_session', 'true');
        navigate('admin');
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_session');
        navigate('home');
    };

    const handleLeadCaptured = (lead: SmartLead) => {
        setIsQuizOpen(false);
        setLastLead(lead);
        sessionStorage.setItem('new_signup', 'true'); // Flag for Welcome Modal
        if (config.redirectRule === 'single') {
            performRedirect(lead);
        } else {
            navigate('offers');
        }
    };

    const handleStartSignup = () => setIsQuizOpen(true);
    
    const isModalOpen = isQuizOpen || isLoginModalOpen;

    const renderPage = () => {
        switch(page) {
            case 'admin':
                return <AdminDashboard onLogout={handleLogout} currentOffers={offers} onUpdateOffers={handleUpdateOffers} currentContent={siteContent} onUpdateContent={handleUpdateContent} currentQuizConfig={quizConfig} onUpdateQuizConfig={handleUpdateQuizConfig} versionHistory={versionHistory} onSaveVersion={handleSaveVersion} onRestoreVersion={handleRestoreVersion} />;
            case 'admin-login':
                return <AdminLogin onLoginSuccess={handleLoginSuccess} onNavigateHome={() => navigate('home')} />;
            case 'offers':
                return <OfferWall offers={offers} lead={lastLead} onNavigateHome={() => navigate('home')} />;
            case 'privacy':
                return <InfoPage title="Privacy Policy" onBack={() => navigate('home')}><PrivacyPolicy /></InfoPage>;
            case 'terms':
                 return <InfoPage title="Terms of Service" onBack={() => navigate('home')}><TermsOfService /></InfoPage>;
            case 'home':
            default:
                return (
                    <>
                        <div className={`transition-all duration-500 ${isModalOpen ? 'blur-md' : ''}`}>
                            <MagicBackground />
                            <div className="relative z-10">
                                <MinimalHeader />
                                <main>
                                    <SmartHero onStartQuiz={handleStartSignup} content={siteContent} />
                                    <SocialProof />
                                    <HowItWorks />
                                    <SeoContent content={seoContent} />
                                </main>
                                <MinimalFooter onNavigate={navigate}/>
                                <LiveNotifications />
                                <AiGuide onStartQuiz={handleStartSignup} />
                            </div>
                        </div>
                        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginComplete={() => { setIsLoginModalOpen(false); navigate('offers'); }} />
                         <Suspense fallback={<FullScreenLoader />}>
                            {isQuizOpen && (
                                <QuizModal 
                                    isOpen={isQuizOpen} 
                                    onClose={() => setIsQuizOpen(false)} 
                                    onQuizComplete={handleLeadCaptured}
                                    config={quizConfig}
                                />
                            )}
                        </Suspense>
                    </>
                );
        }
    };

    return (
        <div className="font-sans min-h-screen flex flex-col antialiased bg-nat-dark text-nat-white">
            {renderPage()}
        </div>
    );
};

export default App;
