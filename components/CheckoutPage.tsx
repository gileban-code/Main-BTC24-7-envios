import React, { useState, useContext } from 'react';
import { Transaction } from '../App';
import { LanguageContext } from '../contexts/LanguageContext';
import { PayPalIcon } from './icons/PayPalIcon';
import { VisaIcon } from './icons/VisaIcon';
import { MastercardIcon } from './icons/MastercardIcon';
import { CryptoIcon } from './icons/CryptoIcon';

interface CheckoutPageProps {
  transaction: Transaction;
  onPaymentInitiated: (method: string) => Promise<{ success: boolean, data?: any }>;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

const WALLET_ADDRESS = 'TMiWekumepbUWjB5GTo2acd9qQw6jx54qn'; // This is now handled by backend

const CheckoutPage: React.FC<CheckoutPageProps> = ({ transaction, onPaymentInitiated, onBack, onPaymentSuccess }) => {
  const { t } = useContext(LanguageContext);
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (method: string) => {
    setLoading(method);
    const result = await onPaymentInitiated(method);
    if (result.success) {
      if (method === 'Crypto' && result.data.invoice_url) {
        // Redirect to NowPayments
        window.location.href = result.data.invoice_url;
      }
      // For other methods, onPaymentSuccess is called from App.tsx after simulation
    } else {
        // Error is handled in App.tsx
    }
    setLoading(null);
  }

  const recipient = transaction.recipient;
  const details = transaction.details;

  return (
    <section className="py-12 md:py-20 bg-[#f9da07]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
             <h1 className="text-2xl font-extrabold text-black mb-4">
                {t('checkout.title')}
             </h1>
            <div className="border-t border-b border-black/10 py-4">
                <h2 className="text-lg font-bold text-black mb-2">{t('recipientForm.summary.title')}</h2>
                <div className="space-y-1 text-sm text-black">
                    <p className="flex justify-between"><span>{t('recipientForm.summary.amountSent')}:</span> <span>${details.receiveAmount.toFixed(2)}</span></p>
                    <p className="flex justify-between"><span>{t('recipientForm.summary.destination')}:</span> <span>{details.destination}</span></p>
                    <p className="flex justify-between font-bold"><span>{t('recipientForm.summary.totalToPay')}:</span> <span>${details.total.toFixed(2)}</span></p>
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-bold text-black mb-2">{t('checkout.recipientDetails')}</h2>
                <div className="space-y-1 text-sm text-black">
                    <p><strong>{t('recipientForm.fullName')}:</strong> {recipient.fullName}</p>
                    <p><strong>{t('recipientForm.idNumber')}:</strong> {recipient.idNumber}</p>
                    <p><strong>{t('recipientForm.whatsapp')}:</strong> {recipient.whatsappPhone}</p>
                </div>
            </div>
             <button type="button" onClick={onBack} className="mt-6 text-sm font-medium text-black hover:underline" disabled={!!loading}>
                {t('recipientForm.back')}
              </button>
          </div>

          {/* Right Column: Payment Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-black">{t('checkout.paymentOptions')}</h2>
            {/* PayPal */}
            <button onClick={() => handlePayment('PayPal')} disabled={!!loading} className="w-full flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 disabled:opacity-50">
                {loading === 'PayPal' ? 'Processing...' : <PayPalIcon className="h-8" />}
            </button>
            {/* Card */}
            <div className="w-full p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <p className="font-bold text-center text-black mb-4">{t('checkout.payWithCard')}</p>
                <div className="flex justify-center items-center space-x-4">
                    <VisaIcon className="h-8"/>
                    <MastercardIcon className="h-8"/>
                </div>
                <button onClick={() => handlePayment('Card')} disabled={!!loading} className="mt-4 w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-500">
                    {loading === 'Card' ? 'Processing...' : `Pay $${details.total.toFixed(2)}`}
                </button>
            </div>
            {/* Crypto */}
            <div className="w-full p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <p className="font-bold text-center text-black">{t('checkout.payWithCrypto')}</p>
                <p className="text-xs text-center text-gray-500 mb-2">{t('checkout.nowPayments')}</p>
                 <div className="flex justify-center my-4">
                    <CryptoIcon className="h-10 text-yellow-500"/>
                </div>
                <p className="text-sm font-semibold text-center text-black">{t('checkout.acceptedCrypto')}</p>
                 <button onClick={() => handlePayment('Crypto')} disabled={!!loading} className="mt-4 w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-500">
                    {loading === 'Crypto' ? 'Redirecting...' : 'Pay with Crypto'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
