import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const countries = [
  { nameKey: 'topSendingCountries.panama', flag: '🇵🇦', hasOffice: true },
  { nameKey: 'topSendingCountries.colombia', flag: '🇨🇴', hasOffice: true },
  { nameKey: 'topSendingCountries.mexico', flag: '🇲🇽', hasOffice: false },
  { nameKey: 'topSendingCountries.spain', flag: '🇪🇸', hasOffice: false },
  { nameKey: 'topSendingCountries.amsterdam', flag: '🇳🇱', hasOffice: true },
  { nameKey: 'topSendingCountries.eu', flag: '🇪🇺', hasOffice: false },
  { nameKey: 'topSendingCountries.uae', flag: '🇦🇪', hasOffice: true },
  { nameKey: 'topSendingCountries.italy', flag: '🇮🇹', hasOffice: false },
  { nameKey: 'topSendingCountries.canada', flag: '🇨🇦', hasOffice: false },
];

const TopSendingCountries: React.FC = () => {
  const { t } = useContext(LanguageContext);

  return (
    <section className="bg-yellow-50 py-16 sm:py-24">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-12">
          {t('topSendingCountries.title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {countries.map((country) => (
            <div key={country.nameKey} className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md border border-gray-200">
              <span className="text-5xl mb-2" role="img" aria-label={`${t(country.nameKey)} flag`}>{country.flag}</span>
              <p className="font-semibold text-black text-center">{t(country.nameKey)}</p>
              {country.hasOffice && (
                <span className="text-xs italic text-gray-600 mt-1">
                  *{t('topSendingCountries.offices')}*
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSendingCountries;
