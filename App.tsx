// FIX: This file was created to replace placeholder content. It defines the main App component,
// which manages application state, routing, and context providers. It also exports shared
// types, resolving module and type errors in other components.
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import TrustBadges from './components/TrustBadges';
import CubaGallery from './components/CubaGallery';
import DownloadApp from './components/DownloadApp';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import TransactionHistory from './components/TransactionHistory';
import { LanguageContext } from './contexts/LanguageContext';
import translations from './translations';
import DynamicImageGallery from './components/DynamicImageGallery';
import SendingRegions from './components/SendingRegions';

export interface User {
  email: string;
}

export interface TransactionDetails {
  destination: string;
  total: number;
  receiveAmount: number;
}

export interface Transaction extends TransactionDetails {
  id: string;
  date: string;
  receiveCurrency: string;
  status: 'Completed' | 'Pending';
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<'home' | 'history'>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'signup'>('login');

  const [language, setLanguage] = useState<'en' | 'es'>('es');

  const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
    let translation = (translations[language] as Record<string, string>)[key] || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }
    return translation;
  }, [language]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setPage('home');
  };

  const openAuthModal = (view: 'login' | 'signup') => {
    setAuthModalInitialView(view);
    setIsAuthModalOpen(true);
  };

  const handleStartTransfer = (details: TransactionDetails) => {
    if (!user) {
      openAuthModal('login');
      return;
    };
    const newTransaction: Transaction = {
      ...details,
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US'),
      receiveCurrency: 'USD',
      status: 'Completed', // Simplified for example
    };

    const userTransactionsKey = `transactions_${user.email}`;
    const existingTransactions: Transaction[] = JSON.parse(localStorage.getItem(userTransactionsKey) || '[]');
    localStorage.setItem(userTransactionsKey, JSON.stringify([newTransaction, ...existingTransactions]));
    
    alert('Transferencia simulada con éxito!');
    setPage('history');
  };
  
  const languageContextValue = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <div className="bg-white">
        <Header 
          user={user}
          onLogout={handleLogout}
          onLoginClick={() => openAuthModal('login')}
          onSignupClick={() => openAuthModal('signup')}
          onNavigate={setPage}
        />
        <main>
          {page === 'home' && (
            <>
              <Hero 
                user={user}
                onLoginClick={() => openAuthModal('login')}
                onStartTransfer={handleStartTransfer}
              />
              <TrustBadges />
              <HowItWorks />
              <DynamicImageGallery />
              <Features />
              <SendingRegions />
              <CubaGallery />
              <DownloadApp />
            </>
          )}
          {page === 'history' && user && (
            <TransactionHistory user={user} onSendMoney={() => setPage('home')} />
          )}
        </main>
        <Footer />

        {isAuthModalOpen && (
          <AuthModal 
            initialView={authModalInitialView}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </LanguageContext.Provider>
  );
}

export default App;