import React, { useContext } from 'react';
import { Transaction } from '../App';
import { LanguageContext } from '../contexts/LanguageContext';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ReceiptPageProps {
  transaction: Transaction;
  onNewTransfer: () => void;
  onGoToHistory: () => void;
}

const ReceiptPage: React.FC<ReceiptPageProps> = ({ transaction, onNewTransfer, onGoToHistory }) => {
  const { t } = useContext(LanguageContext);

  const summaryItems = {
    [t('receipt.orderNumber')]: transaction.orderNumber,
    [t('receipt.province')]: transaction.details.destination,
    [t('receipt.amountSent')]: `$${transaction.details.receiveAmount.toFixed(2)} USD`,
    [t('receipt.commission')]: `$${(transaction.details.total - transaction.details.receiveAmount).toFixed(2)}`,
    [t('receipt.paymentMethod')]: transaction.paymentMethod,
  };

  const recipientItems = {
    [t('recipientForm.fullName')]: transaction.recipient.fullName,
    [t('recipientForm.idNumber')]: transaction.recipient.idNumber,
    [t('receipt.whatsapp')]: transaction.recipient.whatsappPhone,
  };

  return (
    <section className="py-12 md:py-20 bg-[#f9da07]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-2xl text-center">
          <div className="flex justify-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black mt-4">
            {t('receipt.title')}
          </h1>
          <p className="mt-2 text-black/80">{t('receipt.subtitle')}</p>

          <div className="mt-6 text-left border-t border-b border-black/10 py-4 space-y-2">
            {Object.entries(summaryItems).map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-black/80">{label}:</span>
                <span className="font-semibold text-black">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-left">
            <h2 className="text-lg font-bold text-black mb-2">{t('receipt.beneficiaryInfo')}</h2>
            <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-lg border">
                 {Object.entries(recipientItems).map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                        <span className="text-black/80">{label}:</span>
                        <span className="font-semibold text-black text-right">{value}</span>
                    </div>
                ))}
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button onClick={onNewTransfer} className="w-full bg-black text-[#f9da07] font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                {t('receipt.newTransfer')}
            </button>
             <button onClick={onGoToHistory} className="w-full bg-gray-200 text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                {t('receipt.goToHistory')}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ReceiptPage;
