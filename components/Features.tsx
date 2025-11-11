import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { GiftIcon } from './icons/GiftIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { TelegramIcon } from './icons/TelegramIcon';

const Features: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const featuresList = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-black" />,
      title: t('features.feature1Title'),
      description: t('features.feature1Desc'),
    },
    {
      icon: <GiftIcon className="h-8 w-8 text-black" />,
      title: t('features.feature2Title'),
      description: t('features.feature2Desc'),
    },
    {
      icon: <ClockIcon className="h-8 w-8 text-black" />,
      title: t('features.feature3Title'),
      description: t('features.feature3Desc'),
    },
    {
      icon: <CheckCircleIcon className="h-8 w-8 text-black" />,
      title: t('features.feature4Title'),
      description: t('features.feature4Desc'),
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black">
            {t('features.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feature, index) => (
            <div key={index} className="p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <div className="flex justify-center items-center mb-4 bg-[#f9da07] rounded-full h-16 w-16 mx-auto border-2 border-black">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-black text-center">{feature.title}</h3>
              <p className="mt-2 text-black/80 text-center">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#f9da07] p-8 rounded-2xl text-center border-2 border-black">
             <h3 className="text-2xl font-bold text-black">{t('features.supportTitle')}</h3>
             <p className="mt-2 text-black/80 max-w-xl mx-auto">{t('features.supportDesc')}</p>
             <div className="mt-6 flex justify-center items-center space-x-4">
                <a href="#" className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition-colors">
                    <WhatsAppIcon className="h-6 w-6 mr-2" />
                    <span>WhatsApp</span>
                </a>
                <a href="#" className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition-colors">
                    <TelegramIcon className="h-6 w-6 mr-2" />
                    <span>Telegram</span>
                </a>
             </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
