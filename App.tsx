
import React, { useState, useEffect } from 'react';
import { Page, SiteContent, UserRole, CpaOffer } from './types';
import { DEFAULT_SITE_CONTENT, DEFAULT_OFFERS } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SocialProof from './components/SocialProof';
import Testimonials from './components/Testimonials';
import FaqSection from './components/FaqSection';
import SeoContent from './components/SeoContent';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import OfferWall from './components/OfferWall';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import BackToTop from './components/BackToTop';
import QuizModal from './components/QuizModal';
import LoginModal from './components/LoginModal';
import LiveNotifications from './components/LiveNotifications';
import VerifyEmail from './components/VerifyEmail';
import AiPlayground from './components/AiPlayground';

// Generic Info Page Component
const InfoPage: React.FC<{ title: string; content: string; onBack: () => void }> = ({ title, content, onBack }) => (
    <div className="w-full bg-[#0f1014] min-h-screen text-white pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
         <button onClick={onBack} className="text-brand-primary font-bold mb-6 flex items-center gap-2">&larr; Back</button>
         <h1 className="text-4xl font-extrabold mb-6">{title}</h1>
         <div className="prose prose-lg prose-invert text-gray-300 whitespace-pre-line">{content}</div>
      </div>
    </div>
);

const App: React.FC = () => {
  // Routing State
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [initialEmail, setInitialEmail] = useState('');
  
  // Data State
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [offers, setOffers] = useState<CpaOffer[]>(DEFAULT_OFFERS);

  // Router Logic
  useEffect(() => {
    const handleHashChange = () => {
        let hash = window.location.hash;
        if (!hash) hash = '#/home';
        setCurrentHash(hash);
        window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Initial check
    if (!window.location.hash) {
        window.location.hash = '#/home';
    }

    // Admin Session Persistence
    const storedRole = localStorage.getItem('admin_role');
    if (storedRole) {
        setUserRole(storedRole as UserRole);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Data Loading
  useEffect(() => {
    try {
        const savedContent = localStorage.getItem('siteContent');
        if (savedContent) setSiteContent(JSON.parse(savedContent));

        const savedOffers = localStorage.getItem('cpaOffers');
        if (savedOffers) setOffers(JSON.parse(savedOffers));
    } catch (e) {
        console.error("Data integrity check failed. Resetting to defaults.");
    }
  }, []);

  const handleUpdateContent = (newContent: SiteContent) => {
      setSiteContent(newContent);
      localStorage.setItem('siteContent', JSON.stringify(newContent));
  };

  const handleUpdateOffers = (newOffers: CpaOffer[]) => {
      setOffers(newOffers);
      localStorage.setItem('cpaOffers', JSON.stringify(newOffers));
  };

  // Helper to programmatically navigate
  const navigate = (hash: string) => {
      window.location.hash = hash;
  };
  
  const handleLoginSuccess = (role: UserRole) => {
      setUserRole(role);
      localStorage.setItem('admin_role', role || '');
      navigate('#/admin');
  };

  const handleStartQuiz = (emailFromHero?: string) => {
      if (emailFromHero) setInitialEmail(emailFromHero);
      setIsQuizOpen(true);
  };

  // Step 1: Quiz -> Offers (Instant Redirect Strategy)
  const handleQuizComplete = () => {
      setIsQuizOpen(false);
      // Strategy Update: Direct to offers for higher conversion
      navigate('#/offers'); 
  };

  const handleUserLoginComplete = () => {
      setIsLoginOpen(false);
      navigate('#/offers');
  };

  // --- Router Switch ---
  const renderPageContent = () => {
    // Parse Hash
    const hash = currentHash.replace('#/', '');
    const [route] = hash.split('/'); 

    switch (route) {
      case 'offers':
        // Protected Route logic could go here
        return <OfferWall offers={offers} />;

      case 'verify':
        return <VerifyEmail onNavigate={() => navigate('#/offers')} />;
      
      case 'portal': // The separate Admin Login Page
        return <AdminLogin onLoginSuccess={handleLoginSuccess} onNavigateHome={() => navigate('#/home')} />;
      
      case 'admin': // The Protected Admin Dashboard
        return userRole ? 
            <AdminDashboard 
                siteContent={siteContent} 
                offers={offers}
                onUpdateContent={handleUpdateContent}
                onUpdateOffers={handleUpdateOffers}
                onNavigateHome={() => navigate('#/home')}
                role={userRole}
            /> : 
            <AdminLogin onLoginSuccess={handleLoginSuccess} onNavigateHome={() => navigate('#/home')} />;
      
      case 'privacy':
        return <PrivacyPolicy onBack={() => navigate('#/home')} />;
      
      case 'terms':
        return <TermsOfService onBack={() => navigate('#/home')} />;

      case 'contact':
        return <InfoPage title="Contact Support" content={`Have questions? We're here to help.\n\nEmail: support@natrajrewards.com\nAddress: 123 Innovation Dr, Tech City, CA`} onBack={() => navigate('#/home')} />;

      case 'success-stories':
          return <InfoPage title="Success Stories" content={`"I paid for my holiday gifts using Natraj Rewards!" - Sarah J.\n\n"Legit payouts and great customer service." - Mike T.`} onBack={() => navigate('#/home')} />;

      case 'help':
          return <InfoPage title="Help Center" content={`Q: How do I get paid?\nA: Rewards are processed via PayPal or Gift Card within 48 hours of offer completion.\n\nQ: Why was my offer rejected?\nA: Ensure you use valid information and are a new user to the app/service.`} onBack={() => navigate('#/home')} />;

      case 'home':
      default:
        return (
          <div className="flex flex-col w-full relative">
            <Hero content={siteContent.hero} onStartQuiz={() => handleStartQuiz()} />
            <SocialProof />
            <Features content={siteContent.features} onStartQuiz={() => handleStartQuiz()} />
            <Testimonials content={siteContent.testimonials} />
            <SeoContent content={siteContent.seoSection} />
            <FaqSection />
            <FinalCta content={siteContent.finalCta} onStartQuiz={() => handleStartQuiz()} />
          </div>
        );
    }
  };

  const isFullScreen = currentHash.includes('admin') || currentHash.includes('portal') || currentHash.includes('verify');

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden bg-[#0f1014] text-white">
        
        {/* Header shows on Home and Offers pages, but NOT on Admin/Portal */}
        {!isFullScreen &&
            <Header 
                onNavigate={() => navigate('#/home')} 
                currentPage={currentHash.includes('offers') ? 'offers' : 'home'}
                onStartQuiz={() => handleStartQuiz()}
                onOpenLogin={() => setIsLoginOpen(true)}
            />
        }
        
        <main className="flex-grow flex flex-col w-full relative z-10">
          {renderPageContent()}
        </main>
        
        {/* Footer shows on most pages except Admin/Portal */}
        {!isFullScreen && 
            <Footer onNavigate={(page) => navigate(`#/${page}`)} />
        }

        <BackToTop />
        <LiveNotifications />
        
        <QuizModal 
            isOpen={isQuizOpen} 
            onClose={() => setIsQuizOpen(false)} 
            onQuizComplete={handleQuizComplete}
            initialEmail={initialEmail}
        />

        <LoginModal 
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginComplete={handleUserLoginComplete}
        />
    </div>
  );
};

export default App;
