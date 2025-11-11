import React, { useState, useContext } from 'react';
import { TransactionDetails, RecipientDetails } from '../App';
import { LanguageContext } from '../contexts/LanguageContext';

interface RecipientFormProps {
  transactionDetails: TransactionDetails;
  onSubmit: (recipientDetails: RecipientDetails) => void;
  onBack: () => void;
}

const RecipientForm: React.FC<RecipientFormProps> = ({ transactionDetails, onSubmit, onBack }) => {
  const { t } = useContext(LanguageContext);
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName) newErrors.fullName = t('recipientForm.required');
    if (!idNumber) newErrors.idNumber = t('recipientForm.required');
    if (!email) newErrors.email = t('recipientForm.required');
    if (!whatsappPhone) newErrors.whatsappPhone = t('recipientForm.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ fullName, idNumber, email, whatsappPhone });
    }
  };

  return (
    <section className="py-12 md:py-20 bg-[#f9da07]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-black text-center mb-2">
            {t('recipientForm.title')}
          </h1>
          <p className="text-center text-sm text-black/80 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
            {t('recipientForm.disclaimer')}
          </p>

          {/* Summary Box */}
          <div className="mt-6 border-t border-b border-black/10 py-4">
            <h2 className="text-lg font-bold text-black mb-2">{t('recipientForm.summary.title')}</h2>
            <div className="space-y-1 text-sm text-black">
              <p className="flex justify-between"><span>{t('recipientForm.summary.amountSent')}:</span> <span>${transactionDetails.receiveAmount.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>{t('recipientForm.summary.destination')}:</span> <span>{transactionDetails.destination}</span></p>
              <p className="flex justify-between text-green-600 font-bold"><span>{t('recipientForm.summary.commission')}:</span> <span>${(transactionDetails.total - transactionDetails.receiveAmount).toFixed(2)}</span></p>
              <p className="flex justify-between text-green-600 font-bold"><span>{t('recipientForm.summary.totalToPay')}:</span> <span>${transactionDetails.total.toFixed(2)}</span></p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-bold text-black">{t('recipientForm.fullName')}</label>
              <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black" />
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="idNumber" className="block text-sm font-bold text-black">{t('recipientForm.idNumber')}</label>
              <input type="text" id="idNumber" value={idNumber} onChange={e => setIdNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black" />
              {errors.idNumber && <p className="text-xs text-red-600 mt-1">{errors.idNumber}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black">{t('recipientForm.email')}</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black" />
               {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-bold text-black">{t('recipientForm.whatsapp')}</label>
              <input type="tel" id="whatsapp" value={whatsappPhone} onChange={e => setWhatsappPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black" />
              {errors.whatsappPhone && <p className="text-xs text-red-600 mt-1">{errors.whatsappPhone}</p>}
              <p className="text-xs text-black/70 mt-1 italic">*{t('recipientForm.whatsappNote')}*</p>
            </div>
            <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
              <button type="button" onClick={onBack} className="text-sm font-medium text-black hover:underline">
                {t('recipientForm.back')}
              </button>
              <button type="submit" className="w-full sm:w-auto bg-black text-[#f9da07] font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors">
                {t('recipientForm.cta')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RecipientForm;
