import React, { useContext } from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { DevicePhoneMobileIcon } from './icons/DevicePhoneMobileIcon';
import { LanguageContext } from '../contexts/LanguageContext';

const HowItWorks: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const steps = [
    {
      icon: <UserCircleIcon className="h-10 w-10 text-black" />,
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Desc'),
    },
    {
      icon: <DevicePhoneMobileIcon className="h-10 w-10 text-black" />,
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Desc'),
    },
    {
      icon: <CurrencyDollarIcon className="h-10 w-10 text-black" />,
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Desc'),
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#f9da07]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black">
            {t('howItWorks.title')}
          </h2>
          <p className="mt-4 text-lg text-black max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6 bg-yellow-200 rounded-2xl border-2 border-black shadow-lg">
                <div className="flex justify-center items-center mb-4 bg-[#f9da07] rounded-full h-20 w-20 mx-auto border-2 border-black">
                    {step.icon}
                </div>
              <h3 className="text-xl font-bold text-black">{step.title}</h3>
              <p className="mt-2 text-black/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;