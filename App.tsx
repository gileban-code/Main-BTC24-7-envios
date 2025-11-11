import React, { useState, useCallback, ReactNode } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import TrustBadges from './components/TrustBadges';
import CubaGallery from './components/CubaGallery';
import DownloadApp from './components/DownloadApp';
import AuthModal from './components/AuthModal';
import TransactionHistory from './components/TransactionHistory';
import { LanguageContext } from './contexts/LanguageContext';
import translations from './translations';
import DynamicImageGallery from './components/DynamicImageGallery';
import SendingRegions from './components/SendingRegions';
import TopSendingCountries from './components/TopSendingCountries';
import Footer from './components/Footer';
import WarningModal from './components/WarningModal';
import RecipientForm from './components/RecipientForm';
import CheckoutPage from './components/CheckoutPage';
import ReceiptPage from './components/ReceiptPage';

export interface User {
  email: string;
}

export interface TransactionDetails {
  destination: string;
  total: number;
  receiveAmount: number;
}

export interface RecipientDetails {
  fullName: string;
  idNumber: string;
  email: string;
  whatsappPhone: string;
}

export interface Transaction {
  orderNumber: string;
  date: string;
  paymentMethod?: string;
  details: TransactionDetails;
  recipient: RecipientDetails;
  status: 'Completed' | 'Pending';
}

type Page = 'home' | 'history' | 'recipientForm' | 'checkout' | 'receipt';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'signup'>('login');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Partial<Transaction>>({});

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
    setCurrentPage('home');
  };

  const openAuthModal = (view: 'login' | 'signup') => {
    setAuthModalInitialView(view);
    setIsAuthModalOpen(true);
  };

  const handleInitiateTransfer = (details: TransactionDetails) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setCurrentTransaction({ details });
    setIsWarningModalOpen(true);
  };

  const handleAcceptWarning = () => {
    setIsWarningModalOpen(false);
    setCurrentPage('recipientForm');
  };
  
  const handleRecipientSubmit = (recipientDetails: RecipientDetails) => {
     setCurrentTransaction(prev => ({ ...prev, recipient: recipientDetails }));
     setCurrentPage('checkout');
  };

  const handlePaymentSuccess = (paymentMethod: string) => {
    if (!user || !currentTransaction.details || !currentTransaction.recipient) return;

    const finalTransaction: Transaction = {
      ...currentTransaction,
      orderNumber: Math.random().toString().substr(2, 8),
      date: new Date().toLocaleDateString(language),
      paymentMethod,
      status: 'Completed',
    } as Transaction;

    setCurrentTransaction(finalTransaction);
    
    // Save to local storage
    const userTransactionsKey = `transactions_${user.email}`;
    const existingTransactions: Transaction[] = JSON.parse(localStorage.getItem(userTransactionsKey) || '[]');
    localStorage.setItem(userTransactionsKey, JSON.stringify([finalTransaction, ...existingTransactions]));
    
    // Simulate backend actions
    console.log("--- SIMULATING BACKEND ACTIONS ---");
    console.log("Sending confirmation email to:", user.email);
    console.log("Sending notification to admin inbox.");
    console.log("Appending order to Google Sheets:", {
      Fecha: finalTransaction.date,
      Hora: new Date().toLocaleTimeString(language),
      'Provincia destino': finalTransaction.details.destination,
      Beneficiario: finalTransaction.recipient.fullName,
      'Tel/Email': `${finalTransaction.recipient.whatsappPhone} / ${finalTransaction.recipient.email}`,
      Monto: `${finalTransaction.details.receiveAmount.toFixed(2)} USD`,
      'Método de pago': finalTransaction.paymentMethod,
    });
    console.log("---------------------------------");
    alert("Email simulations logged to console. Transaction complete!");


    setCurrentPage('receipt');
  };

  const handleNavigate = (page: 'home' | 'history') => {
    setCurrentPage(page);
  }

  const languageContextValue = {
    language,
    setLanguage,
    t
  };

  let pageContent: ReactNode;

  switch (currentPage) {
    case 'recipientForm':
      pageContent = <RecipientForm transactionDetails={currentTransaction.details!} onSubmit={handleRecipientSubmit} onBack={() => setCurrentPage('home')} />;
      break;
    case 'checkout':
      pageContent = <CheckoutPage transaction={currentTransaction as Transaction} onPaymentSuccess={handlePaymentSuccess} onBack={() => setCurrentPage('recipientForm')} />;
      break;
    case 'receipt':
      pageContent = <ReceiptPage transaction={currentTransaction as Transaction} onNewTransfer={() => setCurrentPage('home')} onGoToHistory={() => setCurrentPage('history')} />;
      break;
    case 'history':
       pageContent = user ? <TransactionHistory user={user} onSendMoney={() => setCurrentPage('home')} /> : <>{/* Should not happen */}</>;
       break;
    case 'home':
    default:
      pageContent = (
        <>
          <Hero 
            user={user}
            onLoginClick={() => openAuthModal('login')}
            onStartTransfer={handleInitiateTransfer}
          />
          <TrustBadges />
          <HowItWorks />
          <DynamicImageGallery />
          <Features />
          <SendingRegions />
          <CubaGallery />
          <TopSendingCountries />
          <DownloadApp />
        </>
      );
  }


  return (
    <LanguageContext.Provider value={languageContextValue}>
      <div className="bg-white">
        <Header 
          user={user}
          onLogout={handleLogout}
          onLoginClick={() => openAuthModal('login')}
          onSignupClick={() => openAuthModal('signup')}
          onNavigate={handleNavigate}
        />
        <main>
         {pageContent}
        </main>
        <Footer />

        {isAuthModalOpen && (
          <AuthModal 
            initialView={authModalInitialView}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {isWarningModalOpen && (
          <WarningModal 
            onClose={() => setIsWarningModalOpen(false)}
            onAccept={handleAcceptWarning}
          />
        )}
      </div>
    </LanguageContext.Provider>
  );
}

export default App;