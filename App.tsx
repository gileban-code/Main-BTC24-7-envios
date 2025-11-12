import React, { useState, useCallback, ReactNode, useEffect } from 'react';
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
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, serverTimestamp, addDoc, updateDoc } from "firebase/firestore";
import AdminDashboard from './components/AdminDashboard';


export interface User {
  uid: string;
  email: string | null;
  isAdmin: boolean;
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
  id?: string;
  orderNumber: string;
  date: any; // Firestore timestamp
  paymentMethod?: string;
  details: TransactionDetails;
  recipient: RecipientDetails;
  status: 'En Proceso' | 'Entregado' | 'Pendiente' | 'Completado'; // Expanded statuses
  userId: string;
  userEmail?: string;
}

type Page = 'home' | 'history' | 'recipientForm' | 'checkout' | 'receipt' | 'adminDashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'signup'>('login');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Partial<Transaction>>({});

  const [language, setLanguage] = useState<'en' | 'es'>('es');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Force refresh to get latest claims
        const idTokenResult = await firebaseUser.getIdTokenResult(true);
        const isAdmin = idTokenResult.claims.isAdmin === true;

        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: firebaseUser.email,
            createdAt: serverTimestamp()
          });
        }
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, isAdmin });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
    let translation = (translations[language] as Record<string, string>)[key] || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }
    return translation;
  }, [language]);

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    auth.signOut();
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
    setCurrentTransaction({ details, userId: user.uid, userEmail: user.email, status: 'Pendiente' });
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

  const handlePaymentInitiated = async (paymentMethod: string): Promise<{ success: boolean; data?: any; }> => {
    if (!user || !currentTransaction.details || !currentTransaction.recipient) {
        return { success: false, data: { message: "Missing transaction details."} };
    }

    try {
        const transactionToSave: Omit<Transaction, 'id'> = {
            ...currentTransaction,
            orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: serverTimestamp(),
            paymentMethod,
            status: 'En Proceso', // Initial status for operations
        } as Omit<Transaction, 'id'>;

        const transactionRef = await addDoc(collection(db, "transactions"), transactionToSave);
        const finalTransaction = { ...transactionToSave, id: transactionRef.id };
        setCurrentTransaction(finalTransaction);

        // Always log to sheet upon creation
        await fetch('YOUR_CLOUD_FUNCTION_URL/logTransactionToSheet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId: transactionRef.id }),
        });

        if (paymentMethod === 'Crypto') {
            const response = await fetch('YOUR_CLOUD_FUNCTION_URL/createNowPaymentsInvoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price_amount: finalTransaction.details.total,
                    price_currency: 'usd',
                    order_id: finalTransaction.id,
                    order_description: `Transfer to ${finalTransaction.recipient.fullName}`
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create payment invoice.');
            }
            const invoiceData = await response.json();
            return { success: true, data: invoiceData };
        } else {
             // For Card/PayPal, we simulate success and move to receipt.
             // The status is already 'En Proceso' and it's logged to Sheets.
             const docRef = doc(db, "transactions", transactionRef.id);
             await updateDoc(docRef, { status: "En Proceso" });
             
             setCurrentPage('receipt');
             return { success: true };
        }

    } catch (error) {
        console.error("Payment initiation failed:", error);
        alert("Payment initiation failed. Please try again.");
        return { success: false, data: { message: (error as Error).message } };
    }
  };
  
  const handlePaymentSuccess = () => {
    setCurrentPage('receipt');
  }


  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  }

  const languageContextValue = {
    language,
    setLanguage,
    t
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f9da07]">Loading...</div>
  }

  let pageContent: ReactNode;

  switch (currentPage) {
    case 'recipientForm':
      pageContent = <RecipientForm transactionDetails={currentTransaction.details!} onSubmit={handleRecipientSubmit} onBack={() => setCurrentPage('home')} />;
      break;
    case 'checkout':
      pageContent = <CheckoutPage transaction={currentTransaction as Transaction} onPaymentInitiated={handlePaymentInitiated} onBack={() => setCurrentPage('recipientForm')} onPaymentSuccess={handlePaymentSuccess} />;
      break;
    case 'receipt':
      pageContent = <ReceiptPage transaction={currentTransaction as Transaction} onNewTransfer={() => setCurrentPage('home')} onGoToHistory={() => setCurrentPage('history')} />;
      break;
    case 'history':
       pageContent = user ? <TransactionHistory user={user} onSendMoney={() => setCurrentPage('home')} /> : <>{/* Should not happen */}</>;
       break;
    case 'adminDashboard':
       pageContent = user?.isAdmin ? <AdminDashboard /> : <div>Access Denied</div>;
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
