import React, { useContext } from 'react';
import { LightningBoltIcon } from './icons/LightningBoltIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { LanguageContext } from '../contexts/LanguageContext';


const DownloadApp: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const features = [
    {
      icon: <LightningBoltIcon className="w-6 h-6 text-black" />,
      text: t('download.feature1'),
    },
    {
      icon: <LocationMarkerIcon className="w-6 h-6 text-black" />,
      text: t('download.feature2'),
    },
    {
      icon: <ArrowPathIcon className="w-6 h-6 text-black" />,
      text: t('download.feature3'),
    },
  ];

  return (
    <section className="bg-[#f9da07]">
      <div className="container mx-auto px-4 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="text-black">
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              {t('download.title')}
            </h2>
            <ul className="mt-8 space-y-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                   <div className="flex-shrink-0">
                     {feature.icon}
                   </div>
                  <span className="ml-4 text-lg">{feature.text}</span>
                </li>
              ))}
            </ul>
            <a href="#" className="mt-10 inline-block bg-black text-[#f9da07] text-lg font-bold py-4 px-8 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
              {t('download.button')}
            </a>
            <div className="mt-6 flex space-x-4">
                <div className="bg-black text-white p-3 rounded-lg text-center min-w-[120px]">
                    <p className="font-bold text-2xl">4.8</p>
                    <p className="text-sm">{t('download.appStore')}</p>
                </div>
                 <div className="bg-black text-white p-3 rounded-lg text-center min-w-[120px]">
                    <p className="font-bold text-2xl">4.6</p>
                    <p className="text-sm">{t('download.googlePlay')}</p>
                </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex justify-center">
            <img 
              src="https://instasize.com/api/image/860979d586886e69486b0a306964ff690b21b2ef61df4506753ba7956de4aee5.png" 
              alt={t('download.imageAlt')}
              className="rounded-2xl shadow-xl object-contain w-full h-auto max-h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;