
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
import ContactUs from './components/ContactUs';
import DmcaPolicy from './components/DmcaPolicy';
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

// Lazy Load Quiz to speed up initial render and reduce bundle size
const QuizModal = lazy(() => import('./components/QuizModal'));

// Helper for safe JSON parsing to prevent runtime crashes
const safeParse = <T,>(key: string, fallback: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.warn(`Failed to parse ${key}, using fallback`, e);
        return fallback;
    }
};

const FullScreenLoader = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-nat-dark/80 backdrop-blur-md">
        <div className="w-12 h-12 border-4 border-nat-teal border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const App: React.FC = () => {
    const [page, setPage] = useState<string>('home');
    const [lastLead, setLastLead] = useState<SmartLead | null>(null);
    const [offers, setOffers] = useState<CpaOffer[]>(DEFAULT_OFFERS);
    const [siteContent, setSiteContent] = useState<SiteContentConfig>(DEFAULT_SITE_CONTENT);
    const [quizConfig, setQuizConfig] = useState<QuizConfig>(DEFAULT_QUIZ_CONFIG);
    const [versionHistory, setVersionHistory] = useState<VersionData[]>([]);
    
    // UI State
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [seoContent, setSeoContent] = useState({ 
        title: 'Loading AI Content...', 
        content: 'Please wait while our intelligent system prepares your information.'
    });
    
    const [config, setConfig] = useState<AppConfig>({ 
        brandName: 'Natraj Rewards', 
        headline: '', 
        defaultCpaUrl: 'https://www.google.com', 
        redirectRule: 'offer_wall' 
    });

    useEffect(() => {
        // Load initial data
        const loadData = async () => {
            setOffers(safeParse('cpa_offers', DEFAULT_OFFERS));
            setSiteContent(safeParse('site_content', DEFAULT_SITE_CONTENT));
            setQuizConfig(safeParse('quiz_config', DEFAULT_QUIZ_CONFIG));
            setVersionHistory(safeParse('version_history', []));
            setConfig(prev => ({ ...prev, ...safeParse('app_config', {}) }));
            
            // Load AI Content
            const content = await generateSeoContent();
            setSeoContent(content);
        };
        loadData();
    }, []);

    // State Persistence Handlers
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
    
    // Routing Logic: Uses Hash (#) to work perfectly on static hosting
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

    const handleLeadCaptured = (lead: SmartLead) => {
        setIsQuizOpen(false);
        setLastLead(lead);
        sessionStorage.setItem('new_signup', 'true');
        if (config.redirectRule === 'single') {
            performRedirect(lead);
        } else {
            navigate('offers');
        }
    };

    const renderPage = () => {
        switch(page) {
            case 'admin':
                return <AdminDashboard 
                    onLogout={() => { localStorage.removeItem('admin_session'); navigate('home'); }} 
                    currentOffers={offers} 
                    onUpdateOffers={handleUpdateOffers} 
                    currentContent={siteContent} 
                    onUpdateContent={handleUpdateContent} 
                    currentQuizConfig={quizConfig} 
                    onUpdateQuizConfig={handleUpdateQuizConfig} 
                    versionHistory={versionHistory} 
                    onSaveVersion={handleSaveVersion} 
                    onRestoreVersion={handleRestoreVersion} 
                />;
            case 'admin-login':
                return <AdminLogin 
                    onLoginSuccess={() => { localStorage.setItem('admin_session', 'true'); navigate('admin'); }} 
                    onNavigateHome={() => navigate('home')} 
                />;
            case 'offers':
                return <OfferWall offers={offers} lead={lastLead} onNavigateHome={() => navigate('home')} />;
            case 'privacy':
                return <InfoPage title="Privacy Policy" onBack={() => navigate('home')}><PrivacyPolicy /></InfoPage>;
            case 'terms':
                 return <InfoPage title="Terms of Service" onBack={() => navigate('home')}><TermsOfService /></InfoPage>;
            case 'contact':
                 return <InfoPage title="Contact Support" onBack={() => navigate('home')}><ContactUs /></InfoPage>;
            case 'dmca':
                 return <InfoPage title="DMCA Policy" onBack={() => navigate('home')}><DmcaPolicy /></InfoPage>;
            case 'home':
            default:
                return (
                    <>
                        <div className={`transition-all duration-500 ${(isQuizOpen || isLoginModalOpen) ? 'blur-md' : ''}`}>
                            <MagicBackground />
                            <div className="relative z-10">
                                <MinimalHeader />
                                <main>
                                    <SmartHero onStartQuiz={() => setIsQuizOpen(true)} content={siteContent} />
                                    <SocialProof />
                                    <HowItWorks />
                                    <SeoContent content={seoContent} />
                                </main>
                                <MinimalFooter onNavigate={navigate}/>
                                <LiveNotifications />
                                <AiGuide onStartQuiz={() => setIsQuizOpen(true)} />
                            </div>
                        </div>
                        
                        <LoginModal 
                            isOpen={isLoginModalOpen} 
                            onClose={() => setIsLoginModalOpen(false)} 
                            onLoginComplete={() => { setIsLoginModalOpen(false); navigate('offers'); }} 
                        />
                        
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
