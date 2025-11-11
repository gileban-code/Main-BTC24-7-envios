import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { CUBAN_PROVINCES } from '../constants';

const SendingRegions: React.FC = () => {
    const { t } = useContext(LanguageContext);

    return (
        <section className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-black">
                    {t('regions.title')}
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    {t('regions.subtitle')}
                </p>
                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
                        {CUBAN_PROVINCES.map((province) => (
                            <div key={province.name} className="bg-yellow-50 border border-yellow-200 text-black p-4 rounded-lg shadow-sm">
                                <span className="font-medium">{province.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SendingRegions;