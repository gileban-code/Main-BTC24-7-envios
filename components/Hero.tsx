import React, { useState, useMemo, useContext } from 'react';
import { User, TransactionDetails } from '../App';
import { LanguageContext } from '../contexts/LanguageContext';
import { CUBAN_PROVINCES } from '../constants';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { StarIcon } from './icons/StarIcon';

interface HeroProps {
  user: User | null;
  onStartTransfer: (details: TransactionDetails) => void;
  onLoginClick: () => void;
}

const FIXED_AMOUNTS = [100, 200, 300, 400, 500];
const COMMISSION_RATE = 0.20; // 20%

const Hero: React.FC<HeroProps> = ({ user, onStartTransfer, onLoginClick }) => {
  const [sendAmount, setSendAmount] = useState(FIXED_AMOUNTS[0]);
  const [selectedProvince, setSelectedProvince] = useState(CUBAN_PROVINCES[0].name);
  const { t } = useContext(LanguageContext);

  const { commission, totalToPay, receiverGets } = useMemo(() => {
    const amount = Number(sendAmount);
    const calculatedCommission = amount * COMMISSION_RATE;
    const total = amount + calculatedCommission;
    return {
      commission: calculatedCommission,
      totalToPay: total,
      receiverGets: amount
    };
  }, [sendAmount]);

  const handleSend = () => {
    if (!user) {
      onLoginClick();
    } else {
      onStartTransfer({
        destination: selectedProvince,
        total: totalToPay,
        receiveAmount: receiverGets,
      });
    }
  };
  
  return (
    <section id="hero" className="bg-[#f9da07] py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="text-black text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              {t('hero.title')}
            </h1>
            <div className="mt-6 flex items-start justify-center lg:justify-start space-x-3 max-w-lg mx-auto lg:mx-0">
               <MapPinIcon className="w-6 h-6 flex-shrink-0 mt-1" />
               <p className="text-lg">{t('hero.subtitle')}</p>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-4">
                <div className="flex text-green-600">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-6 h-6 fill-current text-black" />)}
                </div>
                <div className="text-left">
                    <p className="font-bold">{t('hero.ratingExcellent')}</p>
                    <p className="text-sm">{t('hero.ratingReviews')}</p>
                </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl">
              <div className="space-y-4">
                <div>
                  <label htmlFor="province-select" className="block text-sm font-bold text-black mb-1">{t('hero.destinationProvince')}</label>
                  <div className="relative">
                    <select
                      id="province-select"
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="w-full appearance-none bg-white border-2 border-black text-black text-lg py-3 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {CUBAN_PROVINCES.map(province => (
                        <option key={province.name} value={province.name}>{province.name} — {t(province.deliveryKey)}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                        <ChevronDownIcon className="w-6 h-6"/>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="amount-select" className="block text-sm font-bold text-black mb-1">{t('hero.youSendFixed')}</label>
                   <div className="relative">
                        <select
                            id="amount-select"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(Number(e.target.value))}
                            className="w-full appearance-none bg-white border-2 border-black text-black text-lg py-3 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            {FIXED_AMOUNTS.map(amount => (
                                <option key={amount} value={amount}>
                                    {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                            <ChevronDownIcon className="w-6 h-6"/>
                        </div>
                   </div>
                </div>
              </div>

              <div className="mt-6 text-black space-y-2 text-sm">
                <p className="flex justify-between"><span>{t('hero.transferFee')} (20%):</span> <span className="font-semibold">${commission.toFixed(2)}</span></p>
                <hr className="border-black/20 my-2"/>
                <p className="flex justify-between font-bold"><span>{t('hero.totalToPay')}:</span> <span>${totalToPay.toFixed(2)}</span></p>
                <p className="flex justify-between font-bold"><span>{t('hero.receiverGets')}:</span> <span>${receiverGets.toFixed(2)} USD</span></p>
              </div>
              
              <button 
                onClick={handleSend}
                className="mt-6 w-full bg-black text-[#f9da07] font-bold text-lg py-4 px-4 rounded-lg hover:bg-gray-800 transition-colors transform hover:scale-105"
              >
                {t('hero.cta')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;